import gc
import torch
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from app.agents.base_agent import BaseAgent
from app.core.model_loader import ModelLoader, AIConfig

class UpscaleAgent(BaseAgent):
    """
    PRO UPSCALER: SwinIR 4x + Smart Sharpening + VRAM Protection
    """
    def process(self, image: Image.Image, **kwargs) -> Image.Image:
        print("🔍 Action: Pro Upscale 4K (High Fidelity)")
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        w, h = image.size
        # Tính năng an toàn: Resize nếu ảnh gốc quá lớn để tránh cháy VRAM
        if w > 1280 or h > 1280:
            scale_down = 1280 / max(w, h)
            nw, nh = int(w * scale_down), int(h * scale_down)
            image = image.resize((nw, nh), Image.LANCZOS)
            print(f"⚠️ Input quá lớn, đã resize về {nw}x{nh} để an toàn cho VRAM.")

        proc, model = ModelLoader.get_upscaler()
        
        try:
            inp = proc(image, return_tensors="pt").to(AIConfig.DEVICE)
            inp["pixel_values"] = inp["pixel_values"].to(AIConfig.DTYPE)
        
            with torch.no_grad(): 
                out = model(**inp).reconstruction.data.squeeze().float().cpu().clamp_(0,1).numpy()
                
            out = (np.moveaxis(out, 0, -1) * 255).astype(np.uint8)
            img_out = Image.fromarray(out)
            
            # Smart Sharpening & Contrast
            img_out = img_out.filter(ImageFilter.UnsharpMask(radius=2, percent=120, threshold=3))
            enhancer = ImageEnhance.Contrast(img_out)
            img_out = enhancer.enhance(1.1) # Tăng 10% tương phản

            print(f"✅ Upscale xong: {img_out.size[0]}x{img_out.size[1]}")
            return img_out

        except RuntimeError as e:
            if "out of memory" in str(e).lower():
                print("❌ VRAM OOM! Chuyển sang chế độ Upscale An Toàn (CPU/Resize).")
                if torch.cuda.is_available():
                    torch.cuda.empty_cache()
                return image.resize((w*2, h*2), Image.BICUBIC).filter(ImageFilter.SHARPEN)
            return image
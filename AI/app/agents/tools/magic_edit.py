import cv2
import numpy as np
import torch
from PIL import Image
from huggingface_hub import hf_hub_download
from app.agents.base_agent import BaseAgent
from app.core.model_loader import ModelLoader, AIConfig

class MagicEditAgent(BaseAgent):
    def process(self, image: Image.Image, **kwargs) -> Image.Image:
        enhanced_prompt = kwargs.get("prompt", "").lower()
        style_cat = kwargs.get("style_category", "none").lower()
        
        pipe = ModelLoader.get_magic_pipe()
        depth_proc, depth_model = ModelLoader.get_depth_estimator()
        if not pipe: return image

        # Xóa LoRA cũ trước khi load LoRA mới
        pipe.unload_lora_weights()

        w, h = image.size
        target_res = 768 
        ratio = min(target_res/w, target_res/h)
        nw, nh = (int(w*ratio)//32)*32, (int(h*ratio)//32)*32
        img_resized = image.resize((nw, nh), Image.LANCZOS)
        
        # 1. Tạo Canny Map
        img_np = np.array(img_resized)
        canny_map = cv2.Canny(cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR), 50, 150)
        canny_final = Image.fromarray(np.concatenate([canny_map[:,:,None]]*3, axis=2))
        
        # 2. Tạo Depth Map
        depth_final = img_resized.convert("RGB")
        try:
            inputs = depth_proc(images=img_resized, return_tensors="pt").to(AIConfig.DEVICE)
            with torch.no_grad(): 
                d_out = depth_model(**inputs).predicted_depth
            d_map = torch.nn.functional.interpolate(d_out.unsqueeze(1), size=(nh, nw), mode="bicubic")
            d_map = (d_map - d_map.min()) / (d_map.max() - d_map.min())
            depth_final = Image.fromarray((d_map.squeeze().cpu().numpy()*255).astype(np.uint8)).convert("RGB")
        except: 
            pass

        # Helper tải LoRA
        def load_safe_lora(repo, file, adapter):
            try:
                p = hf_hub_download(repo_id=repo, filename=file)
                pipe.load_lora_weights(p, adapter_name=adapter)
                pipe.fuse_lora(adapter_name=adapter, lora_scale=1.0)
                return True
            except: return False

        ip_scale = 0.5
        scales = [0.5, 0.5]
        neg_prompt = "low quality, blurry, bad anatomy, distorted, messy, text, watermark"
        
        # 3. Phân loại và gán LoRA tương ứng
        if style_cat == "sticker":
            load_safe_lora("artificialguybr/StickersRedmond", "StickersRedmond.safetensors", "stk")
            enhanced_prompt = f"(StickersRedmond:1.3), die-cut sticker, white border, vector art, flat color, {enhanced_prompt}"
            ip_scale, scales = 0.35, [0.8, 0.2] 
            neg_prompt += ", 3d, realistic, shading"

        elif style_cat == "chibi":
            load_safe_lora("artificialguybr/CuteCartoonRedmond-V2", "CuteCartoonRedmond-CuteCartoon-CuteCartoonAF.safetensors", "chb")
            enhanced_prompt = f"(CuteCartoonAF:1.3), 3d chibi, cute toy, blind box style, smooth plastic, {enhanced_prompt}"
            ip_scale, scales = 0.6, [0.3, 0.7] 

        elif style_cat == "clay":
            load_safe_lora("artificialguybr/ClayAnimationRedmond", "ClayAnimationRedm.safetensors", "clay")
            enhanced_prompt = f"(Clay Animation:1.4), plasticine, stop motion, fingerprints, soft lighting, {enhanced_prompt}"
            ip_scale, scales = 0.65, [0.1, 0.9]

        elif style_cat == "sketch":
            load_safe_lora("artificialguybr/LineAniRedmond-LinearMangaSDXL-V2", "LineAniRedmondV2-Lineart-LineAniAF.safetensors", "skc")
            enhanced_prompt = f"(LineAniAF:1.4), monochrome sketch, graphite, pencil lines, {enhanced_prompt}"
            ip_scale, scales = 0.2, [0.95, 0.05]
            neg_prompt += ", color, 3d, photo"

        elif style_cat == "pixel":
            load_safe_lora("nerijs/pixel-art-xl", "pixel-art-xl.safetensors", "pxl")
            enhanced_prompt = f"pixel art, 8-bit, retro game asset, low res, blocky, {enhanced_prompt}"
            ip_scale, scales = 0.5, [0.6, 0.4] 
            neg_prompt += ", realistic, photo, smooth, 4k"

        pipe.set_ip_adapter_scale(ip_scale)
        print(f"⚙️ Vibe: {style_cat} | Steps: 18")
        
        # 4. Generate Image
        try:
            with torch.autocast(AIConfig.DEVICE):
                res = pipe(
                    prompt=f"{enhanced_prompt}, masterpiece, best quality, 8k",
                    negative_prompt=neg_prompt,
                    image=[canny_final, depth_final],
                    adapter_conditioning_scale=scales,
                    ip_adapter_image=image, 
                    guidance_scale=6.0,
                    num_inference_steps=18 
                ).images[0]
            pipe.unfuse_lora()
            return res
        except Exception as e:
            print(f"❌ GenAI Error: {e}")
            return image
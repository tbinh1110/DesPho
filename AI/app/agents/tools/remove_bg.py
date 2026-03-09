import torch
from torchvision import transforms
from PIL import Image
from app.agents.base_agent import BaseAgent
from app.core.model_loader import ModelLoader, AIConfig

class RemoveBgAgent(BaseAgent):
    def process(self, image: Image.Image, **kwargs) -> Image.Image:
        model = ModelLoader.get_birefnet()
        w, h = image.size
        trans = transforms.Compose([
            transforms.Resize((1024, 1024)), 
            transforms.ToTensor(), 
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        inp = trans(image.convert("RGB")).unsqueeze(0).to(AIConfig.DEVICE)
        with torch.no_grad():
            preds = model(inp)[-1].sigmoid().cpu().squeeze()
        mask = transforms.ToPILImage()(preds).resize((w, h))
        res = image.convert("RGBA")
        res.putalpha(mask)
        return res
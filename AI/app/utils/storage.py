import os
import cloudinary
import cloudinary.uploader
from datetime import datetime
from PIL import Image
from app.core.config import settings

# Cấu hình Cloudinary
cloudinary.config( 
  cloud_name = settings.CLOUDINARY_CLOUD_NAME, 
  api_key = settings.CLOUDINARY_API_KEY, 
  api_secret = settings.CLOUDINARY_API_SECRET,
  secure = True
)

class ImageManager:
    OUTPUT_DIR = "static/processed_images"

    def __init__(self):
        if not os.path.exists(self.OUTPUT_DIR): 
            os.makedirs(self.OUTPUT_DIR)

    def save(self, image: Image.Image, prefix="result") -> str:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        local_filename = f"{self.OUTPUT_DIR}/{prefix}_{timestamp}.png"
        image.save(local_filename, "PNG")
        try:
            # Upload lên Cloudinary
            res = cloudinary.uploader.upload(local_filename, folder="despho_ai_app")
            return res.get("secure_url")
        except Exception as e:
            print(f"Lỗi Cloudinary, lưu local: {e}")
            return local_filename
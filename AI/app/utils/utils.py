import io
from PIL import Image

def bytes_to_image(raw_bytes: bytes) -> Image.Image:
    return Image.open(io.BytesIO(raw_bytes)).convert("RGB")

def image_to_bytes(image: Image.Image) -> bytes:
    buf = io.BytesIO()
    ext = "PNG" if image.mode == "RGBA" else "JPEG"
    image.save(buf, format=ext)
    return buf.getvalue()
from PIL import Image
from app.agents.base_agent import BaseAgent

class MotionAgent(BaseAgent):
    def process(self, image: Image.Image, **kwargs) -> Image.Image:
        print("🎥 Action: Generating Motion frames...")
        frames = []
        
        # Tạo 15 khung hình với hiệu ứng scale (zoom in nhẹ)
        for i in range(15):
            scale = 1.0 + 0.05 * i
            nw, nh = int(image.width * scale), int(image.height * scale)
            
            # Cắt lấy vùng trung tâm sau khi phóng to
            f = image.resize((nw, nh)).crop((
                (nw - image.width) // 2, 
                (nh - image.height) // 2, 
                (nw + image.width) // 2, 
                (nh + image.height) // 2
            ))
            frames.append(f)
            
        # Gắn metadata vào frame đầu tiên để thư viện PIL biết đây là ảnh động
        frames[0].info['duration'] = 100
        frames[0].info['save_all'] = True
        frames[0].info['append_images'] = frames[1:]
        
        return frames[0]
import cv2
import numpy as np
from PIL import Image
from app.agents.base_agent import BaseAgent
from app.core.model_loader import ModelLoader

class ObjectRemoveAgent(BaseAgent):
    """
    SMART REMOVER: Xóa vật thể thông minh với Từ điển 80 loại đồ vật
    """
    # Từ điển ánh xạ từ khóa tiếng Việt/Anh sang YOLO Class ID (COCO Dataset)
    CLASS_MAP = {
        # Con người
        "người": [0], "cô gái": [0], "chàng trai": [0], "ai đó": [0], "person": [0], "people": [0],
        # Phương tiện
        "xe": [1, 2, 3, 5, 7], "ô tô": [2], "xe máy": [3], "xe đạp": [1], "bus": [5], "tàu": [8], 
        "car": [2], "bike": [1], "motor": [3],
        # Động vật
        "chó": [16], "mèo": [15], "chim": [14], "ngựa": [17], "cừu": [18], "bò": [19], "voi": [20], "gấu": [21],
        "dog": [16], "cat": [15], "bird": [14], "animal": [15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        # Phụ kiện & Đồ dùng cá nhân
        "balo": [24], "cặp": [24], "ba lô": [24], "túi": [26], "túi xách": [26], "ví": [27],
        "kính": [28], "mắt kính": [28], "nón": [42], "mũ": [42], "dù": [25], "ô": [25], 
        "giày": [29], "cà vạt": [27], "vali": [28],
        # Đồ điện tử
        "điện thoại": [67], "phone": [67], "iphone": [67], "laptop": [63], "máy tính": [63], 
        "chuột": [64], "phím": [66], "tv": [62], "tivi": [62], "đồng hồ": [85],
        # Đồ ăn thức uống
        "chai": [39], "lọ": [39], "cốc": [41], "ly": [41], "bát": [45], "tô": [45], 
        "táo": [47], "chuối": [46], "cam": [49], "bánh": [54, 55], "ghế": [56], "sofa": [57], "bàn": [60]
    }

    def process(self, image: Image.Image, **kwargs) -> Image.Image:
        prompt = kwargs.get("prompt", "").lower()
        print(f"🧹 Object Remove: Đang tìm vật thể trong lệnh '{prompt}'...")

        yolo = ModelLoader.get_yolo()
        lama = ModelLoader.get_lama()
        
        target_ids = []
        for keyword, ids in self.CLASS_MAP.items():
            if keyword in prompt:
                target_ids.extend(ids)
        
        if not target_ids: 
            print("⚠️ Không rõ vật thể, mặc định tìm: Người (Person)")
            target_ids = [0]
        
        img_np = np.array(image)
        results = yolo(img_np, conf=0.3, verbose=False)
        
        h, w = img_np.shape[:2]
        mask = np.zeros((h, w), dtype=np.uint8)
        found_count = 0

        for r in results:
            boxes = r.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                if cls_id in target_ids:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    
                
                    pad = 15 
                    x1 = max(0, x1 - pad)
                    y1 = max(0, y1 - pad)
                    x2 = min(w, x2 + pad)
                    y2 = min(h, y2 + pad)
                    
                    cv2.rectangle(mask, (x1, y1), (x2, y2), 255, -1)
                    found_count += 1
        
        if found_count == 0:
            print("❌ Không tìm thấy vật thể nào khớp lệnh.")
            return image

        print(f"✅ Đã tìm thấy {found_count} vật thể để xóa.")

       
        mask = cv2.dilate(mask, np.ones((20, 20), np.uint8), iterations=2)

        if lama:
            try:
                return lama(image, Image.fromarray(mask))
            except Exception as e:
                print(f"⚠️ LaMa Error: {e}. Fallback to OpenCV.")
        
        return Image.fromarray(cv2.inpaint(img_np, mask, 5, cv2.INPAINT_TELEA))
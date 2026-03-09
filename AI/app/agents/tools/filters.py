import cv2
import numpy as np
from PIL import Image
from app.agents.base_agent import BaseAgent

class ProFilterAgent(BaseAgent):    
    def _create_curve_lut(self, x_points, y_points):
        x = np.array(x_points, dtype=np.float32)
        y = np.array(y_points, dtype=np.float32)
        lut = np.interp(np.arange(256), x, y).astype(np.uint8)
        return lut

    def _adjust_saturation(self, img, factor):
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype("float32")
        hsv[:, :, 1] = hsv[:, :, 1] * factor
        hsv[:, :, 1] = np.clip(hsv[:, :, 1], 0, 255)
        return cv2.cvtColor(hsv.astype("uint8"), cv2.COLOR_HSV2BGR)

    def _add_grain(self, img, strength=0.08):
        noise = np.random.normal(0, 50, img.shape).astype(np.uint8)
        return cv2.addWeighted(img, 1 - strength, noise, strength, 0)

    def _apply_bloom(self, img, radius=15, intensity=0.3):
        blur = cv2.GaussianBlur(img, (0, 0), sigmaX=radius)
        return cv2.addWeighted(img, 1 - intensity, blur, intensity, 0)

    def _apply_vignette(self, img, strength=0.3):
        rows, cols = img.shape[:2]
        kernel_x = cv2.getGaussianKernel(cols, cols/2)
        kernel_y = cv2.getGaussianKernel(rows, rows/2)
        kernel = kernel_y * kernel_x.T
        mask = 255 * kernel / np.linalg.norm(kernel)
        mask = cv2.resize(mask, (cols, rows))
        mask_3ch = np.dstack([mask]*3) / 255
        vignette = (img * (1 - strength * (1 - mask_3ch))).astype(np.uint8)
        return vignette

    def _channel_mixer(self, img, r_boost=0, g_boost=0, b_boost=0):
        b, g, r = cv2.split(img)
        if b_boost != 0: b = cv2.add(b, b_boost) if b_boost > 0 else cv2.subtract(b, abs(b_boost))
        if g_boost != 0: g = cv2.add(g, g_boost) if g_boost > 0 else cv2.subtract(g, abs(g_boost))
        if r_boost != 0: r = cv2.add(r, r_boost) if r_boost > 0 else cv2.subtract(r, abs(r_boost))
        return cv2.merge((b, g, r))

    def process(self, image: Image.Image, **kwargs) -> Image.Image:
        cat = kwargs.get("style_category", "auto").lower()
        if cat == "none": cat = "auto"
        
        print(f"📸 Pro Filter V3: [{cat.upper()}]")
        
        img = np.array(image)
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        img = cv2.bilateralFilter(img, 3, 40, 40)


        if cat == "auto": 
            lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
            l, a, b = cv2.split(lab)
            clahe = cv2.createCLAHE(clipLimit=1.5, tileGridSize=(8, 8))
            l = clahe.apply(l)
            img = cv2.cvtColor(cv2.merge((l, a, b)), cv2.COLOR_LAB2BGR)
            img = self._adjust_saturation(img, 1.15)

        elif cat == "cine": 
            curve = self._create_curve_lut([0, 50, 200, 255], [0, 30, 220, 255])
            img = cv2.LUT(img, curve)
            img = self._channel_mixer(img, r_boost=15, b_boost=25, g_boost=-5)
            img = self._apply_vignette(img, 0.3)

        elif cat == "vintage": 
            curve = self._create_curve_lut([0, 255], [30, 220]) 
            img = cv2.LUT(img, curve)
            sepia_kernel = np.array([[0.272, 0.534, 0.131],
                                     [0.349, 0.686, 0.168],
                                     [0.393, 0.769, 0.189]])
            img = cv2.transform(img, sepia_kernel)
            img = self._adjust_saturation(img, 0.7)
            img = self._add_grain(img, 0.15)

        elif cat == "bw": 
            img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            img = cv2.equalizeHist(img) 
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
            curve = self._create_curve_lut([0, 100, 255], [0, 70, 255])
            img = cv2.LUT(img, curve)

        elif cat == "golden": 
            img = self._channel_mixer(img, r_boost=40, g_boost=25, b_boost=-15)
            img = cv2.convertScaleAbs(img, alpha=1.1, beta=10)
            img = self._apply_bloom(img, intensity=0.4)

        elif cat == "cyber": 
            img = self._channel_mixer(img, r_boost=35, b_boost=45, g_boost=-20)
            img = self._adjust_saturation(img, 1.4)
            curve = self._create_curve_lut([0, 60, 190, 255], [0, 40, 230, 255])
            img = cv2.LUT(img, curve)
            img = cv2.convertScaleAbs(img, alpha=1.0, beta=-15)

        elif cat == "pastel": 
            img = cv2.convertScaleAbs(img, alpha=1.1, beta=25) # High key
            img = self._channel_mixer(img, r_boost=20, b_boost=15)
            curve = self._create_curve_lut([0, 255], [20, 240])
            img = cv2.LUT(img, curve)
            img = self._apply_bloom(img, intensity=0.3)

        elif cat == "nordic": 
            img[:, :, 0] = cv2.add(img[:, :, 0], 25) 
            img[:, :, 1] = cv2.add(img[:, :, 1], 10) 
            img = cv2.convertScaleAbs(img, alpha=1.2, beta=-30)
            img = self._add_grain(img, 0.2)
                
        elif cat == "vivid": 
            img = self._adjust_saturation(img, 1.6) 
            kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
            img = cv2.filter2D(img, -1, kernel)
            curve = self._create_curve_lut([0, 128, 255], [0, 140, 255])
            img = cv2.LUT(img, curve)

        elif cat == "night": 
            img = self._channel_mixer(img, b_boost=40, g_boost=10, r_boost=-20)
            img = cv2.convertScaleAbs(img, alpha=1.0, beta=-40)
            img = self._add_grain(img, 0.25)
            img = self._apply_vignette(img, 0.4)

        return Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

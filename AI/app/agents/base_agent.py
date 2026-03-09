from abc import ABC, abstractmethod
from PIL import Image

class BaseAgent(ABC):
    @abstractmethod
    def process(self, image: Image.Image, **kwargs) -> Image.Image:
        pass
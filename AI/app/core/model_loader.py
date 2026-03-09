import torch
import gc
from diffusers import StableDiffusionXLAdapterPipeline, T2IAdapter, DPMSolverMultistepScheduler, MultiAdapter, AutoencoderKL
from transformers import AutoModelForImageSegmentation, DPTImageProcessor, DPTForDepthEstimation, Swin2SRImageProcessor, Swin2SRForImageSuperResolution
from ultralytics import YOLO
from simple_lama_inpainting import SimpleLama

class AIConfig:
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
    DTYPE = torch.float16 if torch.cuda.is_available() else torch.float32

    SDXL_BASE = "stabilityai/stable-diffusion-xl-base-1.0"
    ADAPTER_ID = "TencentARC/t2i-adapter-canny-sdxl-1.0"
    BIREFNET_ID = "ZhengPeng7/BiRefNet" 
    YOLO_MODEL = "yolo11m.pt" 
    UPSCALE_MODEL_ID = "caidas/swin2SR-realworld-sr-x4-64-bsrgan-psnr"

class ModelLoader:
    _magic_pipe = None
    _depth_model = None; _depth_proc = None
    _birefnet = None; _yolo = None; _upscale = None
    _lama = None

    @classmethod
    def get_magic_pipe(cls):
        if cls._magic_pipe is None:
            print("⏳ Loading Magic AI (SDXL + Adapters)...")
            try:
                adapter_canny = T2IAdapter.from_pretrained(AIConfig.ADAPTER_ID, torch_dtype=AIConfig.DTYPE, variant="fp16")
                adapter_depth = T2IAdapter.from_pretrained("TencentARC/t2i-adapter-depth-midas-sdxl-1.0", torch_dtype=AIConfig.DTYPE, variant="fp16")
                adapters = MultiAdapter([adapter_canny, adapter_depth])
                pipe = StableDiffusionXLAdapterPipeline.from_pretrained(
                    AIConfig.SDXL_BASE, 
                    vae=AutoencoderKL.from_pretrained("madebyollin/sdxl-vae-fp16-fix", torch_dtype=AIConfig.DTYPE),
                    adapter=adapters, torch_dtype=AIConfig.DTYPE, variant="fp16", use_safetensors=True
                )
                if AIConfig.DEVICE == "cuda":
                    pipe.to(AIConfig.DEVICE) 
                    pipe.vae.enable_tiling()

                pipe.load_ip_adapter("h94/IP-Adapter", subfolder="sdxl_models", weight_name="ip-adapter_sdxl.bin")
                pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config, use_karras_sigmas=True)
                cls._magic_pipe = pipe
                print("Pipeline Loaded")
            except Exception as e:
                print(f" Pipeline Error: {e}"); return None
        return cls._magic_pipe

    @classmethod
    def get_lama(cls):
        if cls._lama is None:
            print(" Loading LaMa Inpainter...")
            cls._lama = SimpleLama()
        return cls._lama
    
    @classmethod
    def get_depth_estimator(cls):
        if cls._depth_model is None:
            cls._depth_proc = DPTImageProcessor.from_pretrained("Intel/dpt-hybrid-midas")
            cls._depth_model = DPTForDepthEstimation.from_pretrained("Intel/dpt-hybrid-midas").to(AIConfig.DEVICE)
        return cls._depth_proc, cls._depth_model
    
    @classmethod
    def get_birefnet(cls):
        if cls._birefnet is None:
            cls._birefnet = AutoModelForImageSegmentation.from_pretrained(AIConfig.BIREFNET_ID, trust_remote_code=True).to(AIConfig.DEVICE)
        return cls._birefnet

    @classmethod
    def get_yolo(cls):
        if cls._yolo is None: 
            cls._yolo = YOLO(AIConfig.YOLO_MODEL)
        return cls._yolo
    
    @classmethod
    def get_upscaler(cls):
        if cls._upscale is None:
            p = Swin2SRImageProcessor.from_pretrained(AIConfig.UPSCALE_MODEL_ID)
            m = Swin2SRForImageSuperResolution.from_pretrained(AIConfig.UPSCALE_MODEL_ID, torch_dtype=AIConfig.DTYPE).to(AIConfig.DEVICE)
            cls._upscale = (p, m)
        return cls._upscale

def clear_gpu_memory():
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
        gc.collect()
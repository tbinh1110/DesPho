import os
import base64
from celery import Celery
from app.agents.master_agent import MasterAgent
from app.utils.utils import bytes_to_image

# 1. Khởi tạo kết nối Celery với Redis
redis_url = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
celery_app = Celery(
    "ai_worker",
    broker=redis_url,
    backend=redis_url
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Asia/Ho_Chi_Minh',
    enable_utc=True,
)

# Biến global để lưu MasterAgent. 
# Giúp Worker chỉ phải load Model AI 1 lần duy nhất vào VRAM khi khởi động.
agent = None

@celery_app.task(name="process_image_task", bind=True)
def process_image_task(self, image_base64: str, task_name: str):
    global agent
    if agent is None:
        print("⏳ Celery Worker: Đang khởi tạo Master Agent và nạp Model AI...")
        agent = MasterAgent()

    try:
        # Giải mã ảnh từ Base64 về dạng PIL Image
        image_bytes = base64.b64decode(image_base64)
        input_image = bytes_to_image(image_bytes)

        print(f"🚀 Worker đang xử lý task: {task_name}")
        
        # Chạy AI (Quá trình này ngốn nhiều thời gian nhất)
        result = agent.run(task_name, input_image)

        if not result.get("success"):
            return {"success": False, "error": result.get("error")}

        # Format lại đường dẫn trả về
        output_path = result.get("output_path")
        if output_path and not output_path.startswith("http"):
            filename = os.path.basename(output_path)
            output_path = f"/static/processed_images/{filename}"

        return {
            "success": True, 
            "output_path": output_path, 
            "tool_used": result.get("tool")
        }

    except Exception as e:
        return {"success": False, "error": str(e)}
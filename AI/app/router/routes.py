import base64
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from worker import process_image_task, celery_app

router = APIRouter()

@router.post("/process-image-async")
async def process_image_async(file: UploadFile = File(...), task: str = Form(...)):
    try:
        contents = await file.read()
        
        image_b64 = base64.b64encode(contents).decode('utf-8')
        
        job = process_image_task.delay(image_b64, task)
        
        return JSONResponse(content={
            "success": True,
            "message": "Ảnh đã được đưa vào hàng đợi xử lý",
            "task_id": job.id 
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})


@router.get("/task-status/{task_id}")
async def get_task_status(task_id: str):
    result = celery_app.AsyncResult(task_id)
    
    if result.state == 'PENDING':
        return JSONResponse(content={"status": "pending", "message": "Đang xếp hàng hoặc đang xử lý..."})
    elif result.state == 'SUCCESS':
        return JSONResponse(content={"status": "completed", "result": result.result})
    elif result.state == 'FAILURE':
        return JSONResponse(content={"status": "failed", "error": str(result.info)})
    else:
        return JSONResponse(content={"status": result.state})
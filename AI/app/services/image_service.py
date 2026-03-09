import os
from app.utils.utils import bytes_to_image
from app.agents.master_agent import MasterAgent

class ImageService:
    def __init__(self):
        self.agent = MasterAgent()

    async def process_image(self, file_data: bytes, task: str) -> dict:
        try:
            input_image = bytes_to_image(file_data)
            result = self.agent.run(task, input_image)
            
            if not result.get("success"):   
                return {"success": False, "error": result.get("error", "Agent Error"), "path": None}
            
            output_full_path = result.get("output_path")
            if output_full_path:
                if output_full_path.startswith("http"): 
                    relative_path = output_full_path
                else: 
                    filename = os.path.basename(output_full_path)
                    relative_path = f"/static/processed_images/{filename}"
            else:
                relative_path = None

            return {"success": True, "output_path": relative_path, "tool_used": result.get("tool", "unknown")}
        except Exception as e:
            return {"success": False, "error": str(e)}
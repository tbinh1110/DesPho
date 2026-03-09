import json
import re
from openai import OpenAI
from app.utils.storage import ImageManager
from app.core.model_loader import clear_gpu_memory

# Import Tools
from app.agents.tools.magic_edit import MagicEditAgent
from app.agents.tools.remove_bg import RemoveBgAgent
from app.agents.tools.object_remove import ObjectRemoveAgent
from app.agents.tools.upscale import UpscaleAgent
from app.agents.tools.filters import ProFilterAgent
from app.agents.tools.motion import MotionAgent

class MasterAgent:
    def __init__(self):
        self.client = OpenAI(base_url="http://localhost:1234/v1", api_key="lm-studio", timeout=15.0)
        self.img_manager = ImageManager()
        self.tools = {
            "magic_edit": MagicEditAgent(), "remove_bg": RemoveBgAgent(),
            "object_remove": ObjectRemoveAgent(), "upscale": UpscaleAgent(),
            "generate_video": MotionAgent(), "filter": ProFilterAgent()
        }

    def _ask_brain(self, query: str):
        q = query.lower()
        if "vivid" in q: return {"tool": "filter", "category": "vivid", "enhanced_prompt": query}
        if "remove" in q and "bg" in q: return {"tool": "remove_bg", "category": "none", "enhanced_prompt": query}

        sys_prompt = """
        Analyze user request. Return JSON only:
        {"tool": "magic_edit" | "filter" | "remove_bg" | "object_remove" | "upscale", "category": "...", "enhanced_prompt": "..."}
        """
        try:
            res = self.client.chat.completions.create(model="local-model", messages=[{"role":"system","content":sys_prompt},{"role":"user","content":query}])
            return json.loads(re.search(r'\{.*\}', res.choices[0].message.content, re.DOTALL).group(0))
        except: return {"tool": "magic_edit", "category": "none", "enhanced_prompt": query}

    def run(self, user_query: str, image_input) -> dict:
        try:
            plan = self._ask_brain(user_query)
            tool = plan.get("tool", "magic_edit")
            cat = plan.get("category", "none")
            prompt = plan.get("enhanced_prompt", "")
            
            print(f"Executing: {tool} | Style: {cat}")
            agent = self.tools.get(tool, self.tools["magic_edit"])
            
            clear_gpu_memory() 
            res_img = agent.process(image_input, prompt=prompt, style_category=cat)
            clear_gpu_memory() 
            
            return {"success": True, "tool": tool, "output_path": self.img_manager.save(res_img, prefix=tool)}
        except Exception as e: 
            import traceback
            traceback.print_exc()
            return {"success": False, "error": str(e)}
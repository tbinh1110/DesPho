import axios from 'axios';

export const API_BASE_URL = 'http://127.0.0.1:8000';

export const processImageService = async (file, taskId, params = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    let aiPrompt = "";

    switch (taskId) {
        case 'remove_bg': aiPrompt = "Action: remove bg (xóa nền)"; break;
        case 'detect_objects': aiPrompt = `Action: remove object ${params.prompt || "vật thể"} (xóa vật)`; break;
        case 'magic_edit': aiPrompt = `Action: magic edit biến thành ${params.prompt || "chibi 3d"}`; break;
        case 'generate_video': aiPrompt = "Action: generate motion video (tạo video)"; break;
        case 'filter': aiPrompt = `Action: filter color ${params.prompt || "auto"} (chỉnh màu)`; break;
        case 'upscale': aiPrompt = "Action: upscale 4k (làm nét)"; break;
        default: aiPrompt = "Action: auto fix ";
    }

    formData.append('task', aiPrompt);

    try {
        const response = await axios.post(`${API_BASE_URL}/api/v1/process-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 600000, 
        });

        if (response.data && response.data.output_path) {
            console.log("Kết quả từ Server:", response.data.output_path);

            if (response.data.output_path.startsWith('http')) {
                return {
                    ...response.data,
                    processed_url: response.data.output_path 
                };
            }
            
            const filename = response.data.output_path.split(/[/\\]/).pop();
            return {
                ...response.data,
                processed_url: `${API_BASE_URL}/static/processed_images/${filename}`
            };
        }
        
        return response.data;

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
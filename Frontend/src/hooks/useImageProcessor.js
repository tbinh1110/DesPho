import { useState } from 'react';
import { processImageService } from '../services/imageService';

export const useImageProcessor = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    // Xử lý khi chọn file ảnh từ máy
    const handleFileSelect = (selectedFile) => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setFile(selectedFile);
            setPreview(objectUrl);
            setResult(null);
        }
    };

    // Hàm chạy AI
    const runAI = async (taskId, params) => {
        if (!file) return;

        setLoading(true);
        try {
            const data = await processImageService(file, taskId, params);
            if (data.processed_url) {
                setResult(data.processed_url);

                setHistory(prev => [{
                    id: Date.now(),
                    original: preview,
                    result: data.processed_url,
                    tool: taskId,
                    date: new Date().toLocaleTimeString()
                }, ...prev]);
            } else {
                alert("Không nhận được kết quả từ Server!");
            }
        } catch (error) {
            alert("Lỗi xử lý: " + (error.message || "Server error"));
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => setHistory([]);

    const restoreFromHistory = (item) => {
        if (!item) return;
        setResult(item.result);
    };

    const resetEditor = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
    };

    return {
        file,
        preview,
        result,
        loading,
        history,
        handleFileSelect,
        runAI,
        clearHistory,
        restoreFromHistory,
        resetEditor
    };
};
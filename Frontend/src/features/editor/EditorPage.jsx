import React, { useState, useMemo } from 'react';
import {
    Upload, Scissors, Maximize, Layers, ScanEye, Sparkles, X,
    ZoomIn, ZoomOut, History, Trash2, Download, MonitorPlay, Film, Columns, Eye
} from 'lucide-react';
import ImageSlider from './components/ImageSlider';
import MagicLens from './components/MagicLens';
import Toolbar from './components/Toolbar';
import { useImageProcessor } from '../../hooks/useImageProcessor';

const DANH_SACH_CONG_CU = [
    { id: 'remove_bg', name: 'Xóa Phông', icon: <Scissors size={20} /> },
    { id: 'detect_objects', name: 'Xóa Vật Thể', icon: <ScanEye size={20} />, requiresPrompt: true, placeholder: "Tên vật cần xóa..." },
    { id: 'magic_edit', name: 'Biến Đổi AI', icon: <Sparkles size={20} />, requiresPrompt: true, placeholder: "Mô tả yêu cầu..." },
    { id: 'generate_video', name: 'Hiệu Ứng Video', icon: <Film size={20} /> },
    { id: 'filter', name: 'Màu Chuyên Nghiệp', icon: <Layers size={20} /> },
    { id: 'upscale', name: 'Nâng Nét 4K', icon: <Maximize size={20} />, params: { scale: 2 } },
];

const EditorPage = () => {
    const {
        file, preview, result, loading, history,
        handleFileSelect, runAI, clearHistory, restoreFromHistory, resetEditor
    } = useImageProcessor();

    const [dangChonTool, setDangChonTool] = useState(DANH_SACH_CONG_CU[0]);
    const [noiDungLenh, setNoiDungLenh] = useState("");
    const [mucZoom, setMucZoom] = useState(1);
    const [moLichSu, setMoLichSu] = useState(false);
    const [kieuXem, setKieuXem] = useState('truot');

    const laVideo = useMemo(() => result && (result.endsWith('.mp4') || result.endsWith('.gif')), [result]);

    const xuLyTaiVe = async () => {
        if (!result) return;
        try {
            const res = await fetch(result, { mode: 'cors' });
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `DesPho_Pro_${Date.now()}.png`;
            a.click();
        } catch (e) { window.open(result, '_blank'); }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
            <header className="flex items-center justify-between h-16 px-6 bg-gray-900 border-b border-white/5 z-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
                        <MonitorPlay size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-none">DesPho Studio</h1>
                        <span className="text-[10px] text-blue-400 font-black tracking-widest uppercase">Bản Pro</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => setMoLichSu(!moLichSu)} className={`p-2 rounded-lg transition-all ${moLichSu ? 'bg-blue-600' : 'hover:bg-white/10 text-gray-400'}`}>
                        <History size={20} />
                    </button>
                    {result && (
                        <button onClick={xuLyTaiVe} className="flex items-center gap-2 px-5 py-2 bg-white text-black rounded-lg font-bold text-sm hover:scale-105 active:scale-95 transition-all">
                            <Download size={16} /> <span>LƯU LẠI</span>
                        </button>
                    )}
                </div>
            </header>

            <div className="flex flex-1 relative overflow-hidden">
                <main className="flex-1 flex flex-col relative bg-black">
                    <div className="flex-1 flex items-center justify-center relative p-6">
                        {!preview ? (
                            <label className="flex flex-col items-center justify-center w-full max-w-2xl aspect-video border-2 border-dashed border-gray-800 rounded-3xl hover:bg-white/5 cursor-pointer transition-all">
                                <Upload size={40} className="mb-4 text-blue-500" />
                                <span className="text-xl font-bold text-gray-300">Tải ảnh lên hệ thống</span>
                                <input type="file" hidden onChange={(e) => handleFileSelect(e.target.files[0])} />
                            </label>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <div
                                    className="relative transition-transform duration-300 ease-out"
                                    style={{ transform: `scale(${mucZoom})`, width: '100%', height: '100%', maxWidth: '1200px' }}
                                >
                                    {result ? (
                                        kieuXem === 'lens' && !laVideo ?
                                            <MagicLens original={preview} processed={result} /> :
                                            <ImageSlider original={preview} processed={result} isLoading={loading} />
                                    ) : (
                                        <img src={preview} className="w-full h-full object-contain rounded-xl" alt="Input" />
                                    )}
                                </div>

                                {result && !loading && !laVideo && (
                                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1 p-1 bg-gray-900/90 backdrop-blur rounded-full border border-white/10 z-50 shadow-2xl">
                                        <button onClick={() => setKieuXem('truot')} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${kieuXem === 'truot' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}`}>Thanh Trượt</button>
                                        <button onClick={() => setKieuXem('lens')} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${kieuXem === 'lens' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}`}>Kính Lúp</button>
                                    </div>
                                )}
                            </div>
                        )}

                        {loading && (
                            <div className="absolute inset-0 z-100 bg-black/60 backdrop-blur flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                <p className="mt-4 font-bold tracking-widest animate-pulse">ĐANG XỬ LÝ AI...</p>
                            </div>
                        )}
                    </div>

                    <Toolbar
                        tools={DANH_SACH_CONG_CU}
                        activeTool={dangChonTool}
                        setActiveTool={setDangChonTool}
                        onRun={() => runAI(dangChonTool.id, { prompt: noiDungLenh })}
                        loading={loading}
                        disabled={!file || loading}
                        promptText={noiDungLenh}
                        setPromptText={setNoiDungLenh}
                    />
                </main>

                <aside className={`absolute top-0 right-0 h-full w-80 bg-gray-950 border-l border-white/10 transition-transform duration-300 z-100 ${moLichSu ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-5 flex items-center justify-between bg-gray-900 border-b border-white/5">
                        <span className="font-bold text-xs text-gray-500 uppercase tracking-widest">Lịch sử</span>
                        <button onClick={clearHistory} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                    <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
                        {history.map((item) => (
                            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-white/5 bg-gray-900/50 hover:border-blue-500/50 transition-all cursor-pointer" onClick={() => restoreFromHistory(item)}>
                                {item.result.endsWith('.mp4') || item.result.endsWith('.gif') ? (
                                    <div className="w-full h-32 flex items-center justify-center bg-black"><Film size={32} className="text-gray-700" /></div>
                                ) : (
                                    <img src={item.result} className="w-full h-32 object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt="History" />
                                )}
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default EditorPage;
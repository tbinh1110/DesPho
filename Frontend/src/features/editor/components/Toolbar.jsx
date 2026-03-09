import React from 'react';
import { Play, Sparkles, Check, Video, Loader2, ChevronRight, Wand2 } from 'lucide-react';

const GOI_Y_AI = {
    detect_objects: ["Người", "Xe cộ", "Chó Mèo", "Văn bản", "Ghế", "Cốc nước", "Túi xách"],
    magic_edit: [
        "Sticker Cute",
        "Chibi 3D",
        "Đất Nặn (Clay)",
        "Tranh Vẽ (Sketch)",
        "Pixel Art",
        "Cyberpunk City"
    ],
    object_remove: ["Người thừa", "Văn bản", "Vật thể", "Mụn/Vết thâm"]
};

const BO_LOC_MAU = [
    { label: "Auto Fix", value: "auto", color: "from-white to-gray-300" },
    { label: "Cinematic", value: "cine", color: "from-teal-800 to-orange-600" },
    { label: "Vintage", value: "vintage", color: "from-yellow-700 to-yellow-900" },
    { label: "B&W Noir", value: "bw", color: "from-gray-900 to-black" },
    { label: "Golden Hour", value: "golden", color: "from-yellow-400 to-orange-500" },
    { label: "Cyberpunk", value: "cyber", color: "from-purple-600 to-blue-500" },
    { label: "Pastel", value: "pastel", color: "from-pink-200 to-blue-100" },
    { label: "Nordic", value: "nordic", color: "from-slate-300 to-slate-500" },
    { label: "Vivid", value: "vivid", color: "from-green-400 to-blue-500" },
    { label: "Night Vision", value: "night", color: "from-green-900 to-black" },
];

const Toolbar = ({ tools, activeTool, setActiveTool, onRun, loading, disabled, promptText, setPromptText }) => {

    const batSuKienPhim = (e) => {
        if (e.key === 'Enter' && !disabled) onRun();
    };

    const thayDoiCongCu = (tool) => {
        setActiveTool(tool);
        setPromptText("");
    };

    return (
        <div className="flex items-center gap-2 h-40 px-2 transition-all border-t border-white/10 bg-slate-900/95 backdrop-blur-xl md:px-6 md:gap-6 shadow-2xl z-50 select-none">

            <div className="flex items-center shrink-0 w-1/3 gap-2 py-2 overflow-x-auto no-scrollbar snap-x min-w-0 md:w-auto md:max-w-none">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => thayDoiCongCu(tool)}
                        className={`group flex flex-col items-center justify-center  rounded-xl transition-all duration-200 border snap-start shrink-0 
                            ${activeTool.id === tool.id
                                ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-lg'
                                : 'bg-transparent border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-200'
                            }`}
                    >
                        <div className={`mb-1 p-1.5 rounded-full transition-colors ${activeTool.id === tool.id ? 'bg-blue-500 text-white' : 'bg-white/5 group-hover:bg-white/10'}`}>
                            {tool.icon}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-center line-clamp-1 w-full px-1">{tool.name}</span>
                    </button>
                ))}
            </div>

            <div className="shrink-0 hidden w-px h-20 bg-white/10 md:block" />

            <div className="flex-1 flex flex-col justify-center h-full min-w-0 overflow-hidden">

                {activeTool.id === 'filter' ? (
                    <div className="flex flex-col justify-center w-full h-full animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-between mb-1 px-1">
                            <span className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                <Sparkles size={10} /> Chọn Preset Màu
                            </span>
                            {promptText && (
                                <span className="max-w-25 px-2 text-[10px] font-mono text-right text-blue-400 truncate bg-blue-900/30 rounded ml-2">
                                    {BO_LOC_MAU.find(p => p.value === promptText)?.label || promptText}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-rows-2 grid-flow-col gap-2 w-full h-22 overflow-x-auto no-scrollbar pb-1">
                            {BO_LOC_MAU.map((preset) => (
                                <button
                                    key={preset.value}
                                    onClick={() => setPromptText(preset.value)}
                                    className={`relative flex items-center gap-2 px-3  rounded-lg border transition-all 
                                        ${promptText === preset.value
                                            ? 'border-blue-500 bg-blue-600/20 text-white'
                                            : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                                        }`}
                                >
                                    <div className={`shrink-0 w-5 h-5 rounded-full bg-linear-to-br ${preset.color} ring-1 ring-white/10 shadow-sm`} />
                                    <span className="flex-1 text-xs font-bold text-left truncate">{preset.label}</span>
                                    {promptText === preset.value && (
                                        <div className="shrink-0 text-blue-400">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : activeTool.requiresPrompt ? (
                    <div className="flex flex-col justify-center w-full h-full gap-2 animate-in fade-in slide-in-from-bottom-2">
                        <span className="flex items-center gap-1 px-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <Wand2 size={10} /> Yêu cầu cho Agent AI
                        </span>

                        <div className="relative w-full">
                            <input
                                type="text"
                                value={promptText}
                                onChange={(e) => setPromptText(e.target.value)}
                                onKeyDown={batSuKienPhim}
                                placeholder={activeTool.placeholder || "Mô tả yêu cầu..."}
                                className="w-full py-3 pl-4 pr-10 text-sm text-white transition-all border rounded-xl bg-black/40 border-white/10 focus:outline-none focus:border-blue-500/50 shadow-inner truncate font-medium"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">
                                <ChevronRight size={16} />
                            </div>
                        </div>

                        {GOI_Y_AI[activeTool.id] && (
                            <div className="flex w-full gap-2 pb-1 overflow-x-auto no-scrollbar">
                                {GOI_Y_AI[activeTool.id].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setPromptText(s)}
                                        className={`shrink-0 px-3 py-1 text-[10px] font-black uppercase tracking-tighter transition-all border rounded-md whitespace-nowrap
                                             ${promptText === s
                                                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-lg'
                                                : 'border-white/5 bg-white/5 text-slate-500 hover:bg-white/10 hover:text-blue-400'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="flex items-center w-full gap-3 px-4 py-4 border border-dashed rounded-2xl bg-white/5 border-white/5 text-slate-400 md:gap-4 md:px-8">
                            {activeTool.id === 'generate_video' ? <Video size={24} className="shrink-0 text-purple-400 shadow-xl" /> : <Sparkles size={24} className="shrink-0 text-yellow-400 shadow-xl" />}
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-black text-slate-200 uppercase tracking-widest truncate">Chế độ tự động</span>
                                <span className="text-[11px] font-medium truncate opacity-60 italic">
                                    {activeTool.id === 'generate_video' ? "AI đang tính toán chuyển động vật thể..." : "Hệ thống sẽ tự nhận diện và tối ưu hóa điểm ảnh."}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={onRun}
                disabled={disabled || (activeTool.requiresPrompt && !promptText.trim())}
                className={`relative group flex shrink-0 items-center justify-center w-24 h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all overflow-hidden shadow-2xl md:w-32
                    ${disabled || (activeTool.requiresPrompt && !promptText.trim())
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        : 'bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-blue-500/20'
                    }`}
            >
                <div className="absolute inset-0 transition-transform duration-300 translate-y-full bg-white/20 group-hover:translate-y-0" />
                {loading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="hidden md:inline uppercase">Đợi AI</span>
                    </div>
                ) : (
                    <div className="relative z-10 flex items-center gap-2">
                        <Play size={18} fill="currentColor" />
                        <span className="hidden md:inline uppercase">Xử lý</span>
                        <span className="md:hidden uppercase">Chạy</span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default Toolbar;
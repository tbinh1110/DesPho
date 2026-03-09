import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, ArrowRight, Zap, FileImage, Users, User, Settings, Moon, Sun } from 'lucide-react';

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    const commands = [
        { id: 'home', label: 'Về Trang Chủ', icon: <Command size={18} />, action: () => navigate('/') },
        { id: 'editor', label: 'Mở Studio AI', icon: <FileImage size={18} />, action: () => navigate('/editor') },
        { id: 'community', label: 'Khám phá Cộng Đồng', icon: <Users size={18} />, action: () => navigate('/community') },
        { id: 'profile', label: 'Hồ sơ cá nhân', icon: <User size={18} />, action: () => navigate('/profile') },
        { id: 'settings', label: 'Cài đặt hệ thống', icon: <Settings size={18} />, action: () => navigate('/settings') },
        { id: 'new_project', label: 'Tạo dự án mới...', icon: <Zap size={18} className="text-yellow-400" />, action: () => navigate('/editor') },
    ];
    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSelect = (cmd) => {
        cmd.action();
        setIsOpen(false);
        setQuery('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0  flex items-start justify-center pt-[20vh] px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
            <div className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                <div className="flex items-center px-4 py-4 border-b border-white/5">
                    <Search className="text-slate-400 mr-3" size={20} />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Nhập lệnh hoặc tìm kiếm..."
                        className="flex-1 bg-transparent text-lg text-white placeholder-slate-500 outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">ESC</div>
                </div>

                <div className=" overflow-y-auto p-2">
                    {filteredCommands.length > 0 ? (
                        filteredCommands.map((cmd, index) => (
                            <button
                                key={cmd.id}
                                onClick={() => handleSelect(cmd)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${index === activeIndex ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                                    }`}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${index === activeIndex ? 'bg-white/20' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                                        {cmd.icon}
                                    </div>
                                    <span className="font-medium">{cmd.label}</span>
                                </div>
                                {index === activeIndex && <ArrowRight size={16} className="opacity-50" />}
                            </button>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            Không tìm thấy lệnh nào phù hợp.
                        </div>
                    )}
                </div>

                <div className="px-4 py-2 bg-slate-900 border-t border-white/5 text-[10px] text-slate-500 flex justify-between">
                    <span>Di chuyển: ↑ ↓</span>
                    <span>Chọn: Enter</span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Zap, Search, Filter, Sparkles, User } from 'lucide-react';

const Community = () => {
    const navigate = useNavigate();
    const [activeTag, setActiveTag] = useState('All');

    // Mock Data
    const showcases = [
        { id: 1, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop", title: "Chân dung Cyberpunk", author: "Nam Design", likes: 128, tool: "Magic Edit", tag: "Portrait" },
        { id: 2, img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop", title: "Phòng khách tương lai", author: "Sarah AI", likes: 85, tool: "Upscale 4K", tag: "Interior" },
        { id: 3, img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop", title: "Sản phẩm giày Nike", author: "Shop Giày X", likes: 240, tool: "Remove BG", tag: "Product" },
        { id: 4, img: "https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=600&auto=format&fit=crop", title: "Poster sự kiện", author: "Creative Agency", likes: 56, tool: "Text to Image", tag: "Design" },
        { id: 5, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop", title: "Người mẫu thời trang", author: "Vogue AI", likes: 312, tool: "Face Retouch", tag: "Portrait" },
        { id: 6, img: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop", title: "Background Gaming", author: "Gamer Pro", likes: 199, tool: "Magic Edit", tag: "Design" },
    ];

    const tags = ["All", "Portrait", "Product", "Design", "Interior"];

    const handleRemix = (item) => {
        navigate('/editor', { state: { remixSource: item } });
    };

    return (
        <div className="min-h-screen bg-[#030712] text-white p-6 md:p-10 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                            <Sparkles className="text-yellow-400" size={32} />
                            Cộng Đồng Sáng Tạo
                        </h1>
                        <p className="text-slate-400">Khám phá và Remix những ý tưởng AI độc đáo nhất.</p>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm ý tưởng..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                            />
                        </div>
                        <button className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {tags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTag === tag
                                    ? 'bg-white text-black'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {showcases.filter(item => activeTag === 'All' || item.tag === activeTag).map((item) => (
                        <div key={item.id} className="group relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer">
                            <img src={item.img} alt={item.title} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" />

                            <div className="absolute inset-0 from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">

                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-300">
                                        {item.tool}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-1">{item.title}</h3>

                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <div className="p-1 bg-white/10 rounded-full"><User size={12} /></div>
                                        {item.author}
                                    </div>
                                    <div className="flex items-center gap-1 text-pink-400 text-sm font-bold">
                                        <Heart size={16} fill="currentColor" /> {item.likes}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleRemix(item)}
                                    className="mt-4 w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
                                >
                                    <Zap size={18} className="text-yellow-600 fill-current" /> Thử Ngay (Remix)
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Community;
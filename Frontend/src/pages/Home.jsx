import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Layers, PlayCircle, ShieldCheck } from 'lucide-react';

const Home = () => {
    const tinhNangNoiBat = [
        {
            tieuDe: "Xóa Phông Chuẩn",
            moTa: "Tách nền vật thể chính xác đến từng sợi tóc bằng AI Agent.",
            icon: <Layers className="text-pink-400" />,
            mauNen: "group-hover:bg-pink-500/10"
        },
        {
            tieuDe: "Nâng Cấp 4K",
            moTa: "Biến những bức ảnh mờ, cũ thành kiệt tác HD sắc nét.",
            icon: <Zap className="text-yellow-400" />,
            mauNen: "group-hover:bg-yellow-500/10"
        },
        {
            tieuDe: "Magic AI Edit",
            moTa: "Chỉnh sửa, thêm bớt vật thể chỉ bằng những câu lệnh tự nhiên.",
            icon: <Sparkles className="text-purple-400" />,
            mauNen: "group-hover:bg-purple-500/10"
        }
    ];

    return (
        <div className="h-full overflow-y-auto bg-gray-950 relative selection:bg-blue-500/30">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-blue-600/10 rounded-full blur-120 animate-pulse" />
                <div className="absolute top-[20%] right-[-10%] w-150 h-150 bg-purple-600/10 rounded-full blur-120 animate-pulse-slow" />
            </div>

            <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 relative z-10 pt-20">

                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black tracking-widest uppercase mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    DesPho AI v2.0 • Sẵn sàng bùng nổ
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                    Sáng Tạo Ảnh <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-500 drop-shadow-sm">
                        Đẳng Cấp AI
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-3xl mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    Giải pháp xử lý hình ảnh toàn diện cho Designer. Tích hợp hệ thống
                    <span className="text-blue-400"> Multi-Agent</span> thông minh giúp tối ưu hóa mọi pixel trong tích tắc.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <Link
                        to="/editor"
                        className="group relative px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3 shadow-2xl shadow-white/10"
                    >
                        Khám phá ngay <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <button className="px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-md">
                        <PlayCircle size={18} /> Xem Demo
                    </button>
                </div>

                <div className="mt-20 flex flex-col items-center gap-4 opacity-50 animate-in fade-in duration-1000 delay-500">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Được tin dùng bởi hơn 10,000+ Creators</span>
                    <div className="flex gap-8 grayscale brightness-200 scale-75 md:scale-90">
                        <ShieldCheck size={24} />
                        <Layers size={24} />
                        <Zap size={24} />
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tinhNangNoiBat.map((item, i) => (
                        <div
                            key={i}
                            className="p-10 rounded-[2.5rem] glass hover:bg-white/10 transition-all duration-500 group border border-white/5 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-20 bg-blue-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${item.mauNen}`}>
                                {item.icon}
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{item.tieuDe}</h3>
                            <p className="text-slate-400 leading-relaxed font-medium">{item.moTa}</p>

                            <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-500 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                Thử ngay <ArrowRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="py-10 text-center border-t border-white/5">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    © 2026 DesPho AI Studio • Built for the future of Design
                </p>
            </footer>
        </div>
    );
};

export default Home;
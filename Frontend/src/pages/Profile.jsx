import React, { useState, useEffect } from 'react';
import { Settings, Zap, Image as ImageIcon, HardDrive, Crown, Clock, MoreHorizontal, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import http from '../services/axios';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const duAnGanDay = [
        { id: 1, ten: "Chân dung nghệ thuật.png", thoiGian: "2 phút trước", dungLuong: "2.4 MB" },
        { id: 2, ten: "Poster quảng cáo.jpg", thoiGian: "1 giờ trước", dungLuong: "1.1 MB" },
        { id: 3, ten: "Ảnh phong cảnh AI.png", thoiGian: "1 ngày trước", dungLuong: "4.5 MB" },
    ];

    // Lấy thông tin user
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await http.get('/client/profile');
                if (response.data.status === 1) {
                    setUser(response.data.data);
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin:", error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    // Xử lý Đăng xuất
    const handleLogout = async () => {
        try {
            await http.post('/client/logout');
        } catch (error) {
            console.error(error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_info');
            navigate('/login');
        }
    };

    if (loading) return <div className="h-full flex items-center justify-center text-white">Đang tải hồ sơ...</div>;

    return (
        <div className="h-full overflow-y-auto bg-gray-950 p-6 md:p-10 text-white selection:bg-blue-500/30">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* ---  Hồ Sơ --- */}
                <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            <div className="relative group cursor-pointer">
                                <div className="w-28 h-28 rounded-full p-0.5 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500">
                                    <div className="w-full h-full rounded-full bg-gray-950 overflow-hidden flex items-center justify-center text-4xl font-bold">
                                        {/* Hiển thị Avatar hoặc Chữ cái đầu của tên */}
                                        {user?.full_name?.charAt(0) || 'U'}
                                    </div>
                                </div>
                                <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-gray-950" title="Trực tuyến"></div>
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold mb-1">{user?.full_name || 'Khách hàng'}</h1>
                                <p className="text-slate-400 mb-3 text-sm">{user?.email || 'Chưa có email'}</p>
                                <div className="flex gap-2 justify-center md:justify-start">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">Gói Miễn Phí</span>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20">Sáng Tạo</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95">
                                <Settings size={18} /> <span className="text-sm font-bold uppercase tracking-tight">Cài đặt</span>
                            </button>
                            <button onClick={handleLogout} className="relative z-50 flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/20 rounded-xl transition-all active:scale-95">
                                <LogOut size={18} /> <span className="text-sm font-bold uppercase tracking-tight">Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Chỉ Số Thống Kê --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Credits */}
                    <div className="glass p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Credit hiện có</p>
                                <h3 className="text-3xl font-bold mt-1">{user?.credits || 0}<span className="text-lg text-slate-600 font-normal"> / 100</span></h3>
                            </div>
                            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400">
                                <Zap size={24} />
                            </div>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-yellow-400 h-full rounded-full shadow-lg shadow-yellow-400/20" style={{ width: `${Math.min(user?.credits || 0, 100)}%` }}></div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-3 italic font-medium">Sử dụng cho các tác vụ AI</p>
                    </div>

                    {/* Ảnh đã tạo */}
                    <div className="glass p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Tổng sản phẩm</p>
                                <h3 className="text-3xl font-bold mt-1">1,204</h3>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                <ImageIcon size={24} />
                            </div>
                        </div>
                        <p className="text-xs text-green-400 font-bold flex items-center gap-1">
                            +124 <span className="text-slate-500 font-normal">so với tháng trước</span>
                        </p>
                    </div>

                    {/* Dung lượng */}
                    <div className="glass p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Lưu trữ Cloud</p>
                                <h3 className="text-3xl font-bold mt-1">45%</h3>
                            </div>
                            <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400">
                                <HardDrive size={24} />
                            </div>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-linear-to-r from-blue-500 to-pink-500 h-full rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-3 font-medium">2.4GB trên 5GB khả dụng</p>
                    </div>
                </div>

                {/* --- Hoạt động & Nâng cấp --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 glass rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                                <Clock size={18} className="text-blue-400" /> Dòng thời gian
                            </h3>
                            <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase">Tất cả</button>
                        </div>
                        <div className="p-2">
                            {duAnGanDay.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-500">
                                            {item.ten.split('.').pop().toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-200">{item.ten}</p>
                                            <p className="text-[10px] text-slate-500 font-medium">{item.thoiGian} • {item.dungLuong}</p>
                                        </div>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all shrink-0">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass rounded-2xl border border-white/5 p-8 bg-linear-to-b from-blue-900/10 to-transparent relative overflow-hidden flex flex-col justify-between shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-linear-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-orange-500/20">
                                <Crown className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 tracking-tight">Gói Hội Viên PRO</h3>
                            <p className="text-slate-400 text-xs leading-relaxed mb-8">
                                Trải nghiệm sức mạnh tối đa: Upscale 4K, xử lý hàng loạt và lưu trữ không giới hạn.
                            </p>
                        </div>

                        <button className="w-full py-4 bg-white text-black font-black text-[11px] uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 relative z-10">
                            Nâng cấp - $9 / Tháng
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
import React, { useState, useEffect } from 'react';
import { Monitor, Lock, Save, Download, User } from 'lucide-react';
import http from '../services/axios';

const Settings = () => {
    const [user, setUser] = useState({ full_name: '', phone_number: '', email: '' });
    const [passData, setPassData] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
    const [loading, setLoading] = useState(false);

    // Lấy thông tin user hiện tại khi load trang
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user_info'));
        if (userData) setUser(userData);
    }, []);

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const res = await http.post('/client/update-profile', user);
            if (res.data.status === 1) {
                localStorage.setItem('user_info', JSON.stringify(res.data.data));
                alert("Cập nhật thông tin thành công!");
            }
        } catch (error) {
            alert("Lỗi cập nhật profile");
        } finally { setLoading(false); }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const res = await http.post('/client/change-password', passData);
            if (res.data.status === 1) {
                alert("Đổi mật khẩu thành công!");
                setPassData({ current_password: '', new_password: '', new_password_confirmation: '' });
            }
        } catch (error) {
            alert(error.response?.data?.message || "Lỗi đổi mật khẩu");
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-gray-950 p-6 md:p-10 text-white">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold tracking-tight">Cài Đặt Tài Khoản</h1>

                {/* Thông tin cá nhân */}
                <section className="glass p-6 rounded-2xl border border-white/5 shadow-2xl space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-blue-400">
                        <User size={18} /> Thông tin cá nhân
                    </h2>
                    <div className="grid gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Họ và tên</label>
                            <input 
                                type="text" className="w-full bg-gray-950 border border-white/5 rounded-xl px-4 py-2.5 mt-1"
                                value={user.full_name} onChange={(e) => setUser({...user, full_name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Số điện thoại</label>
                            <input 
                                type="text" className="w-full bg-gray-950 border border-white/5 rounded-xl px-4 py-2.5 mt-1"
                                value={user.phone_number || ''} onChange={(e) => setUser({...user, phone_number: e.target.value})}
                            />
                        </div>
                    </div>
                </section>

                {/* Bảo mật */}
                <section className="glass p-6 rounded-2xl border border-white/5 shadow-2xl">
                    <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-purple-400">
                        <Lock size={18} /> Đổi mật khẩu
                    </h2>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <input 
                            type="password" placeholder="Mật khẩu hiện tại" required
                            className="w-full bg-gray-950 border border-white/5 rounded-xl px-4 py-2.5"
                            value={passData.current_password} onChange={(e) => setPassData({...passData, current_password: e.target.value})}
                        />
                        <input 
                            type="password" placeholder="Mật khẩu mới" required
                            className="w-full bg-gray-950 border border-white/5 rounded-xl px-4 py-2.5"
                            value={passData.new_password} onChange={(e) => setPassData({...passData, new_password: e.target.value})}
                        />
                        <input 
                            type="password" placeholder="Xác nhận mật khẩu mới" required
                            className="w-full bg-gray-950 border border-white/5 rounded-xl px-4 py-2.5"
                            value={passData.new_password_confirmation} onChange={(e) => setPassData({...passData, new_password_confirmation: e.target.value})}
                        />
                        <button type="submit" className="w-full bg-purple-600 py-3 rounded-xl text-xs font-bold uppercase hover:bg-purple-700 transition-all">
                            Xác nhận thay đổi mật khẩu
                        </button>
                    </form>
                </section>

                <div className="flex justify-end pt-6 border-t border-white/10">
                    <button 
                        onClick={handleUpdateProfile} disabled={loading}
                        className="bg-white text-black px-10 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                        <Save size={16} /> {loading ? 'Đang lưu...' : 'Lưu Tất Cả Thay Đổi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
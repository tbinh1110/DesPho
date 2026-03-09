import React, { useState } from 'react'; 
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Wand2, UserCircle, Settings, LogOut, ChevronRight, Users, Loader2 } from 'lucide-react'; // Thêm Loader2
import { toast } from 'react-toastify';
import http from '../services/axios';
import CommandPalette from '../components/shared/CommandPalette';

const DashboardLayout = () => {
    const navigate = useNavigate();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true); 

        try {
            const res = await http.post('/logout');

            if (res.data.status === 1) {
                toast.success(res.data.message || 'Đã đăng xuất thành công');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API logout:', error);
            toast.error('Có lỗi xảy ra, nhưng phiên làm việc vẫn sẽ được xóa');
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_info');

            setTimeout(() => {
                setIsLoggingOut(false);
                navigate('/login'); 
            }, 600);
        }
    };

    const navItems = [
        { path: '/', label: 'Tổng Quan', icon: <LayoutGrid size={18} /> },
        { path: '/editor', label: 'Studio AI', icon: <Wand2 size={18} /> },
        { path: '/community', label: 'Cộng Đồng', icon: <Users size={18} /> },
        { path: '/profile', label: 'Tài Khoản', icon: <UserCircle size={18} /> },
        { path: '/settings', label: 'Cài Đặt', icon: <Settings size={18} /> },
    ];

    return (
        <div className="flex h-screen w-full bg-[#030712] relative overflow-hidden font-sans text-slate-300">
            <CommandPalette />
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            <aside className="w-20 lg:w-72 h-full flex flex-col glass border-r-0 z-50 transition-all duration-300">
                <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/5">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                        <Wand2 className="text-white" size={24} />
                    </div>
                    <span className="hidden lg:block ml-4 text-xl font-bold tracking-tight text-white">
                        DesPho<span className="text-blue-400">.ai</span>
                    </span>
                </div>

                <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                    <p className="hidden lg:block text-xs font-semibold text-slate-500 uppercase tracking-widest px-4 mb-4">Danh Mục</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden ${isActive
                                    ? 'bg-blue-600/10 text-white shadow-[0_0_20px_rgba(37,99,235,0.15)]'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />}
                                    <span className={`transition-transform duration-300 ${isActive ? 'scale-110 text-blue-400' : ''}`}>
                                        {item.icon}
                                    </span>
                                    <span className="hidden lg:block font-medium">{item.label}</span>
                                    {isActive && <ChevronRight size={16} className="hidden lg:block ml-auto text-blue-500 opacity-50" />}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all justify-center lg:justify-start
                            ${isLoggingOut
                                ? 'opacity-50 cursor-not-allowed bg-red-500/5 text-red-400'
                                : 'text-slate-400 hover:text-red-400 hover:bg-red-500/10 active:scale-95'
                            }`}
                    >
                        {isLoggingOut ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <LogOut size={20} />
                        )}
                        <span className="hidden lg:block font-medium">
                            {isLoggingOut ? 'Đang xử lý...' : 'Đăng Xuất'}
                        </span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 relative z-10 overflow-hidden flex flex-col">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
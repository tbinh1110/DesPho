import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User as UserIcon } from 'lucide-react';
import http from '../services/axios'; 

const Signup = () => {
    const navigate = useNavigate();
    
    // State lưu dữ liệu form
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        // Kiểm tra mật khẩu khớp nhau
        if (formData.password !== formData.password_confirmation) {
            setErrorMsg('Mật khẩu nhập lại không khớp!');
            setLoading(false);
            return;
        }

        try {
            const response = await http.post('/auth/register', formData);
            if (response.data.status === 1) {
                // Đăng ký thành công, lưu token và chuyển về trang chủ (hoặc login)
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('user_info', JSON.stringify(response.data.data));
                navigate('/');
            } else {
                setErrorMsg(response.data.message || 'Đăng ký thất bại!');
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            // Bắt lỗi validation từ Laravel
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                const firstError = Object.values(errors)[0][0];
                setErrorMsg(firstError);
            } else {
                setErrorMsg('Lỗi kết nối đến máy chủ.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] bg-indigo-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] bg-pink-600/20 rounded-full blur-[120px]" />

            <div className="relative z-10 w-full max-w-md p-6">
                <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                            <UserPlus className="text-pink-500" /> Đăng Ký
                        </h1>
                        <p className="text-slate-400 text-sm">Tạo tài khoản DesPho AI Studio</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-4 p-3 text-sm text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="relative flex items-center">
                            <UserIcon className="absolute w-5 h-5 text-gray-400 left-3" />
                            <input
                                type="text" name="full_name" required
                                value={formData.full_name} onChange={handleChange}
                                placeholder="Họ và tên"
                                className="w-full py-3 pl-10 pr-4 text-white bg-white/5 border border-white/10 rounded-xl outline-none focus:border-pink-500 transition-colors"
                            />
                        </div>

                        <div className="relative flex items-center">
                            <Mail className="absolute w-5 h-5 text-gray-400 left-3" />
                            <input
                                type="email" name="email" required
                                value={formData.email} onChange={handleChange}
                                placeholder="Email"
                                className="w-full py-3 pl-10 pr-4 text-white bg-white/5 border border-white/10 rounded-xl outline-none focus:border-pink-500 transition-colors"
                            />
                        </div>

                        <div className="relative flex items-center">
                            <Lock className="absolute w-5 h-5 text-gray-400 left-3" />
                            <input
                                type="password" name="password" required minLength="6"
                                value={formData.password} onChange={handleChange}
                                placeholder="Mật khẩu"
                                className="w-full py-3 pl-10 pr-4 text-white bg-white/5 border border-white/10 rounded-xl outline-none focus:border-pink-500 transition-colors"
                            />
                        </div>

                        <div className="relative flex items-center">
                            <Lock className="absolute w-5 h-5 text-gray-400 left-3" />
                            <input
                                type="password" name="password_confirmation" required minLength="6"
                                value={formData.password_confirmation} onChange={handleChange}
                                placeholder="Nhập lại mật khẩu"
                                className="w-full py-3 pl-10 pr-4 text-white bg-white/5 border border-white/10 rounded-xl outline-none focus:border-pink-500 transition-colors"
                            />
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full py-3 mt-4 text-white bg-linear-to-r from-pink-600 to-purple-600 rounded-xl hover:scale-[1.02] transition-transform font-bold flex items-center justify-center gap-2"
                        >
                            {loading ? 'Đang xử lý...' : 'Tạo Tài Khoản'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        Đã có tài khoản? <Link to="/login" className="text-pink-400 hover:text-pink-300 font-bold ml-1">Đăng nhập</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, ArrowLeft } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify';
import { auth } from "../services/firebase";
import http from '../services/axios';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isOtpMode, setIsOtpMode] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [confirmResult, setConfirmResult] = useState(null);

    const [formData, setFormData] = useState({ login_id: '', password: '' });
    const [phoneData, setPhoneData] = useState({ number: '', otp: '' });
    const handleInput = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const saveAuth = (res) => {

        localStorage.setItem('auth_token', res.token);

        localStorage.setItem(
            'user_info',
            JSON.stringify(res.data)
        );

    };

    useEffect(() => {

        const container = document.getElementById("recaptcha-container");

        if (container && !window.recaptchaVerifier) {

            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "invisible",
                    callback: () => { }
                }
            );

            window.recaptchaVerifier.render();
        }

        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        };

    }, []);


    // 1. Đăng nhập truyền thống
    const dangNhapChinh = async (e) => {
        e.preventDefault();
        if (!captchaToken) return toast.warning('Vui lòng xác thực reCAPTCHA!');
        setLoading(true);
        try {
            await http.get('/sanctum/csrf-cookie', { baseURL: '' });
            const res = await http.post('/auth/login', formData);
            if (res.data.status === 1) {
                saveAuth(res.data);
                toast.success('Chào mừng bạn quay trở lại!');
                navigate('/');
            } else toast.error(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi đăng nhập');
        } finally { setLoading(false); }
    };

    // 2. Đăng nhập Google
    const dangNhapGoogle = useGoogleLogin({
        onSuccess: async (tokenRes) => {
            setLoading(true);
            try {
                const res = await http.post('/auth/google', { token: tokenRes.access_token });
                if (res.data.status === 1) {
                    saveAuth(res.data);
                    toast.success('Đăng nhập Google thành công!');
                    navigate('/');
                }
            } catch (err) { toast.error('Lỗi xác thực Google'); }
            finally { setLoading(false); }
        }
    });
    const recaptchaVerifierRef = useRef(null);
    const guiMaOtp = async () => {
        if (!phoneData.number) return toast.info('Vui lòng nhập số điện thoại');

        try {
            if (recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current.clear();
                recaptchaVerifierRef.current = null;
            }

            const container = document.getElementById('recaptcha-container');
            if (container) {
                container.innerHTML = '<div id="recaptcha-widget"></div>';
            }

            recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-widget', {
                'size': 'invisible',
                'callback': (response) => { console.log("reCAPTCHA solved"); }
            });

            const phoneFormat = phoneData.number.startsWith('+') ? phoneData.number : `+84${phoneData.number.replace(/^0/, '')}`;
            const confirmation = await signInWithPhoneNumber(auth, phoneFormat, recaptchaVerifierRef.current);

            setConfirmResult(confirmation);
            setIsOtpMode(true);
            toast.success("Mã OTP đã được gửi!");
        } catch (error) {
            console.error("Firebase Error:", error);
            toast.error("Lỗi xác thực reCAPTCHA. Hãy thử lại.");
            if (recaptchaVerifierRef.current) recaptchaVerifierRef.current.clear();
        }
    };


    const xacNhanOtp = async () => {

        if (!phoneData.otp || phoneData.otp.length !== 6) {
            return toast.warning('Vui lòng nhập đủ 6 số OTP');
        }

        if (!confirmResult) {
            toast.error("Phiên OTP đã hết hạn, vui lòng gửi lại");
            return;
        }

        setLoading(true);

        try {

            const userCredential = await confirmResult.confirm(phoneData.otp);

            const firebaseToken = await userCredential.user.getIdToken();

            const res = await http.post('/auth/verify-otp-firebase', {
                token: firebaseToken
            });

            if (res.data.status === 1) {

                saveAuth(res.data);

                toast.success("Đăng nhập thành công!");

                navigate('/');
            }

        } catch (err) {

            console.error("OTP ERROR:", err);

            toast.error("Mã OTP không đúng hoặc đã hết hạn!");

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="relative flex items-center justify-center w-full min-h-screen bg-gray-950 overflow-hidden font-sans">
            <div id="recaptcha-container"></div>

            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div style={{
                    position: 'absolute', top: '-10%', right: '-10%',
                    width: '600px', height: '600px',
                    backgroundColor: '#2563eb', borderRadius: '9999px', filter: 'blur(150px)'
                }} />
                <div style={{
                    position: 'absolute', bottom: '-10%', left: '-10%',
                    width: '600px', height: '600px',
                    backgroundColor: '#9333ea', borderRadius: '9999px', filter: 'blur(150px)'
                }} />
            </div>

            <div className="relative z-10 w-full max-w-md p-6">
                <div className="p-8 border border-white/10 rounded-[2.5rem] bg-gray-900/50 backdrop-blur-3xl shadow-2xl overflow-hidden">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">
                            {isOtpMode ? 'Xác thực OTP' : 'DesPho AI'}
                        </h1>
                        <p className="text-slate-400 text-sm">Hệ thống xử lý ảnh thông minh</p>
                    </div>

                    {!isOtpMode ? (
                        <form onSubmit={dangNhapChinh} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input name="login_id" type="text" placeholder="Email / Số điện thoại" required onChange={handleInput}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-all" />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input name="password" type="password" placeholder="Mật khẩu" required onChange={handleInput}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-all" />
                            </div>

                            <div className="flex justify-center py-2">
                                <ReCAPTCHA sitekey="6LftYYMsAAAAAOJBfa6lQ6w4Pn5w24o2LbTa5g0v" theme="dark" onChange={setCaptchaToken} />
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/30">
                                {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
                            </button>

                            <div className="relative py-4 flex items-center">
                                <div className="flex-grow border-t border-white/5"></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3">Hoặc</span>
                                <div className="flex-grow border-t border-white/5"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" onClick={() => dangNhapGoogle()} className="flex items-center justify-center gap-2 bg-white text-black font-bold py-3.5 rounded-2xl hover:bg-slate-200 transition-all active:scale-95">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" /> Google
                                </button>
                                <button type="button" onClick={() => setIsOtpMode(true)} className="flex items-center justify-center gap-2 bg-slate-800 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-700 transition-all active:scale-95">
                                    <Phone size={18} className="text-green-400" /> OTP
                                </button>
                            </div>
                            <div className="text-center pt-4">
                                <p className="text-sm text-slate-400">
                                    Chưa có tài khoản?{" "}
                                    <Link
                                        to="/signup"
                                        className="text-blue-400 hover:text-blue-300 font-semibold"
                                    >
                                        Đăng ký ngay
                                    </Link>
                                </p>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <input type="text" placeholder="Số điện thoại của bạn"
                                onChange={(e) => setPhoneData({ ...phoneData, number: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-blue-500" />

                            <div className="grid grid-cols-3 gap-2">
                                <input type="text" placeholder="Mã OTP" maxLength="6"
                                    onChange={(e) => setPhoneData({ ...phoneData, otp: e.target.value })}
                                    className="col-span-2 bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-center font-bold tracking-[0.5em]" />
                                <button onClick={guiMaOtp} className="bg-blue-600 text-[10px] font-black rounded-2xl hover:bg-blue-700 transition-all">GỬI MÃ</button>
                            </div>

                            <button onClick={xacNhanOtp} disabled={loading} className="w-full bg-green-600 py-4 rounded-2xl font-bold text-white hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-600/30">
                                {loading ? 'ĐANG XÁC THỰC...' : 'XÁC NHẬN ĐĂNG NHẬP'}
                            </button>

                            <button onClick={() => setIsOtpMode(false)} className="w-full flex items-center justify-center gap-2 text-slate-500 text-xs font-bold py-2 hover:text-white transition-colors">
                                <ArrowLeft size={14} /> QUAY LẠI
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
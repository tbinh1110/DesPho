import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wand2, ArrowRight, Github, Mail } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/editor');
    };

    return (
        <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] bg-blue-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] bg-purple-600/20 rounded-full blur-[120px]" />

            <div className="relative z-10 w-full max-w-md p-8">
                <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                            <Wand2 className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-400 text-sm">Sign in to continue to DesPho AI</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                            <input
                                type="email"
                                placeholder="hello@example.com"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <button type="submit" className="w-full from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                            Sign In <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-center text-xs text-slate-500 mb-4">Or continue with</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-300 transition-colors">
                                <Github size={16} /> Github
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-300 transition-colors">
                                <Mail size={16} /> Google
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-slate-500 text-sm mt-6">
                    Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-bold">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
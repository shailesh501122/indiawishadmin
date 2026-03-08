import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setAdminCredentials } from '../store/authSlice';
import { useAdminLoginMutation } from '../store/authApiSlice';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading, error }] = useAdminLoginMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login({ email, password }).unwrap();
            dispatch(setAdminCredentials({
                user: result.user,
                token: result.accessToken
            }));
            navigate('/');
        } catch (err: any) {
            console.error('Failed to log in:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] bg-violet-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 shadow-2xl shadow-indigo-500/20 mb-6 rotate-3">
                        <ShieldCheck size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight font-outfit mb-2">
                        Admin <span className="text-indigo-400">Portal</span>
                    </h1>
                    <p className="text-gray-400 font-medium">Access the core systems of IndiaWish</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-4">
                                <p className="text-sm text-red-400 font-bold text-center">
                                    {(error as any)?.data?.detail || 'Invalid administrator credentials'}
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 ml-1 uppercase tracking-widest">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-white font-medium transition-all outline-none"
                                    placeholder="admin@indiawish.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 ml-1 uppercase tracking-widest">Secret Key</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full pl-14 pr-12 py-4 bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-white font-medium transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative group overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            <span className="flex items-center justify-center">
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    "Initialize Session"
                                )}
                            </span>
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-gray-500 text-sm font-medium">
                    Restricted area. Unauthorized access is monitored and logged.
                </p>
            </div>
        </div>
    );
};

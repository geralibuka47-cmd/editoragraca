import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { login, loginWithGoogle, sendPhoneOTP, confirmPhoneOTP } from '../services/authService';
import type { ConfirmationResult } from 'firebase/auth';
import {
    Mail, Lock, ArrowRight, BookOpen, Info,
    Phone, MessageSquare, ChevronLeft, Check, User
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';

// ── Schemas ────────────────────────────────────────────────────────────────
const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});
type LoginFormData = z.infer<typeof loginSchema>;

const phoneSchema = z.object({
    phone: z.string().min(9, 'Número inválido'),
});
type PhoneFormData = z.infer<typeof phoneSchema>;

// ── Component ──────────────────────────────────────────────────────────────
const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Method: email or phone
    const [method, setMethod] = useState<'email' | 'phone'>('email');

    // Email state
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');

    // Phone state
    const [phoneStep, setPhoneStep] = useState<1 | 2>(1);
    const [phoneLoading, setPhoneLoading] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [pendingPhone, setPendingPhone] = useState('');

    // ── Email form ──────────────────────────────────────────────────────────
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const checkConnection = async () => {
        setConnectionStatus('checking');
        setAuthError('A testar conectividade...');
        try {
            const start = Date.now();
            await fetch('/favicon.ico', { cache: 'no-store' });
            const internetTime = Date.now() - start;
            setConnectionStatus('ok');
            setAuthError(`Conexão OK (${internetTime}ms). O sistema está pronto.`);
        } catch {
            setConnectionStatus('error');
            setAuthError('Sem acesso à internet. Verifique sua conexão.');
        } finally {
            setTimeout(() => setConnectionStatus('idle'), 5000);
        }
    };

    const onEmailSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setAuthError('');
        try {
            const user = await login(data.email, data.password);
            if (user) navigate('/');
        } catch (err: any) {
            const msg = err.message || '';
            if (msg.includes('Invalid login credentials') || msg.includes('invalid-credential')) {
                setAuthError('Acesso recusado. Verifique as suas credenciais.');
            } else {
                setAuthError(msg || 'Ocorreu um erro ao entrar na plataforma.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setAuthError('');
        try {
            const user = await loginWithGoogle();
            if (user) navigate('/');
        } catch (err: any) {
            setAuthError(err.message || 'Erro ao entrar com Google');
        } finally {
            setLoading(false);
        }
    };

    // ── Phone form ──────────────────────────────────────────────────────────
    const { register: regPhone, handleSubmit: handlePhoneForm, formState: { errors: phoneErrors } } = useForm<PhoneFormData>({
        resolver: zodResolver(phoneSchema),
    });

    const onPhoneSend = async (data: PhoneFormData) => {
        setPhoneLoading(true);
        setPhoneError('');
        try {
            const fullNumber = '+244' + data.phone.replace(/\D/g, '');
            const result = await sendPhoneOTP(fullNumber, 'recaptcha-container-login');
            setConfirmationResult(result);
            setPendingPhone(data.phone);
            setPhoneStep(2);
        } catch (err: any) {
            setPhoneError(err.message || 'Erro ao enviar SMS. Verifique o número.');
        } finally {
            setPhoneLoading(false);
        }
    };

    const onOTPConfirm = async () => {
        if (!confirmationResult) return;
        setPhoneLoading(true);
        setPhoneError('');
        try {
            await confirmPhoneOTP(confirmationResult, otp, 'Utilizador', 'leitor');
            navigate('/');
        } catch (err: any) {
            setPhoneError(err.message || 'Código inválido. Tente novamente.');
        } finally {
            setPhoneLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0fb48b] flex items-center justify-center p-6 selection:bg-[#0fb48b] selection:text-white font-sans">
            <SEO title="Entrar" description="Aceda à sua conta na Editora Graça." />

            <div id="recaptcha-container-login" />

            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[450px] bg-[#2d333b] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-10 relative overflow-visible"
            >
                {/* ── Avatar Circle ────────────────────────────────────── */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#3e444d] rounded-full flex items-center justify-center shadow-lg border-4 border-[#2d333b]">
                    <div className="relative">
                        <User className="w-12 h-12 text-gray-400" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#0fb48b] rounded-full border-2 border-[#2d333b] flex items-center justify-center">
                            <span className="text-[10px] text-white font-bold">+</span>
                        </div>
                    </div>
                </div>

                {/* ── Tabs ─────────────────────────────────────────────── */}
                <div className="flex gap-12 justify-center mb-12 mt-8">
                    <button
                        onClick={() => { setMethod('email'); }}
                        className={`relative pb-2 font-black text-lg uppercase tracking-widest transition-all ${method === 'email' ? 'text-white' : 'text-gray-500 hover:text-gray-400'}`}
                    >
                        Login
                        {method === 'email' && <m.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-full" />}
                    </button>
                    <Link
                        to="/registo"
                        className="relative pb-2 font-black text-lg uppercase tracking-widest text-gray-500 hover:text-gray-400 transition-all font-sans"
                    >
                        Sign Up
                    </Link>
                </div>

                <AnimatePresence mode="wait">
                    {method === 'email' && (
                        <m.div key="email" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            {authError && (
                                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
                                    {authError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            {...register('email')}
                                            type="email"
                                            placeholder="seu@email.com"
                                            className="w-full bg-[#3e444d] border-none rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#0fb48b] transition-all outline-none"
                                        />
                                    </div>
                                    {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            {...register('password')}
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full bg-[#3e444d] border-none rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#0fb48b] transition-all outline-none"
                                        />
                                    </div>
                                    {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password.message}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    isLoading={loading}
                                    className="w-full py-5 rounded-2xl bg-[#0fb48b] hover:bg-[#0da07a] text-white text-sm font-black uppercase tracking-[0.3em] shadow-lg shadow-[#0fb48b]/20 transition-all active:scale-[0.98]"
                                >
                                    Submit
                                </Button>

                                <div className="text-center pt-4">
                                    <Link to="/recuperar-senha" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors border-b border-gray-500/30 pb-1">
                                        Forget Your Password?
                                    </Link>
                                </div>
                            </form>
                        </m.div>
                    )}

                    {method === 'phone' && (
                        <m.div key="phone" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                            <AnimatePresence mode="wait">
                                {phoneStep === 1 && (
                                    <m.form key="p1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handlePhoneForm(onPhoneSend)} className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Número de Telemóvel</label>
                                            <div className="flex gap-3">
                                                <div className="flex items-center gap-2 px-4 py-4 bg-[#3e444d] rounded-2xl text-xs font-black text-white shrink-0">
                                                    🇦🇴 +244
                                                </div>
                                                <input {...regPhone('phone')} type="tel" placeholder="912 345 678" className="flex-1 px-5 py-4 bg-[#3e444d] border-none rounded-2xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-[#0fb48b] transition-all" />
                                            </div>
                                            {phoneErrors.phone && <p className="text-[10px] text-red-500 font-bold ml-1">{phoneErrors.phone.message}</p>}
                                        </div>
                                        {phoneError && <p className="text-[10px] font-bold text-red-500 text-center">⚠️ {phoneError}</p>}
                                        <Button type="submit" isLoading={phoneLoading} className="w-full py-5 rounded-2xl bg-[#0fb48b] hover:bg-[#0da07a] text-white text-sm font-black uppercase tracking-[0.3em] shadow-lg shadow-[#0fb48b]/20">
                                            Enviar SMS
                                        </Button>
                                    </m.form>
                                )}

                                {phoneStep === 2 && (
                                    <m.div key="p2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 text-center">
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Código Enviado!</p>
                                            <p className="text-[10px] text-gray-500 font-medium">+244 {pendingPhone}</p>
                                        </div>
                                        <input type="number" value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" className="w-full bg-[#3e444d] border-none rounded-2xl py-6 text-3xl font-black text-white text-center tracking-[0.5em] outline-none focus:ring-2 focus:ring-[#0fb48b]" />
                                        <Button type="button" onClick={onOTPConfirm} isLoading={phoneLoading} disabled={otp.length < 6} className="w-full py-5 rounded-2xl bg-[#0fb48b] hover:bg-[#0da07a] text-white text-sm font-black uppercase tracking-[0.3em]">
                                            Entrar
                                        </Button>
                                        <button onClick={() => setPhoneStep(1)} className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white">Alterar Número</button>
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </m.div>
                    )}
                </AnimatePresence>

                {/* Google Login Option */}
                <div className="mt-8 pt-8 border-t border-white/5">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.896 4.14-1.236 1.236-3.156 2.508-6.192 2.508-4.8 0-8.52-3.888-8.52-8.688S7.44 3.48 12.24 3.48c2.604 0 4.512 1.02 5.904 2.34l2.304-2.304C18.18 1.488 15.528 0 12.24 0 5.484 0 0 5.484 0 12.24s5.484 12.24 12.24 12.24c3.636 0 6.384-1.2 8.64-3.564 2.256-2.256 2.964-5.412 2.964-7.848 0-.768-.06-1.5-.18-2.16h-11.412z" />
                        </svg>
                        Google Authorization
                    </button>

                    {/* Phone Login Toggle */}
                    <button
                        type="button"
                        onClick={() => setMethod(method === 'email' ? 'phone' : 'email')}
                        className="w-full mt-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#0fb48b] hover:text-white transition-colors"
                    >
                        {method === 'email' ? 'Aceder via Telemóvel' : 'Aceder via Email'}
                    </button>
                </div>
            </m.div>

            {/* Float Back Link */}
            <Link to="/" className="fixed bottom-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-black text-[10px] uppercase tracking-widest backdrop-blur-md transition-all">
                Retornar à Loja
            </Link>
        </div>
    );
};

export default LoginPage;

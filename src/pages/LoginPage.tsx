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
    Phone, MessageSquare, ChevronLeft, Check
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
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 md:p-12 relative overflow-hidden selection:bg-brand-primary selection:text-white">
            <SEO title="Entrar" description="Aceda à sua conta na Editora Graça." />

            {/* reCAPTCHA invisible container */}
            <div id="recaptcha-container-login" />

            {/* Background Aesthetics */}
            <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-brand-primary/5 to-transparent pointer-events-none" />
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-brand-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-brand-dark/5 blur-[120px] rounded-full" />

            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-white relative z-10"
            >
                {/* ── Visual Side ─────────────────────────────────────────── */}
                <div className="hidden lg:flex bg-brand-dark p-24 flex-col justify-between relative overflow-hidden text-white">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand-primary/20" />
                    <div className="relative z-10 space-y-12">
                        <Link to="/" className="inline-flex items-center gap-4 group">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-brand-primary/20 transition-all">
                                <BookOpen className="w-8 h-8 text-brand-primary" />
                            </div>
                            <span className="font-black text-xl uppercase tracking-tighter">Graça</span>
                        </Link>
                        <div className="space-y-8">
                            <h1 className="text-6xl font-black tracking-tighter leading-[0.9] uppercase">
                                Retorne ao <br />
                                <span className="text-brand-primary italic font-serif font-normal lowercase text-5xl">Cânone Literário</span>
                            </h1>
                            <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-sm">
                                A sua biblioteca pessoal, manuscritos e encomendas esperam por si no coração da Editora Graça.
                            </p>
                        </div>
                    </div>
                    <div className="relative z-10 pt-12 border-t border-white/10">
                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-4">
                                {[1, 2, 3].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-brand-dark bg-gray-600" />)}
                            </div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">+2k Membros Autores</p>
                        </div>
                    </div>
                </div>

                {/* ── Form Side ───────────────────────────────────────────── */}
                <div className="p-10 md:p-24 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full space-y-10">
                        <div className="space-y-4">
                            <span className="px-5 py-2 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-full">
                                Autenticação de Elite
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter uppercase">
                                Bem-vindo de Volta
                            </h2>
                        </div>

                        {/* ── Method Tabs ──────────────────────────────────── */}
                        <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                            {[
                                { id: 'email' as const, icon: Mail, label: 'Email' },
                                { id: 'phone' as const, icon: Phone, label: 'Telemóvel' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => { setMethod(tab.id); setPhoneStep(1); setPhoneError(''); setAuthError(''); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${method === tab.id
                                        ? 'bg-white text-brand-dark shadow-md border border-gray-100'
                                        : 'text-gray-400 hover:text-brand-dark'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {/* ── EMAIL ────────────────────────────────────── */}
                            {method === 'email' && (
                                <m.div key="email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                    {authError && (
                                        <m.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`mb-6 p-6 rounded-3xl border text-sm font-bold flex items-center gap-4 shadow-xl ${connectionStatus === 'ok' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}
                                        >
                                            <Info className="w-5 h-5 shrink-0" />
                                            <div className="flex-grow">
                                                <p>{authError}</p>
                                                {connectionStatus === 'idle' && (
                                                    <button onClick={checkConnection} className="mt-2 text-[10px] uppercase underline block">Testar Conexão</button>
                                                )}
                                            </div>
                                        </m.div>
                                    )}

                                    <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-8">
                                        <Input id="email" type="email" label="Identidade Digital (E-mail)" placeholder="seu@email.com" variant="light" icon={<Mail className="w-5 h-5" />} {...register('email')} error={errors.email?.message} />
                                        <div className="space-y-4">
                                            <Input id="password" type="password" label="Chave de Acesso" placeholder="••••••••" variant="light" icon={<Lock className="w-5 h-5" />} {...register('password')} error={errors.password?.message} />
                                            <div className="flex justify-end">
                                                <Link to="/recuperar-senha" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-primary transition-colors">Esqueceu a senha?</Link>
                                            </div>
                                        </div>
                                        <Button type="submit" isLoading={loading} className="w-full py-8 rounded-[2rem] text-[11px] tracking-[0.5em] shadow-xl shadow-brand-dark/10" rightIcon={!loading && <ArrowRight className="w-5 h-5" />}>
                                            Aceder ao Dashboard
                                        </Button>

                                        <div className="relative py-4">
                                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                                            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-white px-6 text-gray-300">Acesso Rápido</span></div>
                                        </div>

                                        <button type="button" onClick={handleGoogleLogin} className="w-full py-5 rounded-[2rem] border-2 border-gray-100 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-gray-50 transition-all active:scale-95">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            Google Auth
                                        </button>
                                    </form>
                                </m.div>
                            )}

                            {/* ── PHONE ────────────────────────────────────── */}
                            {method === 'phone' && (
                                <m.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <AnimatePresence mode="wait">
                                        {/* Step 1 */}
                                        {phoneStep === 1 && (
                                            <m.form key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handlePhoneForm(onPhoneSend)} className="space-y-8">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Número de Telemóvel</label>
                                                    <div className="flex gap-3">
                                                        <div className="flex items-center gap-2 px-4 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-black text-brand-dark shrink-0">
                                                            🇦🇴 +244
                                                        </div>
                                                        <input {...regPhone('phone')} type="tel" placeholder="912 345 678" className="flex-1 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" />
                                                    </div>
                                                    {phoneErrors.phone && <p className="text-xs text-red-500 font-bold ml-1">{phoneErrors.phone.message}</p>}
                                                </div>
                                                {phoneError && <p className="text-xs font-bold text-red-500 ml-4">⚠️ {phoneError}</p>}
                                                <Button type="submit" isLoading={phoneLoading} className="w-full py-8 rounded-[2rem] text-[11px] tracking-[0.5em] shadow-xl shadow-brand-dark/10" rightIcon={!phoneLoading && <MessageSquare className="w-5 h-5" />}>
                                                    Enviar Código SMS
                                                </Button>
                                            </m.form>
                                        )}

                                        {/* Step 2 */}
                                        {phoneStep === 2 && (
                                            <m.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                                                <div className="p-8 bg-brand-primary/5 rounded-3xl border border-brand-primary/10 text-center space-y-3">
                                                    <MessageSquare className="w-10 h-10 text-brand-primary mx-auto" />
                                                    <p className="text-sm font-black text-brand-dark uppercase tracking-widest">SMS Enviado!</p>
                                                    <p className="text-xs text-gray-500 font-medium">Código enviado para +244 {pendingPhone}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Código de Verificação</label>
                                                    <input type="number" value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" maxLength={6} className="w-full px-6 py-6 bg-gray-50 border border-gray-100 rounded-2xl text-3xl font-black text-center tracking-[1em] outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" />
                                                </div>
                                                {phoneError && <p className="text-xs font-bold text-red-500 ml-4">⚠️ {phoneError}</p>}
                                                <div className="flex flex-col gap-4">
                                                    <Button type="button" onClick={onOTPConfirm} isLoading={phoneLoading} disabled={otp.length < 6} className="w-full py-8 rounded-[2rem] text-[11px] tracking-[0.5em] shadow-xl shadow-brand-dark/10" rightIcon={!phoneLoading && <Check className="w-5 h-5" />}>
                                                        Entrar
                                                    </Button>
                                                    <button type="button" onClick={() => { setPhoneStep(1); setOtp(''); setPhoneError(''); }} className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-dark transition-colors">
                                                        <ChevronLeft className="w-3 h-3" /> Alterar número
                                                    </button>
                                                </div>
                                            </m.div>
                                        )}
                                    </AnimatePresence>
                                </m.div>
                            )}
                        </AnimatePresence>

                        <div className="pt-6 border-t border-gray-50 text-center">
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em]">
                                Novo na Editora Graça? <br />
                                <Link to="/registo" className="text-brand-primary inline-block mt-2 hover:scale-110 transition-transform">Manifestar Interesse</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </m.div>

            {/* Float Back Link for Mobile */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 lg:hidden z-50">
                <Link to="/" className="px-8 py-4 bg-brand-dark text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3">
                    <ArrowRight className="w-4 h-4 rotate-180" /> Retornar
                </Link>
            </div>
        </div>
    );
};

export default LoginPage;

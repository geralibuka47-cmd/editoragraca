import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signUp, sendPhoneOTP, confirmPhoneOTP } from '../services/authService';
import type { ConfirmationResult } from 'firebase/auth';
import {
    User, Mail, Lock, ArrowRight, BookOpen, Check,
    ShieldCheck, Sparkles, Phone, MessageSquare, ChevronLeft
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import SEO from '../components/SEO';

// ─── Schema for email registration ─────────────────────────────────────────
const emailSchema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    role: z.enum(['leitor', 'autor']),
});
type EmailFormData = z.infer<typeof emailSchema>;

// ─── Schema for phone step 1 ────────────────────────────────────────────────
const phoneStep1Schema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    phone: z.string().min(9, 'Número inválido'),
    role: z.enum(['leitor', 'autor']),
});
type PhoneStep1Data = z.infer<typeof phoneStep1Schema>;

// ─── Component ──────────────────────────────────────────────────────────────
const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    // Method: 'email' | 'phone'
    const [method, setMethod] = useState<'email' | 'phone'>('email');

    // Email registration state
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [emailSuccess, setEmailSuccess] = useState('');

    // Phone registration state
    const [phoneStep, setPhoneStep] = useState<1 | 2>(1);   // 1 = fill form, 2 = OTP
    const [phoneLoading, setPhoneLoading] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [pendingPhoneData, setPendingPhoneData] = useState<PhoneStep1Data | null>(null);

    // ── Email form ──────────────────────────────────────────────────────────
    const {
        register: regEmail,
        handleSubmit: handleEmail,
        setValue: setEmailValue,
        watch: watchEmail,
        formState: { errors: emailErrors },
    } = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
        defaultValues: { role: 'leitor' },
    });
    const emailRole = watchEmail('role');

    const onEmailSubmit = async (data: EmailFormData) => {
        setEmailLoading(true);
        setEmailError('');
        try {
            await signUp(data.email, data.password, data.name, data.role);
            setEmailSuccess('Conta criada com sucesso! A redirecionar para o login...');
            setTimeout(() => navigate('/login'), 4000);
        } catch (err: any) {
            setEmailError(err.message || 'Ocorreu um erro ao criar a conta.');
        } finally {
            setEmailLoading(false);
        }
    };

    // ── Phone form ──────────────────────────────────────────────────────────
    const {
        register: regPhone,
        handleSubmit: handlePhone,
        setValue: setPhoneValue,
        watch: watchPhone,
        formState: { errors: phoneErrors },
    } = useForm<PhoneStep1Data>({
        resolver: zodResolver(phoneStep1Schema),
        defaultValues: { role: 'leitor' },
    });
    const phoneRole = watchPhone('role');

    const onPhoneSend = async (data: PhoneStep1Data) => {
        setPhoneLoading(true);
        setPhoneError('');
        try {
            const fullNumber = '+244' + data.phone.replace(/\D/g, '');
            const result = await sendPhoneOTP(fullNumber, 'recaptcha-container');
            setConfirmationResult(result);
            setPendingPhoneData(data);
            setPhoneStep(2);
        } catch (err: any) {
            setPhoneError(err.message || 'Erro ao enviar SMS. Verifique o número.');
        } finally {
            setPhoneLoading(false);
        }
    };

    const onOTPConfirm = async () => {
        if (!confirmationResult || !pendingPhoneData) return;
        setPhoneLoading(true);
        setPhoneError('');
        try {
            await confirmPhoneOTP(confirmationResult, otp, pendingPhoneData.name, pendingPhoneData.role);
            navigate('/');
        } catch (err: any) {
            setPhoneError(err.message || 'Código inválido. Tente novamente.');
        } finally {
            setPhoneLoading(false);
        }
    };

    // ── Role selector (shared) ───────────────────────────────────────────────
    const RoleSelector = ({
        current, set
    }: { current: 'leitor' | 'autor'; set: (r: 'leitor' | 'autor') => void }) => (
        <div className="grid grid-cols-2 gap-4">
            {[
                { id: 'leitor' as const, icon: BookOpen, label: 'Leitor' },
                { id: 'autor' as const, icon: Sparkles, label: 'Autor' }
            ].map(r => (
                <button
                    key={r.id}
                    type="button"
                    onClick={() => set(r.id)}
                    className={`p-6 rounded-3xl flex flex-col items-center gap-3 transition-all border-2 font-black text-[10px] uppercase tracking-widest ${current === r.id
                        ? 'bg-brand-dark border-brand-dark text-white shadow-xl'
                        : 'bg-white border-gray-100 text-gray-400 hover:border-brand-primary/20'
                        }`}
                >
                    <r.icon className={`w-6 h-6 ${current === r.id ? 'text-brand-primary' : ''}`} />
                    {r.label}
                </button>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#B78628] flex items-center justify-center p-4 md:p-10 selection:bg-[#B78628] selection:text-white font-sans overflow-hidden">
            <SEO title="Criar Conta" description="Junte-se à família Editora Graça." />

            <div id="recaptcha-container" />

            <m.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[500px] bg-[#0F172A] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-visible border border-white/5 flex flex-col max-h-[90vh]"
            >
                {/* ── Avatar Circle ────────────────────────────────────── */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#1E293B] rounded-full flex items-center justify-center shadow-lg border-4 border-[#0F172A] z-10">
                    <div className="relative">
                        <User className="w-12 h-12 text-gray-400" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#B78628] rounded-full border-2 border-[#0F172A] flex items-center justify-center">
                            <span className="text-[10px] text-white font-bold">+</span>
                        </div>
                    </div>
                </div>

                {/* Inner Scrollable Container */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 pt-16 custom-scrollbar">
                    {/* ── Tabs ─────────────────────────────────────────────── */}
                    <div className="flex gap-12 justify-center mb-10">
                        <Link
                            to="/login"
                            className="relative pb-2 font-black text-lg uppercase tracking-widest text-gray-500 hover:text-gray-400 transition-all font-sans"
                        >
                            Entrar
                        </Link>
                        <button
                            className="relative pb-2 font-black text-lg uppercase tracking-widest text-white transition-all"
                        >
                            Criar Conta
                            <m.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-[#B78628] rounded-full" />
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {method === 'email' && (
                            <m.div key="email" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                {emailSuccess ? (
                                    <m.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-8 bg-green-500/10 border border-green-500/20 rounded-3xl text-center space-y-6"
                                    >
                                        <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                                            <Check className="w-8 h-8" />
                                        </div>
                                        <p className="text-green-400 font-black text-lg uppercase tracking-tighter">Conta Criada!</p>
                                        <p className="text-green-500/70 text-xs font-medium">{emailSuccess}</p>
                                        <Button onClick={() => navigate('/login')} className="w-full bg-[#B78628] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest">Ir para Login</Button>
                                    </m.div>
                                ) : (
                                    <form onSubmit={handleEmail(onEmailSubmit)} className="space-y-8">
                                        {/* Role Selector Adapt */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { id: 'leitor' as const, icon: BookOpen, label: 'Leitor' },
                                                { id: 'autor' as const, icon: Sparkles, label: 'Autor' }
                                            ].map(r => (
                                                <button
                                                    key={r.id}
                                                    type="button"
                                                    onClick={() => setEmailValue('role', r.id)}
                                                    className={`py-5 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest border-2 ${emailRole === r.id
                                                        ? 'bg-[#B78628] border-[#B78628] text-white shadow-lg'
                                                        : 'bg-[#1E293B] border-transparent text-gray-500 hover:text-gray-400'
                                                        }`}
                                                >
                                                    <r.icon className="w-6 h-6 mb-1" />
                                                    {r.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Nome Completo</label>
                                            <div className="relative">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"><User className="w-5 h-5" /></div>
                                                <input {...regEmail('name')} placeholder="Seu nome" className="w-full bg-[#1E293B] border-none rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#B78628] transition-all outline-none" />
                                            </div>
                                            {emailErrors.name && <p className="text-[10px] text-red-500 font-bold ml-1">{emailErrors.name.message}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email</label>
                                            <div className="relative">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"><Mail className="w-5 h-5" /></div>
                                                <input {...regEmail('email')} type="email" placeholder="seu@email.com" className="w-full bg-[#1E293B] border-none rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#B78628] transition-all outline-none" />
                                            </div>
                                            {emailErrors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{emailErrors.email.message}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Palavra-passe</label>
                                            <div className="relative">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"><Lock className="w-5 h-5" /></div>
                                                <input {...regEmail('password')} type="password" placeholder="••••••••" className="w-full bg-[#1E293B] border-none rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#B78628] transition-all outline-none" />
                                            </div>
                                            {emailErrors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{emailErrors.password.message}</p>}
                                        </div>

                                        {emailError && <p className="text-[10px] font-bold text-red-500 text-center">⚠️ {emailError}</p>}

                                        <Button type="submit" isLoading={emailLoading} className="w-full py-5 rounded-2xl bg-[#B78628] hover:bg-[#A37824] text-white text-sm font-black uppercase tracking-[0.3em] shadow-lg shadow-[#B78628]/20 transition-all active:scale-[0.98]">
                                            Confirmar Registo
                                        </Button>
                                    </form>
                                )}
                            </m.div>
                        )}

                        {method === 'phone' && (
                            <m.div key="phone" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                                <AnimatePresence mode="wait">
                                    {phoneStep === 1 && (
                                        <m.form key="p1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handlePhone(onPhoneSend)} className="space-y-8">
                                            <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    { id: 'leitor' as const, icon: BookOpen, label: 'Leitor' },
                                                    { id: 'autor' as const, icon: Sparkles, label: 'Autor' }
                                                ].map(r => (
                                                    <button key={r.id} type="button" onClick={() => setPhoneValue('role', r.id)} className={`py-5 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest border-2 ${phoneRole === r.id ? 'bg-[#B78628] border-[#B78628] text-white shadow-lg' : 'bg-[#1E293B] border-transparent text-gray-500'}`}>
                                                        <r.icon className="w-6 h-6 mb-1" /> {r.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Nome Completo</label>
                                                <div className="relative">
                                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"><User className="w-5 h-5" /></div>
                                                    <input {...regPhone('name')} placeholder="Seu nome" className="w-full bg-[#1E293B] border-none rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#B78628] outline-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Número de Telemóvel</label>
                                                <div className="flex gap-3">
                                                    <div className="flex items-center gap-2 px-4 py-4 bg-[#1E293B] rounded-2xl text-xs font-black text-white shrink-0">🇦🇴 +244</div>
                                                    <input {...regPhone('phone')} type="tel" placeholder="912 345 678" className="flex-1 px-5 py-4 bg-[#1E293B] border-none rounded-2xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-[#B78628]" />
                                                </div>
                                            </div>
                                            {phoneError && <p className="text-[10px] font-bold text-red-500 text-center">⚠️ {phoneError}</p>}
                                            <Button type="submit" isLoading={phoneLoading} className="w-full py-5 rounded-2xl bg-[#B78628] hover:bg-[#A37824] text-white text-sm font-black uppercase tracking-[0.3em] shadow-lg shadow-[#B78628]/20">Enviar SMS</Button>
                                        </m.form>
                                    )}
                                    {phoneStep === 2 && (
                                        <m.div key="p2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 text-center">
                                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Código Enviado!</p>
                                                <p className="text-[10px] text-gray-500 font-medium">+244 {pendingPhoneData?.phone}</p>
                                            </div>
                                            <input type="number" value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" className="w-full bg-[#1E293B] border-none rounded-2xl py-6 text-3xl font-black text-white text-center tracking-[0.5em] outline-none focus:ring-2 focus:ring-[#B78628]" />
                                            <Button type="button" onClick={onOTPConfirm} isLoading={phoneLoading} disabled={otp.length < 6} className="w-full py-5 rounded-2xl bg-[#B78628] hover:bg-[#A37824] text-white text-sm font-black uppercase tracking-[0.3em]">Confirmar e Entrar</Button>
                                        </m.div>
                                    )}
                                </AnimatePresence>
                            </m.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Logic Toggle */}
                    <div className="mt-10 pt-8 border-t border-white/5 text-center space-y-6">
                        <button
                            type="button"
                            onClick={() => setMethod(method === 'email' ? 'phone' : 'email')}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B78628] hover:text-white transition-colors"
                        >
                            {method === 'email' ? 'Registar via Telemóvel' : 'Registar via Email'}
                        </button>

                        <div className="pt-2">
                            <Link to="/" className="inline-flex px-6 py-3 bg-[#1E293B] hover:bg-[#2D3748] text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all border border-white/10 shadow-lg">
                                Voltar ao Início
                            </Link>
                        </div>

                        <p className="text-[9px] text-gray-600 uppercase tracking-widest leading-relaxed">
                            Ao registar-se, aceita os nossos protocolos<br />de privacidade e termos de uso.
                        </p>
                    </div>
                </div>
            </m.div>

            {/* Global style for scrollbar */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(183,134,40,0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(183,134,40,0.5); }
            `}</style>
        </div>
    );
};

export default RegisterPage;

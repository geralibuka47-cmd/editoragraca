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
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 md:p-12 relative overflow-hidden selection:bg-brand-primary selection:text-white">
            <SEO title="Criar Conta" description="Junte-se à família Editora Graça." />

            {/* reCAPTCHA invisible container */}
            <div id="recaptcha-container" />

            {/* Background Aesthetics */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(196,160,82,0.05)_0%,_transparent_40%)]" />

            <m.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-white relative z-10"
            >
                {/* ── Form Side ───────────────────────────────────────────── */}
                <div className="p-10 md:p-24 flex flex-col justify-center order-2 lg:order-1">
                    <div className="max-w-md mx-auto w-full space-y-10">

                        <div className="space-y-4">
                            <span className="px-5 py-2 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-full">
                                Nova Jornada
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter uppercase leading-[0.9]">
                                Começar <br />
                                <span className="text-brand-primary">O Seu Legado</span>
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
                                    onClick={() => { setMethod(tab.id); setPhoneStep(1); setPhoneError(''); setEmailError(''); }}
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
                            {/* ── EMAIL METHOD ─────────────────────────────── */}
                            {method === 'email' && (
                                <m.div key="email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                    {emailSuccess ? (
                                        <m.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-10 bg-green-50 rounded-[3rem] border border-green-100 text-center space-y-6 shadow-xl shadow-green-500/5"
                                        >
                                            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                                                <Check className="w-10 h-10" />
                                            </div>
                                            <p className="text-green-700 font-black text-lg">Conta Criada!</p>
                                            <p className="text-green-600 text-sm font-medium">{emailSuccess}</p>
                                            <Button onClick={() => navigate('/login')} variant="secondary" className="w-full">Ir para Login</Button>
                                        </m.div>
                                    ) : (
                                        <form onSubmit={handleEmail(onEmailSubmit)} className="space-y-8">
                                            <RoleSelector current={emailRole} set={(r) => setEmailValue('role', r)} />
                                            <Input id="name" label="Nome Completo" placeholder="Seu nome" variant="light" icon={<User className="w-5 h-5" />} {...regEmail('name')} error={emailErrors.name?.message} />
                                            <Input id="email" type="email" label="Email" placeholder="seu@email.com" variant="light" icon={<Mail className="w-5 h-5" />} {...regEmail('email')} error={emailErrors.email?.message} />
                                            <Input id="password" type="password" label="Palavra-passe" placeholder="••••••••" variant="light" icon={<Lock className="w-5 h-5" />} {...regEmail('password')} error={emailErrors.password?.message} />
                                            {emailError && <p className="text-xs font-bold text-red-500 ml-4">⚠️ {emailError}</p>}
                                            <Button type="submit" isLoading={emailLoading} className="w-full py-8 rounded-[2rem] text-[11px] tracking-[0.5em] shadow-xl shadow-brand-dark/10" rightIcon={!emailLoading && <Check className="w-5 h-5" />}>
                                                Criar Conta
                                            </Button>
                                        </form>
                                    )}
                                </m.div>
                            )}

                            {/* ── PHONE METHOD ─────────────────────────────── */}
                            {method === 'phone' && (
                                <m.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">

                                    <AnimatePresence mode="wait">
                                        {/* Step 1 — Fill form */}
                                        {phoneStep === 1 && (
                                            <m.form
                                                key="phone-step1"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                onSubmit={handlePhone(onPhoneSend)}
                                                className="space-y-8"
                                            >
                                                <RoleSelector current={phoneRole} set={(r) => setPhoneValue('role', r)} />

                                                <Input
                                                    id="phone-name"
                                                    label="Nome Completo"
                                                    placeholder="Seu nome completo"
                                                    variant="light"
                                                    icon={<User className="w-5 h-5" />}
                                                    {...regPhone('name')}
                                                    error={phoneErrors.name?.message}
                                                />

                                                {/* Phone input with +244 prefix */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                                                        Número de Telemóvel
                                                    </label>
                                                    <div className="flex gap-3">
                                                        <div className="flex items-center gap-2 px-4 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-black text-brand-dark shrink-0">
                                                            🇦🇴 +244
                                                        </div>
                                                        <input
                                                            {...regPhone('phone')}
                                                            type="tel"
                                                            placeholder="912 345 678"
                                                            className="flex-1 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                        />
                                                    </div>
                                                    {phoneErrors.phone && <p className="text-xs text-red-500 font-bold ml-1">{phoneErrors.phone.message}</p>}
                                                </div>

                                                {phoneError && <p className="text-xs font-bold text-red-500 ml-4">⚠️ {phoneError}</p>}

                                                <Button
                                                    type="submit"
                                                    isLoading={phoneLoading}
                                                    className="w-full py-8 rounded-[2rem] text-[11px] tracking-[0.5em] shadow-xl shadow-brand-dark/10"
                                                    rightIcon={!phoneLoading && <MessageSquare className="w-5 h-5" />}
                                                >
                                                    Enviar Código SMS
                                                </Button>
                                            </m.form>
                                        )}

                                        {/* Step 2 — OTP code */}
                                        {phoneStep === 2 && (
                                            <m.div
                                                key="phone-step2"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="space-y-8"
                                            >
                                                <div className="p-8 bg-brand-primary/5 rounded-3xl border border-brand-primary/10 text-center space-y-3">
                                                    <MessageSquare className="w-10 h-10 text-brand-primary mx-auto" />
                                                    <p className="text-sm font-black text-brand-dark uppercase tracking-widest">SMS Enviado!</p>
                                                    <p className="text-xs text-gray-500 font-medium">
                                                        Insira o código de 6 dígitos enviado para +244 {pendingPhoneData?.phone}
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                                                        Código de Verificação
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={otp}
                                                        onChange={e => setOtp(e.target.value)}
                                                        placeholder="000000"
                                                        maxLength={6}
                                                        className="w-full px-6 py-6 bg-gray-50 border border-gray-100 rounded-2xl text-3xl font-black text-center tracking-[1em] outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                    />
                                                </div>

                                                {phoneError && <p className="text-xs font-bold text-red-500 ml-4">⚠️ {phoneError}</p>}

                                                <div className="flex flex-col gap-4">
                                                    <Button
                                                        type="button"
                                                        onClick={onOTPConfirm}
                                                        isLoading={phoneLoading}
                                                        disabled={otp.length < 6}
                                                        className="w-full py-8 rounded-[2rem] text-[11px] tracking-[0.5em] shadow-xl shadow-brand-dark/10"
                                                        rightIcon={!phoneLoading && <Check className="w-5 h-5" />}
                                                    >
                                                        Confirmar e Entrar
                                                    </Button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setPhoneStep(1); setOtp(''); setPhoneError(''); }}
                                                        className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-dark transition-colors"
                                                    >
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
                                Já possui autorização? <br />
                                <Link to="/login" className="text-brand-primary inline-block mt-2 hover:scale-110 transition-transform">Entrar na Casa</Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Right Side: Visual ─────────────────────────────────── */}
                <div className="hidden lg:flex bg-brand-light p-24 flex-col justify-between relative overflow-hidden order-1 lg:order-2">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1457131746774-1e3a12d753f4?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
                    <div className="relative z-10 space-y-12">
                        <Link to="/" className="inline-flex items-center gap-4 group">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm group-hover:scale-110 transition-transform">
                                <BookOpen className="w-8 h-8 text-brand-primary" />
                            </div>
                            <span className="font-black text-xl uppercase tracking-tighter text-brand-dark">Graça</span>
                        </Link>
                        <div className="space-y-8">
                            <h2 className="text-6xl font-black tracking-tighter leading-[0.9] uppercase text-brand-dark">
                                Escreva a sua <br />
                                <span className="text-brand-primary italic font-serif font-normal lowercase text-5xl">Própria História</span>
                            </h2>
                            <p className="text-brand-dark/60 text-lg font-medium leading-relaxed max-w-sm">
                                Seja como leitor atento ou autor visionário, existe um capítulo para si no nosso ecossistema cultural.
                            </p>
                        </div>
                    </div>
                    <div className="relative z-10 p-10 bg-white rounded-[3rem] shadow-2xl space-y-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Garantia de Excelência</p>
                        </div>
                        <p className="text-xs text-brand-dark/50 font-medium leading-relaxed">
                            Ao registar-se, aceita os nossos protocolos de privacidade e termos de uso da Editora Graça.
                        </p>
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

export default RegisterPage;

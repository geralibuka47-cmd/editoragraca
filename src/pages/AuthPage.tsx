import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { login, signUp, loginWithGoogle } from '../services/authService';
import { User, Mail, Lock, ArrowRight, BookOpen, Check, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

// Validation Schemas
const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const registerSchema = loginSchema.extend({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    role: z.enum(['leitor', 'autor']),
});

type FormData = z.infer<typeof registerSchema>;

interface AuthPageProps {
    onLogin: (user: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialMode = searchParams.get('mode');

    const [isLogin, setIsLogin] = useState(initialMode !== 'register');
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [success, setSuccess] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
    const mounted = useRef(true);

    // Form Setup
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<any>({
        resolver: zodResolver(isLogin ? loginSchema : registerSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
            role: 'leitor',
        },
    });

    const currentRole = watch('role');

    // Sync isLogin with URL mode if it changes
    useEffect(() => {
        const mode = searchParams.get('mode');
        if (mode === 'register') {
            setIsLogin(false);
        } else if (mode === 'login') {
            setIsLogin(true);
        }
    }, [searchParams]);

    // Reset form errors when switching modes
    useEffect(() => {
        setAuthError('');
        setSuccess('');
        // We don't fully reset values to be nice (keep email if typed), but we re-validate
    }, [isLogin]);

    const checkConnection = async () => {
        setConnectionStatus('checking');
        setAuthError('A testar conectividade...');

        try {
            const start = Date.now();
            await fetch('/favicon.ico', { cache: 'no-store' });
            const internetTime = Date.now() - start;

            const fbProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
            if (fbProjectId) {
                try {
                    const startFb = Date.now();
                    const fbTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));
                    await Promise.race([
                        fetch(`https://${fbProjectId}.firebaseapp.com`, { mode: 'no-cors', cache: 'no-store' }),
                        fbTimeout
                    ]);
                    const fbTime = Date.now() - startFb;
                    setConnectionStatus('ok');
                    setAuthError(`Diagnóstico: Internet OK (${internetTime}ms). Servidor Firebase OK (${fbTime}ms).`);
                } catch (fbErr) {
                    console.error("Firebase check failed:", fbErr);
                    setConnectionStatus('error');
                    setAuthError(`Internet OK (${internetTime}ms), mas o Servidor Firebase NÃO responde.`);
                }
            } else {
                setConnectionStatus('ok');
                setAuthError(`Conexão OK (${internetTime}ms). Firebase não configurado.`);
            }
        } catch (e) {
            setConnectionStatus('error');
            setAuthError('Sem acesso à internet. Verifique sua conexão.');
        } finally {
            setTimeout(() => {
                if (mounted.current) setConnectionStatus('idle');
            }, 10000);
        }
    };

    React.useEffect(() => {
        return () => { mounted.current = false; };
    }, []);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setAuthError('');
        setSuccess('');

        try {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('timeout')), 15000);
            });

            if (isLogin) {
                const user = await Promise.race([
                    login(data.email, data.password),
                    timeoutPromise
                ]) as any;

                if (user) {
                    onLogin(user);
                    navigate('/');
                }
            } else {
                const user = await Promise.race([
                    signUp(data.email, data.password, data.name!, data.role!),
                    timeoutPromise
                ]) as any;

                if (user) {
                    setSuccess('Conta criada com sucesso! Por favor, verifique o seu e-mail para confirmar o registo antes de entrar.');
                    setIsLogin(true);
                    reset(); // Clear form after success
                }
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            const msg = err.message || '';
            if (msg === 'timeout') {
                setAuthError('⏱️ A conexão com o servidor demorou muito.');
            } else if (msg.includes('Invalid login credentials') || msg.includes('invalid-credential')) {
                setAuthError('🔒 E-mail ou senha incorretos.');
            } else if (msg.includes('Email not confirmed')) {
                setAuthError('📧 O seu e-mail ainda não foi confirmado.');
            } else if (msg.includes('User already registered') || msg.includes('email-already-in-use')) {
                setAuthError('👤 Este e-mail já está registado.');
            } else if (msg.includes('Failed to fetch')) {
                setAuthError('🌐 Erro de rede. Verifique sua conexão.');
            } else {
                setAuthError(`❌ ${msg || 'Ocorreu um erro. Tente novamente.'}`);
            }
        } finally {
            if (mounted.current) setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setAuthError('');
        try {
            const user = await loginWithGoogle();
            if (user) {
                onLogin(user);
                navigate('/');
            }
        } catch (err: any) {
            setAuthError(err.message || 'Erro ao entrar com Google');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-10 bg-[#F8FAFC] relative overflow-hidden">
            <div className="h-16 md:h-20"></div>

            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(196,160,82,0.05)_0%,_transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.03)_0%,_transparent_40%)]"></div>

            <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-6xl glass-premium rounded-3xl md:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row shadow-brand-dark/5 border border-white relative z-10"
            >
                {/* Back Link */}
                <div className="absolute top-10 left-10 z-[60]">
                    <m.button
                        whileHover={{ x: -10 }}
                        onClick={() => navigate('/')}
                        className="text-brand-dark hover:text-brand-primary transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.3em] bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-sm"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        <span>Retornar ao Início</span>
                    </m.button>
                </div>

                {/* Left Side: Narrative */}
                <div className="hidden lg:flex lg:w-[45%] bg-brand-dark p-12 md:p-24 flex-col justify-center relative overflow-hidden text-white min-h-[400px]">
                    <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 grayscale"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark/90 to-brand-primary/20"></div>

                    <div className="relative z-10 space-y-12">
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-20 h-20 bg-brand-primary/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-brand-primary border border-white/10 shadow-2xl"
                        >
                            <BookOpen className="w-10 h-10" />
                        </m.div>

                        <div className="space-y-6">
                            <m.h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase">
                                Junte-se ao Nosso <br />
                                <span className="text-gradient-gold italic font-light lowercase">Legado Literário</span>
                            </m.h1>

                            <m.p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-sm opacity-80">
                                Entre na casa da literatura angolana e eternize a sua paixão pela leitura e escrita.
                            </m.p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:w-[55%] p-10 md:p-24 flex flex-col justify-center bg-white relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px] rounded-full"></div>

                    <div className="max-w-md mx-auto w-full space-y-12 relative z-10">
                        <div className="text-center md:text-left">
                            <m.span className="inline-block px-5 py-2 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-full mb-8 shadow-sm">
                                {isLogin ? 'Retorno de Elite' : 'Novo Horizonte'}
                            </m.span>
                            <h2 className="text-4xl md:text-6xl font-black text-brand-dark tracking-tighter leading-tight mb-4 uppercase">
                                {isLogin ? 'Bem-vindo de Volta' : 'Começar Jornada'}
                            </h2>
                            <p className="text-gray-400 font-bold text-lg leading-relaxed">
                                {isLogin ? 'O seu lugar no universo literário aguarda.' : 'Crie a sua identidade na Editora Graça.'}
                            </p>
                        </div>

                        {/* Alerts */}
                        {success && (
                            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-green-50 border border-green-100 rounded-[2.5rem] text-green-700 text-sm font-bold flex items-center gap-6 shadow-xl shadow-green-500/5">
                                <Check className="w-6 h-6 text-green-500" />
                                <p>{success}</p>
                            </m.div>
                        )}

                        {authError && (
                            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-red-50 border border-red-100 rounded-[2.5rem] space-y-6 shadow-xl shadow-red-500/5">
                                <p className="text-red-700 text-sm font-black tracking-tight leading-relaxed">{authError}</p>
                                <div className="flex gap-4 items-center pt-6 border-t border-red-100">
                                    <Button variant="ghost" size="sm" onClick={checkConnection} className="text-[10px] uppercase text-red-500 hover:text-red-700">Diagnóstico</Button>
                                </div>
                            </m.div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {!isLogin && (
                                <Input
                                    id="name"
                                    label="Identidade Literária"
                                    placeholder="Seu nome completo"
                                    variant="light"
                                    icon={<User className="w-5 h-5" />}
                                    {...register('name')}
                                    error={errors.name?.message as string}
                                />
                            )}

                            <Input
                                id="email"
                                type="email"
                                label="Canal Digital (E-mail)"
                                placeholder="seu@email.com"
                                variant="light"
                                icon={<Mail className="w-5 h-5" />}
                                {...register('email')}
                                error={errors.email?.message as string}
                            />

                            <Input
                                id="password"
                                type="password"
                                label="Chave de Acesso"
                                placeholder="••••••••"
                                variant="light"
                                icon={<Lock className="w-5 h-5" />}
                                {...register('password')}
                                error={errors.password?.message as string}
                            />

                            {!isLogin && (
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 ml-6">Perfil Graciano</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setValue('role', 'leitor')}
                                            className={`py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all border-2 
                                        ${currentRole === 'leitor'
                                                    ? 'bg-brand-primary border-brand-primary text-white shadow-lg'
                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-brand-primary/20'}`}
                                        >
                                            Leitor
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setValue('role', 'autor')}
                                            className={`py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all border-2 
                                        ${currentRole === 'autor'
                                                    ? 'bg-brand-primary border-brand-primary text-white shadow-lg'
                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-brand-primary/20'}`}
                                        >
                                            Autor
                                        </button>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full py-7 rounded-[2rem] text-[11px] tracking-[0.5em]"
                                variant={isLogin ? 'secondary' : 'secondary'}
                                rightIcon={!loading && <ArrowRight className="w-5 h-5" />}
                            >
                                {isLogin ? 'Aceder à Casa' : 'Eternizar Membro'}
                            </Button>

                            <div className="relative py-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                                    <span className="bg-white px-6 text-gray-300">Ou continue com</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full py-5 rounded-[2rem] border-2 border-gray-100 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </button>
                        </form>

                        <div className="text-center pt-10 border-t border-gray-50">
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] leading-loose">
                                {isLogin ? 'Ainda não faz parte da família?' : 'Já possui autorização de acesso?'}
                                <br />
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-brand-primary font-black mt-2 hover:scale-110 mb-[-4px] transition-transform inline-block border-b-2 border-brand-primary/20 hover:border-brand-primary pb-1"
                                >
                                    {isLogin ? 'Manifeste o seu Interesse' : 'Autentique-se'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </m.div>
        </div>
    );
};

export default AuthPage;

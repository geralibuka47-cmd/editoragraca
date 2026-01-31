import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login, signUp } from '../services/authService';
import { User, Mail, Lock, ArrowRight, BookOpen, Check, Loader2 } from 'lucide-react';

interface AuthPageProps {
    onLogin: (user: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialMode = searchParams.get('mode');

    const [isLogin, setIsLogin] = useState(initialMode !== 'register');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
    const mounted = useRef(true);

    // Sync isLogin with URL mode if it changes
    useEffect(() => {
        const mode = searchParams.get('mode');
        if (mode === 'register') {
            setIsLogin(false);
        } else if (mode === 'login') {
            setIsLogin(true);
        }
    }, [searchParams]);

    const checkConnection = async () => {
        setConnectionStatus('checking');
        setError('A testar conectividade...');

        try {
            const start = Date.now();
            // Simple fetch to check internet access
            await fetch('/favicon.ico', { cache: 'no-store' });
            const internetTime = Date.now() - start;

            // Now check Firebase specifically
            const fbProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
            if (fbProjectId) {
                try {
                    const startFb = Date.now();
                    // Timeout for Firebase check (5s)
                    const fbTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));

                    // fetch a Firebase-related endpoint to check connectivity
                    await Promise.race([
                        fetch(`https://${fbProjectId}.firebaseapp.com`, { mode: 'no-cors', cache: 'no-store' }),
                        fbTimeout
                    ]);

                    const fbTime = Date.now() - startFb;
                    setConnectionStatus('ok');
                    setError(`Diagnóstico: Internet OK (${internetTime}ms). Servidor Firebase OK (${fbTime}ms). Se falhar novamente, tente dados móveis.`);
                } catch (fbErr) {
                    console.error("Firebase check failed:", fbErr);
                    setConnectionStatus('error');
                    setError(`Internet OK (${internetTime}ms), mas o Servidor Firebase NÃO responde (Bloqueio ou Falha). Tente outra rede (ex: dados móveis).`);
                    return;
                }
            } else {
                setConnectionStatus('ok');
                setError(`Conexão OK (${internetTime}ms). Firebase não configurado.`);
            }
        } catch (e) {
            setConnectionStatus('error');
            setError('Sem acesso à internet. Verifique sua conexão.');
        } finally {
            setTimeout(() => {
                if (mounted.current) setConnectionStatus('idle');
            }, 10000); // Show result for 10s
        }
    };

    React.useEffect(() => {
        return () => { mounted.current = false; };
    }, []);

    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanEmail = email.trim();
        const cleanName = name.trim();

        if (!cleanEmail) {
            setError('O e-mail é obrigatório.');
            return;
        }

        if (!isLogin && !cleanName) {
            setError('O nome é obrigatório.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('timeout')), 15000); // Reduced from 25s to 15s
            });

            if (isLogin) {
                const user = await Promise.race([
                    login(cleanEmail, password),
                    timeoutPromise
                ]) as any;

                if (user) {
                    onLogin(user);
                    navigate('/');
                }
            } else {
                const user = await Promise.race([
                    signUp(cleanEmail, password, cleanName),
                    timeoutPromise
                ]) as any;

                if (user) {
                    setSuccess('Conta criada com sucesso! Por favor, verifique o seu e-mail para confirmar o registo antes de entrar.');
                    setIsLogin(true);
                }
            }
        } catch (err: any) {
            console.error("Auth error:", err);

            const msg = err.message || '';
            if (msg === 'timeout') {
                setError('⏱️ A conexão com o servidor demorou muito. Isto pode indicar um problema com o Firebase. Verifique se o projeto está ativo e se as credenciais estão corretas.');
            } else if (msg.includes('Invalid login credentials') || msg.includes('Invalid log in')) {
                setError('🔒 E-mail ou senha incorretos. Por favor, tente novamente.');
            } else if (msg.includes('Email not confirmed')) {
                setError('📧 O seu e-mail ainda não foi confirmado. Verifique a sua caixa de entrada.');
            } else if (msg.includes('User already registered')) {
                setError('👤 Este e-mail já está registado. Tente fazer login.');
            } else if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
                setError('🌐 Erro de rede. Verifique sua conexão com a internet e tente novamente.');
            } else if (err.status === 401 || msg.includes('401')) {
                setError('🔐 Erro de autenticação (401). As credenciais do Firebase podem estar incorretas ou o projeto pode estar pausado. Contacte o administrador.');
            } else {
                setError(`❌ ${msg || 'Ocorreu um erro ao processar o seu pedido. Tente novamente.'}`);
            }
        } finally {
            if (mounted.current) {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-brand-light">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in relative">
                <div className="absolute top-8 left-8 z-20">
                    <button onClick={() => navigate('/')} className="text-brand-dark/40 hover:text-brand-primary transition-colors flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
                        Voltar ao Início
                    </button>
                </div>

                {/* Left Side: Visual/Message */}
                <div className="md:w-1/2 bg-brand-dark p-8 md:p-16 flex flex-col justify-center relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 space-y-6 md:space-y-8">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-primary/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-brand-primary">
                            <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight md:leading-none">
                            Seja Bem-vindo à <span className="text-brand-primary italic font-serif font-normal">Nossa Família</span>
                        </h1>

                        <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed">
                            Crie uma conta para gerir os seus pedidos, guardar favoritos e ter acesso a edições exclusivas.
                        </p>

                        <ul className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                            <li className="flex items-center gap-3 text-xs md:text-sm font-bold text-white/80">
                                <div className="w-4 h-4 md:w-5 md:h-5 bg-brand-primary rounded-full flex items-center justify-center shrink-0">
                                    <Check className="w-2 h-2 md:w-3 md:h-3 text-white" />
                                </div>
                                Acompanhamento de pedidos
                            </li>
                            <li className="flex items-center gap-3 text-xs md:text-sm font-bold text-white/80">
                                <div className="w-4 h-4 md:w-5 md:h-5 bg-brand-primary rounded-full flex items-center justify-center shrink-0">
                                    <Check className="w-2 h-2 md:w-3 md:h-3 text-white" />
                                </div>
                                Lista de desejos personalizada
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-1/2 p-8 md:p-20 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full space-y-8 md:space-y-10">
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl font-black text-brand-dark tracking-tighter">
                                {isLogin ? 'Iniciar Sessão' : 'Criar Nova Conta'}
                            </h2>
                            <p className="text-gray-500 font-medium pt-2">
                                {isLogin ? 'Bem-vindo de volta! Introduza os seus dados.' : 'Junte-se a nós para uma experiência literária única.'}
                            </p>
                        </div>

                        {success && (
                            <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-bold animate-fade-in">
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold animate-shake">
                                {error}
                                <div className="mt-2">
                                    <div className="flex gap-4 items-center">
                                        <button
                                            type="button"
                                            onClick={checkConnection}
                                            disabled={connectionStatus === 'checking'}
                                            className="text-xs underline hover:text-red-900 font-bold flex items-center gap-2"
                                        >
                                            {connectionStatus === 'checking' && <Loader2 className="w-3 h-3 animate-spin" />}
                                            {connectionStatus === 'idle' && 'Testar minha conexão'}
                                            {connectionStatus === 'ok' && 'Internet OK'}
                                            {connectionStatus === 'error' && 'Sem Internet'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                localStorage.clear();
                                                window.location.reload();
                                            }}
                                            className="text-xs py-1 px-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-bold ml-auto"
                                            title="Limpar memória do navegador e recarregar"
                                        >
                                            Resetar App
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!isLogin && (
                                <div className="form-group-premium">
                                    <label htmlFor="name" className="label-premium">Nome Completo</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                                        <input
                                            id="name"
                                            type="text"
                                            required
                                            placeholder="Ex: João Silva"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="input-premium pl-12"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="form-group-premium">
                                <label htmlFor="email" className="label-premium">Endereço de E-mail</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-premium pl-12"
                                    />
                                </div>
                            </div>

                            <div className="form-group-premium">
                                <label htmlFor="password" className="label-premium">Sua Senha</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-premium pl-12"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-premium py-5 text-lg rounded-2xl shadow-xl shadow-brand-primary/20 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>Processando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{isLogin ? 'Entrar Agora' : 'Finalizar Registo'}</span>
                                        <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center">
                            <p className="text-gray-500 font-medium">
                                {isLogin ? 'Ainda não tem conta?' : 'Já possui uma conta?'}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-brand-primary font-black ml-2 hover:underline tracking-tight"
                                >
                                    {isLogin ? 'Crie uma aqui' : 'Inicie sessão'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

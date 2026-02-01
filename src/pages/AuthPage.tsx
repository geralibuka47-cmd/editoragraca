import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion as m } from 'framer-motion';
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
    const [role, setRole] = useState<'leitor' | 'autor'>('leitor');
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
                    signUp(cleanEmail, password, cleanName, role),
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
            } else if (msg.includes('Invalid login credentials') ||
                msg.includes('Invalid log in') ||
                msg.includes('invalid-credential') ||
                msg.includes('E-mail ou senha incorretos')) {
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
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-10 bg-[#F8FAFC] relative overflow-hidden">
            {/* Nav Padding Spacer */}
            <div className="h-16 md:h-20"></div>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(196,160,82,0.05)_0%,_transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.03)_0%,_transparent_40%)]"></div>

            <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-6xl glass-premium rounded-[4rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row shadow-brand-dark/5 border border-white relative z-10"
            >
                {/* Back Link */}
                <div className="absolute top-10 left-10 z-[60]">
                    <m.button
                        whileHover={{ x: -10 }}
                        onClick={() => navigate('/')}
                        className="text-brand-dark hover:text-brand-primary transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.3em] bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-sm"
                        title="Retornar ao Início"
                        aria-label="Retornar ao Início"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        <span>Retornar ao Início</span>
                    </m.button>
                </div>

                {/* Left Side: Cinematic Narrative */}
                <div className="lg:w-[45%] bg-brand-dark p-12 md:p-24 flex flex-col justify-center relative overflow-hidden text-white min-h-[400px]">
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
                            <m.h1
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase"
                            >
                                Junte-se ao Nosso <br />
                                <span className="text-gradient-gold italic font-light lowercase">Legado Literário</span>
                            </m.h1>

                            <m.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-sm opacity-80"
                            >
                                Entre na casa da literatura angolana e eternize a sua paixão pela leitura e escrita.
                            </m.p>
                        </div>

                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-6"
                        >
                            {[
                                'Acesso a edições limitadas e raras',
                                'Gestão simplificada de encomendas',
                                'Comunidade exclusiva de autores'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                                    <div className="w-6 h-6 bg-brand-primary/20 rounded-lg flex items-center justify-center border border-brand-primary/20">
                                        <Check className="w-3 h-3 text-brand-primary" />
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </m.div>
                    </div>
                </div>

                {/* Right Side: Sophisticated Form Area */}
                <div className="lg:w-[55%] p-10 md:p-24 flex flex-col justify-center bg-white relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px] rounded-full"></div>

                    <div className="max-w-md mx-auto w-full space-y-12 relative z-10">
                        <div className="text-center md:text-left">
                            <m.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="inline-block px-5 py-2 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-full mb-8 shadow-sm"
                            >
                                {isLogin ? 'Retorno de Elite' : 'Novo Horizonte'}
                            </m.span>
                            <h2 className="text-5xl md:text-6xl font-black text-brand-dark tracking-tighter leading-tight mb-4 uppercase">
                                {isLogin ? 'Bem-vindo de Volta' : 'Começar Jornada'}
                            </h2>
                            <p className="text-gray-400 font-bold text-lg leading-relaxed">
                                {isLogin ? 'O seu lugar no universo literário aguarda.' : 'Crie a sua identidade na Editora Graça.'}
                            </p>
                        </div>

                        {success && (
                            <m.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-8 bg-green-50 border border-green-100 rounded-[2.5rem] text-green-700 text-sm font-bold flex items-center gap-6 shadow-xl shadow-green-500/5"
                            >
                                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-500/20">
                                    <Check className="w-6 h-6" />
                                </div>
                                <p className="leading-relaxed">{success}</p>
                            </m.div>
                        )}

                        {error && (
                            <m.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-8 bg-red-50 border border-red-100 rounded-[2.5rem] space-y-6 shadow-xl shadow-red-500/5"
                            >
                                <p className="text-red-700 text-sm font-black tracking-tight leading-relaxed">{error}</p>
                                <div className="flex gap-4 items-center pt-6 border-t border-red-100">
                                    <button
                                        type="button"
                                        onClick={checkConnection}
                                        disabled={connectionStatus === 'checking'}
                                        className="text-[10px] uppercase tracking-[0.3em] text-red-400 hover:text-red-700 font-black flex items-center gap-3 transition-colors"
                                        title="Diagnóstico de Rede"
                                        aria-label="Diagnóstico de Rede"
                                    >
                                        {connectionStatus === 'checking' ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>}
                                        Diagnóstico
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            localStorage.clear();
                                            window.location.reload();
                                        }}
                                        className="text-[10px] uppercase tracking-[0.3em] px-5 py-2.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 font-black ml-auto transition-all active:scale-95"
                                        title="Resetar App"
                                        aria-label="Resetar App"
                                    >
                                        Reset Sistema
                                    </button>
                                </div>
                            </m.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {!isLogin && (
                                <div className="space-y-4">
                                    <label htmlFor="name" className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 ml-6">Identidade Literária</label>
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-brand-primary transition-all duration-500" />
                                        <input
                                            id="name"
                                            type="text"
                                            required
                                            placeholder="Seu nome completo"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-[2rem] px-16 py-6 text-brand-dark font-black tracking-tight transition-all outline-none shadow-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <label htmlFor="email" className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 ml-6">Canal Digital (E-mail)</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-brand-primary transition-all duration-500" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-[2rem] px-16 py-6 text-brand-dark font-black tracking-tight transition-all outline-none shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label htmlFor="password" className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 ml-6">Chave de Acesso</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-brand-primary transition-all duration-500" />
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-[2rem] px-16 py-6 text-brand-dark font-black tracking-tight transition-all outline-none shadow-sm"
                                    />
                                </div>
                            </div>

                            {!isLogin && (
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 ml-6">Perfil Graciano</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setRole('leitor')}
                                            className={`py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all border-2 
                                                ${role === 'leitor'
                                                    ? 'bg-brand-primary border-brand-primary text-white shadow-lg'
                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-brand-primary/20'}`}
                                        >
                                            Leitor
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole('autor')}
                                            className={`py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all border-2 
                                                ${role === 'autor'
                                                    ? 'bg-brand-primary border-brand-primary text-white shadow-lg'
                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-brand-primary/20'}`}
                                        >
                                            Autor
                                        </button>
                                    </div>
                                </div>
                            )}

                            <m.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full py-7 bg-brand-dark text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.5em] hover:bg-brand-primary transition-all shadow-2xl shadow-brand-dark/20 flex items-center justify-center gap-4 group"
                                title={isLogin ? 'Entrar Agora' : 'Finalizar Registo'}
                                aria-label={isLogin ? 'Entrar Agora' : 'Finalizar Registo'}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>Processando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{isLogin ? 'Aceder à Casa' : 'Eternizar Membro'}</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </m.button>
                        </form>

                        <div className="text-center pt-10 border-t border-gray-50">
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] leading-loose">
                                {isLogin ? 'Ainda não faz parte da família?' : 'Já possui autorização de acesso?'}
                                <br />
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-brand-primary font-black mt-2 hover:scale-110 mb-[-4px] transition-transform inline-block border-b-2 border-brand-primary/20 hover:border-brand-primary pb-1"
                                    title={isLogin ? 'Mudar para Registo' : 'Mudar para Login'}
                                    aria-label={isLogin ? 'Mudar para Registo' : 'Mudar para Login'}
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signUp } from '../services/authService';
import { User, Mail, Lock, ArrowRight, BookOpen, Check, Loader2 } from 'lucide-react';

interface AuthPageProps {
    onLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const mounted = React.useRef(true);

    React.useEffect(() => {
        return () => { mounted.current = false; };
    }, []);

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

        try {
            // Timeout promise (15 seconds)
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('O pedido expirou. Verifique a sua conexão.')), 15000);
            });

            if (isLogin) {
                await Promise.race([
                    login(cleanEmail, password),
                    timeoutPromise
                ]);
                onLogin();
                navigate('/');
            } else {
                await Promise.race([
                    signUp(cleanEmail, password, cleanName),
                    timeoutPromise
                ]);
                onLogin();
                navigate('/');
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            setError(err.message || 'Ocorreu um erro ao processar o seu pedido.');
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

                        {error && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold animate-shake">
                                {error}
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

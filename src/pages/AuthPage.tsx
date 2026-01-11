import React, { useState } from 'react';
import { login, signUp } from '../services/authService';
import { User, Mail, Lock, ArrowRight, BookOpen, Check } from 'lucide-react';

interface AuthPageProps {
    onSuccess: (user: any) => void;
    onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBack }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const user = await login(email, password);
                onSuccess(user);
            } else {
                const user = await signUp(email, password, name);
                onSuccess(user);
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro ao processar o seu pedido.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-brand-light">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in relative">
                <div className="absolute top-8 left-8 z-20">
                    <button onClick={onBack} className="text-brand-dark/40 hover:text-brand-primary transition-colors flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
                        Voltar ao Início
                    </button>
                </div>

                {/* Left Side: Visual/Message */}
                <div className="md:w-1/2 bg-brand-dark p-16 flex flex-col justify-center relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 space-y-8">
                        <div className="w-16 h-16 bg-brand-primary/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-brand-primary">
                            <BookOpen className="w-8 h-8" />
                        </div>

                        <h1 className="text-5xl font-black tracking-tighter leading-none">
                            Seja Bem-vindo à <span className="text-brand-primary italic font-serif font-normal">Nossa Família</span>
                        </h1>

                        <p className="text-gray-400 text-lg font-medium leading-relaxed">
                            Crie uma conta para gerir os seus pedidos, guardar os seus livros favoritos e ter acesso a edições exclusivas da Editora Graça.
                        </p>

                        <ul className="space-y-4 pt-4">
                            <li className="flex items-center gap-3 text-sm font-bold text-white/80">
                                <div className="w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                Acompanhamento de pedidos em tempo real
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-white/80">
                                <div className="w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                Lista de desejos personalizada
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-white/80">
                                <div className="w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                Ofertas exclusivas para membros
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full space-y-10">
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
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">Nome Completo</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Ex: João Silva"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-brand-primary outline-none rounded-2xl transition-all font-medium text-brand-dark"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">Endereço de E-mail</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-brand-primary outline-none rounded-2xl transition-all font-medium text-brand-dark"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">Sua Senha</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-brand-primary outline-none rounded-2xl transition-all font-medium text-brand-dark"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-premium py-5 justify-center text-lg rounded-2xl shadow-xl shadow-brand-primary/20 disabled:opacity-50"
                            >
                                {loading ? 'Processando...' : isLogin ? 'Entrar Agora' : 'Finalizar Registo'}
                                <ArrowRight className="w-6 h-6" />
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

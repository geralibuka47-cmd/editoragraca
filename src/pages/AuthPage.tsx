
import React, { useState } from 'react';
import { BookOpen, User as UserIcon, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { User, ViewState } from '../types';
import { login, signUp } from '../services/authService';

interface AuthPageProps {
    setUser: (user: User | null) => void;
    handleNavigate: (view: ViewState) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ setUser, handleNavigate }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const name = formData.get('name') as string;

        try {
            let loggedUser: User | null;
            if (isLogin) {
                loggedUser = await login(email, password);
            } else {
                loggedUser = await signUp(email, password, name);
            }

            if (loggedUser) {
                setUser(loggedUser);
                if (loggedUser.role === 'adm') handleNavigate('ADMIN');
                else if (loggedUser.role === 'autor') handleNavigate('AUTHOR_DASHBOARD');
                else handleNavigate('READER_DASHBOARD');
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            setError(err.message || "Erro na autenticação. Verifique os dados.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-brand-50 min-h-screen py-16 md:py-32 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white p-8 md:p-12 shadow-2xl rounded-[2.5rem] md:rounded-[3.5rem] border border-brand-100 animate-slide-up">
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-16 h-16 bg-brand-900 text-white rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl">
                        <BookOpen size={28} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">
                        {isLogin ? 'Bem-vindo de Volta' : 'Criar Conta'}
                    </h2>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.3em]">Editora Graça · Portal</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="group space-y-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase ml-4 group-focus-within:text-accent-gold transition-colors">Nome Completo</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-accent-gold transition-colors" />
                                <input required name="name" type="text" placeholder="Seu nome" className="w-full bg-brand-50 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-1 focus:ring-accent-gold focus:bg-white text-sm transition-all" />
                            </div>
                        </div>
                    )}

                    <div className="group space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase ml-4 group-focus-within:text-accent-gold transition-colors">E-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-accent-gold transition-colors" />
                            <input required name="email" type="email" placeholder="exemplo@email.ao" className="w-full bg-brand-50 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-1 focus:ring-accent-gold focus:bg-white text-sm transition-all" />
                        </div>
                    </div>

                    <div className="group space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase ml-4 group-focus-within:text-accent-gold transition-colors">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-accent-gold transition-colors" />
                            <input required name="password" type="password" placeholder="••••••••" className="w-full bg-brand-50 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-1 focus:ring-accent-gold focus:bg-white text-sm transition-all" />
                        </div>
                    </div>

                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full py-5 bg-brand-900 text-white font-bold uppercase text-[10px] tracking-widest rounded-2xl shadow-xl hover:bg-accent-gold transition-all mt-6 flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : (isLogin ? 'Iniciar Sessão' : 'Registar Conta')}
                        {!isLoading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                    </button>

                    <div className="pt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[10px] font-bold text-accent-gold uppercase tracking-widest hover:text-brand-900 transition-colors"
                        >
                            {isLogin ? 'Não tem conta? Registe-se' : 'Já tem conta? Entre aqui'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;

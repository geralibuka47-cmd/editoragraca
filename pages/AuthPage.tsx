
import React from 'react';
import { BookOpen } from 'lucide-react';
import { User, ViewState } from '../types';

interface AuthPageProps {
    setUser: (user: User | null) => void;
    handleNavigate: (view: ViewState) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ setUser, handleNavigate }) => {
    return (
        <div className="bg-brand-50 min-h-screen py-16 md:py-32 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white p-10 md:p-16 shadow-2xl rounded-[2.5rem] md:rounded-[3rem] border border-brand-100 text-center animate-slide-up">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-900 text-white rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-8 md:mb-10 shadow-xl"><BookOpen size={32} /></div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-brand-900">Portal Graça</h2>
                <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-bold tracking-[0.3em] mb-8 md:mb-12">Malanje · Angola</p>
                <form className="space-y-5 md:space-y-6 text-left" onSubmit={(e) => {
                    e.preventDefault();
                    const email = (new FormData(e.currentTarget).get('email') as string).toLowerCase();
                    let role: User['role'] = 'leitor';
                    if (email.includes('admin')) role = 'adm';
                    else if (email.includes('autor')) role = 'autor';

                    const newUser: User = { id: Math.random().toString(), name: email.split('@')[0], email, role };
                    setUser(newUser);
                    if (role === 'adm') handleNavigate('ADMIN');
                    else if (role === 'autor') handleNavigate('AUTHOR_DASHBOARD');
                    else handleNavigate('READER_DASHBOARD');
                }}>
                    <div className="space-y-1">
                        <label className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase ml-4">E-mail</label>
                        <input required name="email" type="email" placeholder="nome@exemplo.ao" className="w-full bg-brand-50 p-4 md:p-5 rounded-2xl outline-none focus:ring-1 focus:ring-accent-gold text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase ml-4">Senha</label>
                        <input required type="password" placeholder="••••••••" className="w-full bg-brand-50 p-4 md:p-5 rounded-2xl outline-none focus:ring-1 focus:ring-accent-gold text-sm" />
                    </div>
                    <button type="submit" className="w-full py-5 md:py-6 bg-brand-900 text-white font-bold uppercase text-[9px] md:text-[10px] tracking-widest rounded-2xl shadow-xl hover:bg-accent-gold transition-all mt-6">Entrar</button>
                    <p className="text-[8px] text-gray-400 text-center mt-6">Dica: Use "admin@graça.ao" para Painel ADM.</p>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { resetPassword } from '../services/authService';
import { useToast } from '../components/Toast';
import SEO from '../components/SEO';
import { Button } from '../components/ui/Button';

const resetSchema = z.object({
    email: z.string().email('Introduza um e-mail válido'),
});

type ResetFormData = z.infer<typeof resetSchema>;

const ForgotPasswordPage: React.FC = () => {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<ResetFormData>({
        resolver: zodResolver(resetSchema)
    });

    const onSubmit = async (data: ResetFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            await resetPassword(data.email);
            setIsSuccess(true);
            showToast('E-mail de recuperação enviado!', 'success');
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro ao enviar o e-mail');
            showToast('Erro ao enviar e-mail', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#B78628] flex items-center justify-center p-4 md:p-10 selection:bg-[#B78628] selection:text-white font-sans overflow-hidden">
            <SEO title="Recuperar Senha" description="Recupere o acesso à sua conta na Editora Graça." />

            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] bg-[#0F172A] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-visible border border-white/5 flex flex-col max-h-[90vh]"
            >
                {/* ── Avatar/Icon Circle ────────────────────────────────────── */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#1E293B] rounded-full flex items-center justify-center shadow-lg border-4 border-[#0F172A] z-10">
                    <div className="relative">
                        <ShieldCheck className="w-12 h-12 text-[#B78628]" />
                    </div>
                </div>

                {/* Inner Scrollable Container */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 pt-16 custom-scrollbar">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Recuperar Senha</h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-loose">
                            Introduza o seu e-mail para receber as instruções de recuperação.
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <m.form
                                key="form"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">E-mail de Registo</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B78628] transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            {...register('email')}
                                            type="email"
                                            placeholder="exemplo@email.com"
                                            className="w-full bg-[#1E293B] border-none rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#B78628] transition-all outline-none"
                                        />
                                    </div>
                                    {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</p>}
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <p className="text-[10px] font-bold text-red-500 text-center uppercase tracking-widest">{error}</p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    className="w-full py-5 rounded-2xl bg-[#B78628] hover:bg-[#A37824] text-white text-sm font-black uppercase tracking-[0.3em] shadow-lg shadow-[#B78628]/20 transition-all active:scale-[0.98]"
                                >
                                    Enviar Link
                                </Button>
                            </m.form>
                        ) : (
                            <m.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-8 py-4"
                            >
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck className="w-10 h-10 text-green-500" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white">Verifique o seu e-mail</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        Enviámos um link de recuperação para o endereço indicado. Se não encontrar o e-mail, verifique a pasta de Spam.
                                    </p>
                                </div>
                                <Link
                                    to="/login"
                                    className="block w-full py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-sm font-black uppercase tracking-[0.3em] border border-white/5 transition-all text-center"
                                >
                                    Voltar ao Login
                                </Link>
                            </m.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#B78628] hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Voltar ao Login
                        </Link>
                    </div>

                    <div className="text-center mt-8">
                        <Link to="/" className="inline-flex px-6 py-3 bg-[#1E293B] hover:bg-[#2D3748] text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all border border-white/10 shadow-lg">
                            Voltar ao Início
                        </Link>
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

export default ForgotPasswordPage;

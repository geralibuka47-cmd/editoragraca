import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signUp } from '../services/authService';
import { User, Mail, Lock, ArrowRight, BookOpen, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import SEO from '../components/SEO';

const registerSchema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    role: z.enum(['leitor', 'autor']),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [success, setSuccess] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: 'leitor' }
    });

    const currentRole = watch('role');

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        setAuthError('');
        try {
            await signUp(data.email, data.password, data.name, data.role);
            setSuccess('Conta manifestada com sucesso! Verifique o seu e-mail para validar a sua entrada.');
            setTimeout(() => navigate('/login'), 5000);
        } catch (err: any) {
            setAuthError(err.message || 'Ocorreu um erro ao criar a conta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 md:p-12 relative overflow-hidden selection:bg-brand-primary selection:text-white">
            <SEO title="Criar Conta" description="Junte-se à família Editora Graça." />

            {/* Background Aesthetics */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(196,160,82,0.05)_0%,_transparent_40%)]"></div>

            <m.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-white relative z-10"
            >
                {/* Form Side */}
                <div className="p-10 md:p-24 flex flex-col justify-center order-2 lg:order-1">
                    <div className="max-w-md mx-auto w-full space-y-12">
                        <div className="space-y-4">
                            <span className="px-5 py-2 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-full">
                                Nova Jornada
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter uppercase leading-[0.9]">
                                Começar <br />
                                <span className="text-brand-primary">O Seu Legado</span>
                            </h2>
                        </div>

                        {success ? (
                            <m.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-10 bg-green-50 rounded-[3rem] border border-green-100 text-center space-y-6 shadow-xl shadow-green-500/5"
                            >
                                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                                    <Check className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-green-800 font-black text-lg">Inscrição Validada</p>
                                    <p className="text-green-600 text-sm font-medium">{success}</p>
                                </div>
                                <Button onClick={() => navigate('/login')} variant="secondary" className="w-full">Ir para Login Agora</Button>
                            </m.div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: 'leitor', icon: BookOpen, label: 'Leitor' },
                                        { id: 'autor', icon: Sparkles, label: 'Autor' }
                                    ].map(r => (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => setValue('role', r.id as any)}
                                            className={`p-6 rounded-3xl flex flex-col items-center gap-3 transition-all border-2 font-black text-[10px] uppercase tracking-widest ${currentRole === r.id
                                                    ? 'bg-brand-dark border-brand-dark text-white shadow-xl'
                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-brand-primary/20'
                                                }`}
                                        >
                                            <r.icon className={`w-6 h-6 ${currentRole === r.id ? 'text-brand-primary' : ''}`} />
                                            {r.label}
                                        </button>
                                    ))}
                                </div>

                                <Input
                                    id="name"
                                    label="Identidade Literária"
                                    placeholder="Seu nome completo"
                                    variant="light"
                                    icon={<User className="w-5 h-5" />}
                                    {...register('name')}
                                    error={errors.name?.message}
                                />

                                <Input
                                    id="email"
                                    type="email"
                                    label="Canal Digital (E-mail)"
                                    placeholder="seu@email.com"
                                    variant="light"
                                    icon={<Mail className="w-5 h-5" />}
                                    {...register('email')}
                                    error={errors.email?.message}
                                />

                                <Input
                                    id="password"
                                    type="password"
                                    label="Chave de Acesso"
                                    placeholder="••••••••"
                                    variant="light"
                                    icon={<Lock className="w-5 h-5" />}
                                    {...register('password')}
                                    error={errors.password?.message}
                                />

                                {authError && <p className="text-xs font-bold text-red-500 ml-4">⚠️ {authError}</p>}

                                <Button
                                    type="submit"
                                    isLoading={loading}
                                    className="w-full py-8 rounded-[2rem] text-[11px] tracking-[0.5em] shadow-xl shadow-brand-dark/10"
                                    rightIcon={!loading && <Check className="w-5 h-5" />}
                                >
                                    Eternizar Inscrição
                                </Button>
                            </form>
                        )}

                        {!success && (
                            <div className="pt-10 border-t border-gray-50 text-center">
                                <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em]">
                                    Já possui autorização? <br />
                                    <Link to="/login" className="text-brand-primary inline-block mt-2 hover:scale-110 transition-transform">Entrar na Casa</Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Visual Narrative */}
                <div className="hidden lg:flex bg-brand-light p-24 flex-col justify-between relative overflow-hidden order-1 lg:order-2">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1457131746774-1e3a12d753f4?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>

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
                            Ao registar-se, aceita os nossos protocolos de privacidade e termos de uso protocolar da Editora Graça.
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

import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Calculator, Check, ChevronRight, FileText, Send, Sparkles, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { createManuscript } from '../services/dataService';
import { useToast } from './Toast';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

// Validation Schema
const budgetSchema = z.object({
    serviceType: z.string().min(1, 'Selecione um serviço'),
    wordCount: z.coerce.number().min(0).optional(),
    pages: z.coerce.number().min(0).optional(),
    genre: z.string().min(1, 'Selecione um género'),
    extras: z.array(z.string()).default([]),
    name: z.string().min(2, 'Nome é obrigatório'),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    phone: z.string().min(9, 'Telefone inválido'),
}).refine(data => data.email || data.phone, {
    message: "Forneça pelo menos um contato (Email ou Telefone)",
    path: ["email"]
});

type BudgetFormData = z.infer<typeof budgetSchema>;

const steps: { number: number; title: string; fields: (keyof BudgetFormData)[] }[] = [
    { number: 1, title: 'Serviço', fields: ['serviceType'] },
    { number: 2, title: 'Detalhes', fields: ['pages', 'wordCount', 'genre'] },
    { number: 3, title: 'Extras', fields: ['extras'] },
    { number: 4, title: 'Finalizar', fields: ['name', 'email', 'phone'] }
];

const BudgetGenerator: React.FC = () => {
    const { showToast } = useToast();
    const [step, setStep] = useState(1);
    const [estimatedPrice, setEstimatedPrice] = useState<{ min: number; max: number } | null>(null);

    // Allowing useForm to infer the type from the resolver to avoid mismatch
    const { register, handleSubmit, control, watch, trigger, formState: { errors, isSubmitting }, reset, setValue } = useForm<BudgetFormData>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            serviceType: 'revisao',
            extras: [],
            pages: 0,
            wordCount: 0,
            genre: '',
            name: '',
            email: '',
            phone: ''
        }
    });

    const formData = watch();

    const calculateEstimate = () => {
        let min = 0;
        let max = 0;

        // Pricing Rules
        const PRICE_PER_PAGE_LOW = 250; // <= 250 pages
        const PRICE_PER_PAGE_HIGH = 200; // > 250 pages

        const getPagePrice = (pages: number) => {
            return pages > 250 ? PRICE_PER_PAGE_HIGH : PRICE_PER_PAGE_LOW;
        };

        const pages = formData.pages || (formData.wordCount ? Math.ceil(formData.wordCount / 250) : 0);
        const rate = getPagePrice(pages);

        // Base price per service
        if (formData.serviceType === 'revisao') {
            const baseCost = pages * rate;
            min += baseCost;
            max += baseCost * 1.1; // 10% margin
        } else if (formData.serviceType === 'diagramacao') {
            const baseCost = pages * rate;
            min += baseCost;
            max += baseCost * 1.1;
        } else if (formData.serviceType === 'completo') {
            // Revisão + Diagramação
            const editorialCost = (pages * rate) * 2;
            // Fixed costs
            const fixedCosts = 10000 + 6000 + 6000; // Capa + ISBN + Depósito

            min += editorialCost + fixedCosts;
            max += (editorialCost + fixedCosts) * 1.15;
        }

        // Extras
        const extras = formData.extras || [];
        if (extras.includes('capa')) { min += 10000; max += 15000; }
        if (extras.includes('isbn')) { min += 6000; max += 6000; }
        if (extras.includes('deposito')) { min += 6000; max += 6000; }
        if (extras.includes('ebook')) { min += 7500; max += 7500; }
        if (extras.includes('marketing')) { min += 5000; max += 5000; }

        setEstimatedPrice({ min, max });
    };

    useEffect(() => {
        calculateEstimate();
    }, [formData.serviceType, formData.pages, formData.wordCount, formData.extras]);

    const handleNext = async () => {
        const fieldsToValidate = steps[step - 1].fields;
        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid && step < 4) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const onSubmit: SubmitHandler<BudgetFormData> = async (data) => {
        try {
            await createManuscript({
                title: `Pedido de Orçamento: ${data.serviceType.toUpperCase()}`,
                authorName: data.name,
                email: data.email || 'N/A',
                genre: data.genre,
                description: `Serviço: ${data.serviceType}, Páginas: ${data.pages}, Palavras: ${data.wordCount}, Tel: ${data.phone}, Extras: ${data.extras?.join(', ')}`,
                fileUrl: '',
                fileName: 'Formulário Online',
                authorId: 'guest',
                status: 'pending'
            });
            showToast('Pedido enviado com sucesso! Entraremos em contacto.', 'success');
            setStep(1);
            reset();
        } catch (error) {
            console.error(error);
            showToast('Erro ao enviar pedido. Tente novamente.', 'error');
        }
    };
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 max-w-4xl mx-auto">
            <div className="bg-brand-dark p-8 md:p-10 text-white flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">Simulador de Investimento</h3>
                    <p className="text-gray-400 font-medium text-sm">Obtenha uma previsão instantânea para a sua obra.</p>
                </div>
                <div className="bg-brand-primary w-24 h-24 rounded-full blur-3xl absolute -right-4 -top-4 opacity-30"></div>
                <Calculator className="w-12 h-12 text-brand-primary relative z-10" />
            </div>

            <div className="p-8 md:p-12">
                {/* Steps Indicator */}
                <div className="flex items-center justify-between mb-12 relative px-4">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0 -translate-y-1/2 rounded-full"></div>
                    {steps.map((s) => (
                        <div key={s.number} className={`relative z-10 flex flex-col items-center gap-2 transition-colors ${step >= s.number ? 'text-brand-primary' : 'text-gray-300'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= s.number ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-110' : 'bg-white border-2 border-gray-200'}`}>
                                {step > s.number ? <Check className="w-5 h-5" /> : s.number}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest hidden md:block bg-white px-2">{s.title}</span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <m.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid md:grid-cols-3 gap-6"
                            >
                                <Controller
                                    name="serviceType"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            {[
                                                { id: 'revisao', title: 'Revisão & Edição', desc: 'Correção completa e aprimoramento textual.' },
                                                { id: 'diagramacao', title: 'Diagramação', desc: 'Layout profissional para impressão.' },
                                                { id: 'completo', title: 'Publicação Completa', desc: 'Do manuscrito ao livro impresso.' }
                                            ].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => field.onChange(opt.id)}
                                                    className={`p-6 rounded-2xl border-2 text-left transition-all ${field.value === opt.id ? 'border-brand-primary bg-brand-primary/5 shadow-xl ring-1 ring-brand-primary' : 'border-gray-100 hover:border-brand-primary/30'}`}
                                                >
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${field.value === opt.id ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                        <Sparkles className="w-5 h-5" />
                                                    </div>
                                                    <h4 className="font-bold text-brand-dark mb-2">{opt.title}</h4>
                                                    <p className="text-sm text-gray-500 leading-relaxed">{opt.desc}</p>
                                                </button>
                                            ))}
                                        </>
                                    )}
                                />
                            </m.div>
                        )}

                        {step === 2 && (
                            <m.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="grid md:grid-cols-2 gap-8">
                                    <Input
                                        type="number"
                                        label="Número de Páginas (Aprox.)"
                                        placeholder="Ex: 150"
                                        {...register('pages')}
                                        error={errors.pages?.message}
                                        className="text-xl font-bold"
                                    />
                                    <Input
                                        type="number"
                                        label="Contagem de Palavras (Opcional)"
                                        placeholder="Ex: 45000"
                                        {...register('wordCount')}
                                        error={errors.wordCount?.message}
                                        className="text-xl font-bold"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold uppercase tracking-widest text-gray-500">Género Literário</label>
                                    <select
                                        {...register('genre')}
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-brand-primary outline-none font-medium text-brand-dark"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Romance">Romance</option>
                                        <option value="Poesia">Poesia</option>
                                        <option value="Técnico/Académico">Técnico/Académico</option>
                                        <option value="Biografia">Biografia</option>
                                        <option value="Infantil">Infantil</option>
                                    </select>
                                    {errors.genre && <span className="text-red-500 text-xs font-bold">{errors.genre.message}</span>}
                                </div>
                            </m.div>
                        )}

                        {step === 3 && (
                            <m.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid md:grid-cols-2 gap-4"
                            >
                                <Controller
                                    name="extras"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            {[
                                                { id: 'capa', title: 'Design de Capa (Físico)', price: '+ 10.000 Kz' },
                                                { id: 'ebook', title: 'Capa E-book', price: '+ 7.500 Kz' },
                                                { id: 'isbn', title: 'Registo ISBN', price: '+ 6.000 Kz' },
                                                { id: 'deposito', title: 'Depósito Legal', price: '+ 6.000 Kz' },
                                                { id: 'marketing', title: 'Post Publicitário', price: '+ 5.000 Kz' }
                                            ].map((extra) => (
                                                <label key={extra.id} className={`flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${field.value.includes(extra.id) ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                                                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${field.value.includes(extra.id) ? 'bg-brand-primary border-brand-primary text-white' : 'border-gray-300'}`}>
                                                        {field.value.includes(extra.id) && <Check className="w-4 h-4" />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={field.value.includes(extra.id)}
                                                        onChange={() => {
                                                            const newExtras = field.value.includes(extra.id)
                                                                ? field.value.filter(e => e !== extra.id)
                                                                : [...field.value, extra.id];
                                                            field.onChange(newExtras);
                                                        }}
                                                    />
                                                    <div>
                                                        <p className="font-bold text-brand-dark">{extra.title}</p>
                                                        <p className="text-sm text-brand-primary font-bold">{extra.price}</p>
                                                    </div>
                                                </label>
                                            ))}
                                        </>
                                    )}
                                />
                            </m.div>
                        )}

                        {step === 4 && (
                            <m.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="bg-gradient-to-br from-brand-dark to-gray-900 rounded-3xl p-8 text-white text-center">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Investimento Estimado</p>
                                    <div className="text-4xl md:text-5xl font-black text-brand-primary mb-2">
                                        {estimatedPrice ? `${formatCurrency(estimatedPrice.min)} - ${formatCurrency(estimatedPrice.max)}` : 'Calculando...'}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-4">*Valores indicativos. Sujeito a análise detalhada do original.</p>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold text-brand-dark flex items-center gap-2">
                                        <User className="w-5 h-5 text-brand-primary" />
                                        Seus Dados para Contato
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Nome Completo"
                                            {...register('name')}
                                            error={errors.name?.message}
                                        />
                                        <Input
                                            type="tel"
                                            placeholder="WhatsApp / Telefone"
                                            {...register('phone')}
                                            error={errors.phone?.message}
                                        />
                                        <div className="col-span-2">
                                            <Input
                                                type="email"
                                                placeholder="Email"
                                                {...register('email')}
                                                error={errors.email?.message}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleBack}
                            disabled={step === 1}
                            leftIcon={<ArrowLeft className="w-4 h-4" />}
                            className={step === 1 ? 'opacity-50' : ''}
                        >
                            Voltar
                        </Button>

                        {step < 4 ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                                rightIcon={<ChevronRight className="w-4 h-4" />}
                            >
                                Próximo
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                                rightIcon={!isSubmitting && <Send className="w-4 h-4" />}
                            >
                                Receber Proposta Formal
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BudgetGenerator;

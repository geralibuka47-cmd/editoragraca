import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CartItem } from '../types';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { motion as m, AnimatePresence } from 'framer-motion';

// Validation Schema
const checkoutSchema = z.object({
    name: z.string().min(2, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(9, 'Telefone inválido'),
    address: z.string().min(5, 'Endereço é obrigatório'),
    city: z.string().min(2, 'Cidade é obrigatória'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutPageProps {
    cart: CartItem[];
    onUpdateQuantity: (bookId: string, newQuantity: number) => void;
    onRemoveItem: (id: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onUpdateQuantity, onRemoveItem }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'cart' | 'details' | 'success'>('cart');
    const stepperWidth = step === 'cart' ? 'w-0' : step === 'details' ? 'w-1/2' : 'w-full';
    const step1Style = step === 'cart' ? 'bg-brand-primary text-white scale-110 shadow-lg' : 'bg-brand-primary text-white';
    const step2Style = step === 'details' ? 'bg-brand-primary text-white scale-110 shadow-lg' : step === 'success' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-500';
    const step3Style = step === 'success' ? 'bg-brand-primary text-white scale-110 shadow-lg' : 'bg-gray-200 text-gray-500';
    const [orderError, setOrderError] = useState('');
    const [confirmedOrder, setConfirmedOrder] = useState<{ name: string; email: string; orderNumber: string; total: number } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            city: 'Malanje',
        },
    });

    const total = cart.reduce((sum, item) => sum + ((Number(item.price) || 0) * item.quantity), 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setStep('details');
    };

    const onSubmit = async (data: CheckoutFormData) => {
        setOrderError('');

        try {
            const { createOrder } = await import('../services/dataService');

            const result = await createOrder({
                customerName: data.name.trim(),
                customerEmail: data.email.trim(),
                items: cart.map(item => ({
                    bookId: item.id,
                    title: item.title,
                    quantity: item.quantity,
                    price: Number(item.price) || 0,
                    authorId: item.authorId
                })),
                total: total,
                status: 'Pendente',
                date: new Date().toISOString()
            });

            setConfirmedOrder({
                name: data.name,
                email: data.email,
                orderNumber: result.orderNumber,
                total: total
            });
            setStep('success');
        } catch (error: any) {
            console.error('Erro ao criar pedido:', error);
            setOrderError(error.message || 'Ocorreu um erro ao processar o seu pedido. Por favor, tente novamente.');
        }
    };

    // Cart View
    if (step === 'cart') {
        return (
            <div className="min-h-screen bg-brand-light py-8 md:py-16">
                <div className="h-20 md:h-24 bg-brand-light"></div>

                <div className="container mx-auto px-4 md:px-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-brand-dark hover:text-brand-primary transition-colors mb-6 md:mb-8 font-bold text-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Continuar Comprando
                    </button>

                    <h1 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter mb-8 md:mb-12">
                        Carrinho de Compras
                    </h1>

                    {/* Stepper */}
                    <div className="flex items-center justify-between max-w-2xl mx-auto mb-12 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
                        <div className={`stepper-line ${stepperWidth}`}></div>

                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${step1Style}`}>
                                1
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Carrinho</span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${step2Style}`}>
                                2
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Detalhes</span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${step3Style}`}>
                                3
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Sucesso</span>
                        </div>
                    </div>

                    {cart.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
                            <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-brand-dark mb-4">Carrinho Vazio</h2>
                            <p className="text-gray-600 mb-8">Adicione livros ao carrinho para finalizar a compra.</p>
                            <button onClick={() => navigate('/livros')} className="btn-premium">
                                Explorar Catálogo
                            </button>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="bg-white rounded-2xl shadow-md p-4 md:p-6 flex gap-4 md:gap-6 hover:shadow-lg transition-all relative">
                                        <img
                                            src={item.coverUrl}
                                            alt={item.title}
                                            className="w-20 h-28 md:w-24 md:h-32 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-base md:text-lg text-brand-dark mb-1 truncate pr-8">{item.title}</h3>
                                            <p className="text-xs md:text-sm text-gray-600 mb-4 truncate">{item.author}</p>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 w-fit">
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-brand-primary hover:text-white rounded transition-all"
                                                        title="Diminuir"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-brand-primary hover:text-white rounded transition-all"
                                                        title="Aumentar"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-brand-primary text-sm md:text-base">{((Number(item.price) || 0) * item.quantity).toLocaleString()} Kz</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onRemoveItem(item.id)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors p-2"
                                            title="Remover"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 sticky top-24">
                                    <h2 className="text-xl md:text-2xl font-black text-brand-dark mb-6">Resumo do Pedido</h2>

                                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'itens'})</span>
                                            <span>{total.toLocaleString()} Kz</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Entrega</span>
                                            <span className="text-green-600 font-bold">Grátis</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-lg md:text-xl font-black text-brand-dark mb-8">
                                        <span>Total</span>
                                        <span>{total.toLocaleString()} Kz</span>
                                    </div>

                                    <Button onClick={handleCheckout} className="w-full py-4 uppercase tracking-widest text-xs">
                                        Finalizar Compra
                                    </Button>

                                    <p className="text-[10px] text-gray-500 text-center mt-4">
                                        Pagamento via transferência bancária
                                    </p>
                                </div>
                            </div>

                            {/* Mobile Sticky Bar */}
                            <div className="mobile-cart-sticky">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total</span>
                                    <span className="font-black text-brand-dark">{total.toLocaleString()} Kz</span>
                                </div>
                                <Button onClick={handleCheckout} className="px-8 py-3 text-[10px]">
                                    Finalizar
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Customer Details View
    if (step === 'details') {
        return (
            <div className="min-h-screen bg-brand-light py-8 md:py-16">
                <div className="h-20 md:h-24 bg-brand-light"></div>

                <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                    <button
                        onClick={() => setStep('cart')}
                        className="flex items-center gap-2 text-brand-dark hover:text-brand-primary transition-colors mb-6 md:mb-8 font-bold text-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Voltar ao Carrinho
                    </button>

                    <h1 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter mb-8 md:mb-12">
                        Finalizar Pedido
                    </h1>

                    {/* Stepper */}
                    <div className="flex items-center justify-between max-w-2xl mx-auto mb-12 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
                        <div className="stepper-line w-1/2"></div>

                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-black text-sm shadow-sm ring-4 ring-white">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Carrinho</span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-black text-sm scale-110 shadow-lg ring-4 ring-white">
                                2
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Detalhes</span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-black text-sm ring-4 ring-white">
                                3
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Sucesso</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Customer Form */}
                        <div className="md:col-span-2 bg-white rounded-3xl shadow-xl p-8">
                            <h2 className="text-2xl font-black text-brand-dark mb-6">Dados do Cliente</h2>

                            {orderError && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold mb-6 animate-pulse">
                                    {orderError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <Input
                                    variant="light"
                                    label="Nome Completo *"
                                    placeholder="Ex: João Ferreira"
                                    {...register('name')}
                                    error={errors.name?.message}
                                />

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        variant="light"
                                        label="Endereço de Email (Opcional)"
                                        type="email"
                                        placeholder="Para receber o comprovativo"
                                        {...register('email')}
                                        error={errors.email?.message}
                                    />
                                    <Input
                                        variant="light"
                                        label="WhatsApp / Telefone *"
                                        placeholder="Seu contacto"
                                        {...register('phone')}
                                        error={errors.phone?.message}
                                    />
                                </div>

                                <Input
                                    variant="light"
                                    label="Morada de Entrega *"
                                    placeholder="Rua, Bairro, Nº da Casa"
                                    {...register('address')}
                                    error={errors.address?.message}
                                />

                                <Select
                                    variant="light"
                                    label="Cidade"
                                    options={[
                                        { value: 'Malanje', label: 'Malanje' },
                                        { value: 'Luanda', label: 'Luanda' },
                                        { value: 'Benguela', label: 'Benguela' },
                                        { value: 'Huambo', label: 'Huambo' },
                                        { value: 'Lobito', label: 'Lobito' },
                                        { value: 'Outra', label: 'Outra' },
                                    ]}
                                    {...register('city')}
                                    error={errors.city?.message}
                                />

                                <div className="bg-brand-primary/10 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <CreditCard className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-bold text-brand-dark mb-2">Método de Pagamento</h3>
                                            <p className="text-sm text-gray-700 mb-3">
                                                Transferência Bancária - Envie o comprovativo via WhatsApp após efetuar o pagamento.
                                            </p>
                                            <div className="text-xs space-y-1 text-gray-600">
                                                <p><strong>Millennium Atlântico:</strong> 014494866210001</p>
                                                <p><strong>BFA:</strong> 30781525130001</p>
                                                <p><strong>Kwik/Paypay:</strong> IBAN AO06042000000000019461253</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    className="w-full py-5 text-lg mt-6"
                                >
                                    Confirmar Pedido
                                </Button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                <h3 className="font-bold text-brand-dark mb-4 text-sm uppercase tracking-widest">Resumo</h3>
                                <div className="space-y-3 text-sm">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex justify-between text-gray-600 gap-4">
                                            <span className="truncate">{item.title} × {item.quantity}</span>
                                            <span className="shrink-0">{((Number(item.price) || 0) * item.quantity).toLocaleString()} Kz</span>
                                        </div>
                                    ))}
                                    <div className="border-t pt-3 flex justify-between font-black text-brand-dark text-base">
                                        <span>Total</span>
                                        <span>{total.toLocaleString()} Kz</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success View
    return (
        <div className="min-h-screen bg-brand-light py-12 md:py-16 flex flex-col items-center">
            <div className="h-20 md:h-24 bg-brand-light"></div>

            <div className="container mx-auto px-4 md:px-8 max-w-2xl text-center">
                <m.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
                >
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">Pedido Confirmado!</h1>
                    <div className="bg-brand-primary/10 rounded-xl py-2 px-4 w-fit mx-auto mb-6">
                        <span className="text-brand-primary font-black uppercase tracking-widest text-xs">Aguardando Pagamento</span>
                    </div>

                    <p className="text-base md:text-lg text-gray-600 mb-2">
                        Obrigado pela sua compra, <strong>{confirmedOrder?.name}</strong>!
                    </p>
                    <p className="text-gray-500 mb-8">
                        Seu pedido <strong className="text-brand-dark">{confirmedOrder?.orderNumber}</strong> foi registado.
                    </p>

                    <div className="bg-brand-light rounded-[2rem] p-6 md:p-8 mb-8 text-left border-2 border-dashed border-gray-200">
                        <h2 className="font-black text-brand-dark mb-6 text-sm uppercase tracking-widest flex items-center gap-3">
                            <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                            Processo de Finalização
                        </h2>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm border border-gray-100">1</div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-brand-dark">Efectue a transferência</p>
                                    <p className="text-xs text-gray-500">Valor total: <strong>{confirmedOrder?.total.toLocaleString()} Kz</strong></p>
                                    <div className="pt-2 space-y-1 text-[10px] text-gray-600">
                                        <p><strong>ATLÂNTICO:</strong> 014494866210001</p>
                                        <p><strong>BFA:</strong> 30781525130001</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm border border-gray-100">2</div>
                                <div className="space-y-3 flex-1">
                                    <p className="text-sm font-bold text-brand-dark">Envie o Comprovativo</p>
                                    <p className="text-xs text-gray-500">Para agilizar a entrega, clique no botão abaixo para nos enviar o print/comprovativo via WhatsApp.</p>

                                    <button
                                        onClick={() => {
                                            const message = `Olá Editora Graça! Acabei de fazer um pedido.\n\n*Pedido:* ${confirmedOrder?.orderNumber}\n*Cliente:* ${confirmedOrder?.name}\n*Total:* ${confirmedOrder?.total.toLocaleString()} Kz\n\nSegue em anexo o comprovativo de pagamento.`;
                                            window.open(`https://wa.me/244973038386?text=${encodeURIComponent(message)}`, '_blank');
                                        }}
                                        className="w-full py-4 bg-[#25D366] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#25D366]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        Enviar via WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => navigate('/')} className="px-8 py-4 bg-brand-dark text-white font-black rounded-xl hover:bg-brand-primary transition-all uppercase text-[10px] tracking-widest">
                            Voltar ao Início
                        </button>
                        <button
                            onClick={() => navigate('/livros')}
                            className="px-8 py-4 border-2 border-brand-dark text-brand-dark font-black rounded-xl hover:bg-brand-dark hover:text-white transition-all uppercase text-[10px] tracking-widest"
                        >
                            Ver Catálogo
                        </button>
                    </div>
                </m.div>
            </div>
        </div>
    );
};

export default CheckoutPage;

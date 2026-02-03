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
    const [orderError, setOrderError] = useState('');
    const [confirmedCustomer, setConfirmedCustomer] = useState<{ name: string; email: string } | null>(null);

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

            await createOrder({
                customerName: data.name.trim(),
                customerEmail: data.email.trim(),
                items: cart.map(item => ({
                    title: item.title,
                    quantity: item.quantity,
                    price: Number(item.price) || 0,
                    authorId: item.authorId
                })),
                total: total,
                status: 'Pendente',
                date: new Date().toISOString()
            });

            setConfirmedCustomer({ name: data.name, email: data.email });
            setStep('success');
        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            setOrderError('Ocorreu um erro ao processar o seu pedido. Por favor, tente novamente.');
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
                                    label="Nome Completo *"
                                    placeholder="Ex: João Ferreira"
                                    {...register('name')}
                                    error={errors.name?.message}
                                />

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        type="email"
                                        label="Email *"
                                        placeholder="seu@email.com"
                                        {...register('email')}
                                        error={errors.email?.message}
                                    />
                                    <Input
                                        type="tel"
                                        label="Telefone *"
                                        placeholder="Ex: 923 000 000"
                                        {...register('phone')}
                                        error={errors.phone?.message}
                                    />
                                </div>

                                <Input
                                    label="Endereço de Entrega *"
                                    placeholder="Rua, Bairro, Número"
                                    {...register('address')}
                                    error={errors.address?.message}
                                />

                                <Select
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
                                    className="w-full py-5 text-lg"
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
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-fade-in">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">Pedido Confirmado!</h1>
                    <p className="text-base md:text-lg text-gray-600 mb-8">
                        Obrigado pela sua compra, <strong>{confirmedCustomer?.name}</strong>!<br />
                        Enviámos os detalhes para <strong>{confirmedCustomer?.email}</strong>.
                    </p>

                    <div className="bg-brand-primary/10 rounded-2xl p-6 mb-8 text-left">
                        <h2 className="font-bold text-brand-dark mb-3 text-sm uppercase tracking-widest">Próximos Passos:</h2>
                        <ol className="space-y-3 text-xs md:text-sm text-gray-700">
                            <li className="flex gap-3">
                                <span className="font-bold text-brand-primary">1.</span>
                                <span>Efectue a transferência bancária para uma das contas.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-brand-primary">2.</span>
                                <span>Envie o comprovativo via WhatsApp: +244 973 038 386</span>
                            </li>
                        </ol>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => navigate('/')} className="btn-premium py-4">
                            Voltar ao Início
                        </button>
                        <button
                            onClick={() => navigate('/livros')}
                            className="px-8 py-4 border-2 border-brand-dark text-brand-dark font-bold rounded-lg hover:bg-brand-dark hover:text-white transition-all uppercase text-xs tracking-wider"
                        >
                            Ver Catálogo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;

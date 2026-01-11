import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { ViewState, CartItem } from '../types';

interface CheckoutPageProps {
    cart: CartItem[];
    onUpdateQuantity: (bookId: string, newQuantity: number) => void;
    onRemoveItem: (bookId: string) => void;
    onNavigate: (view: ViewState) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onUpdateQuantity, onRemoveItem, onNavigate }) => {
    const [step, setStep] = useState<'cart' | 'details' | 'success'>('cart');
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: 'Malanje'
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const validateCustomerInfo = () => {
        const newErrors: Record<string, string> = {};

        if (!customerInfo.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!customerInfo.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
            newErrors.email = 'Email inválido';
        }
        if (!customerInfo.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
        if (!customerInfo.address.trim()) newErrors.address = 'Endereço é obrigatório';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setStep('details');
    };

    const handleConfirmOrder = () => {
        if (!validateCustomerInfo()) return;

        // Simulate order creation
        console.log('Order placed:', { customer: customerInfo, items: cart, total });

        // Clear cart (would be handled by parent component in real app)
        setStep('success');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Cart View
    if (step === 'cart') {
        return (
            <div className="min-h-screen bg-brand-light py-16">
                <div className="container mx-auto px-8">
                    <button
                        onClick={() => onNavigate('HOME')}
                        className="flex items-center gap-2 text-brand-dark hover:text-brand-primary transition-colors mb-8 font-bold"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Continuar Comprando
                    </button>

                    <h1 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter mb-12">
                        Carrinho de Compras
                    </h1>

                    {cart.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
                            <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-brand-dark mb-4">Carrinho Vazio</h2>
                            <p className="text-gray-600 mb-8">Adicione livros ao carrinho para finalizar a compra.</p>
                            <button onClick={() => onNavigate('CATALOG')} className="btn-premium">
                                Explorar Catálogo
                            </button>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="bg-white rounded-2xl shadow-md p-6 flex gap-6 hover:shadow-lg transition-all">
                                        <img
                                            src={item.coverUrl}
                                            alt={item.title}
                                            className="w-24 h-32 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-brand-dark mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-600 mb-4">{item.author}</p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-brand-primary hover:text-white rounded transition-all"
                                                        title="Diminuir quantidade"
                                                        aria-label="Diminuir quantidade"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-brand-primary hover:text-white rounded transition-all"
                                                        title="Aumentar quantidade"
                                                        aria-label="Aumentar quantidade"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-brand-primary">{(item.price * item.quantity).toLocaleString()} Kz</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onRemoveItem(item.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors p-2"
                                            title="Remover do carrinho"
                                            aria-label="Remover item do carrinho"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                                    <h2 className="text-2xl font-black text-brand-dark mb-6">Resumo do Pedido</h2>

                                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'itens'})</span>
                                            <span>{total.toLocaleString()} Kz</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Entrega</span>
                                            <span className="text-green-600 font-bold">Grátis</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-xl font-black text-brand-dark mb-8">
                                        <span>Total</span>
                                        <span>{total.toLocaleString()} Kz</span>
                                    </div>

                                    <button onClick={handleCheckout} className="w-full btn-premium justify-center">
                                        Finalizar Compra
                                    </button>

                                    <p className="text-xs text-gray-500 text-center mt-4">
                                        Pagamento seguro via transferência bancária
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
            <div className="min-h-screen bg-brand-light py-16">
                <div className="container mx-auto px-8 max-w-4xl">
                    <button
                        onClick={() => setStep('cart')}
                        className="flex items-center gap-2 text-brand-dark hover:text-brand-primary transition-colors mb-8 font-bold"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Voltar ao Carrinho
                    </button>

                    <h1 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter mb-12">
                        Finalizar Pedido
                    </h1>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Customer Form */}
                        <div className="md:col-span-2 bg-white rounded-3xl shadow-xl p-8">
                            <h2 className="text-2xl font-black text-brand-dark mb-6">Dados do Cliente</h2>

                            <form onSubmit={(e) => { e.preventDefault(); handleConfirmOrder(); }} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                        Nome Completo *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={customerInfo.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary/10'
                                            }`}
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={customerInfo.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary/10'
                                                }`}
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                            Telefone *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={customerInfo.phone}
                                            onChange={handleChange}
                                            placeholder="+244 XXX XXX XXX"
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary/10'
                                                }`}
                                        />
                                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                        Endereço de Entrega *
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={customerInfo.address}
                                        onChange={handleChange}
                                        placeholder="Rua, Bairro, Número"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.address ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary/10'
                                            }`}
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                </div>

                                <div>
                                    <label htmlFor="city" className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                        Cidade
                                    </label>
                                    <select
                                        id="city"
                                        name="city"
                                        value={customerInfo.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-brand-primary focus:ring-brand-primary/10"
                                    >
                                        <option value="Malanje">Malanje</option>
                                        <option value="Luanda">Luanda</option>
                                        <option value="Benguela">Benguela</option>
                                        <option value="Huambo">Huambo</option>
                                        <option value="Lobito">Lobito</option>
                                        <option value="Outra">Outra</option>
                                    </select>
                                </div>

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

                                <button type="submit" className="w-full btn-premium justify-center text-lg">
                                    Confirmar Pedido
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                <h3 className="font-bold text-brand-dark mb-4">Resumo</h3>
                                <div className="space-y-3 text-sm">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex justify-between text-gray-600">
                                            <span>{item.title} × {item.quantity}</span>
                                            <span>{(item.price * item.quantity).toLocaleString()} Kz</span>
                                        </div>
                                    ))}
                                    <div className="border-t pt-3 flex justify-between font-bold text-brand-dark text-base">
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
        <div className="min-h-screen bg-brand-light py-16 flex items-center">
            <div className="container mx-auto px-8 max-w-2xl text-center">
                <div className="bg-white rounded-3xl shadow-2xl p-12 animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    <h1 className="text-4xl font-black text-brand-dark mb-4">Pedido Confirmado!</h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Obrigado pela sua compra, <strong>{customerInfo.name}</strong>!<br />
                        Enviámos os detalhes do pedido para <strong>{customerInfo.email}</strong>.
                    </p>

                    <div className="bg-brand-primary/10 rounded-xl p-6 mb-8 text-left">
                        <h2 className="font-bold text-brand-dark mb-3">Próximos Passos:</h2>
                        <ol className="space-y-2 text-sm text-gray-700">
                            <li className="flex gap-3">
                                <span className="font-bold text-brand-primary">1.</span>
                                <span>Efectue a transferência bancária para uma das contas indicadas.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-brand-primary">2.</span>
                                <span>Envie o comprovativo via WhatsApp: +244 973 038 386</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-brand-primary">3.</span>
                                <span>Aguarde a confirmação e preparação do seu pedido.</span>
                            </li>
                        </ol>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => onNavigate('HOME')} className="btn-premium">
                            Voltar ao Início
                        </button>
                        <button
                            onClick={() => onNavigate('CATALOG')}
                            className="px-8 py-3 border-2 border-brand-dark text-brand-dark font-bold rounded-lg hover:bg-brand-dark hover:text-white transition-all uppercase text-sm tracking-wider"
                        >
                            Continuar Comprando
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;

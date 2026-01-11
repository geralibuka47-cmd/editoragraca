
import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    handleCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
    isOpen,
    onClose,
    cart,
    setCart,
    handleCheckout
}) => {
    if (!isOpen) return null;

    const total = cart.reduce((acc, c) => acc + (c.price * c.quantity), 0);

    return (
        <div className="fixed inset-0 z-[800] flex justify-end">
            <div className="absolute inset-0 bg-brand-900/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white h-full p-8 md:p-12 shadow-2xl animate-slide-in-right flex flex-col">
                <div className="flex justify-between items-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold">Carrinho</h2>
                    <button
                        onClick={onClose}
                        title="Fechar carrinho"
                        aria-label="Fechar carrinho"
                    >
                        <X size={32} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-6 md:space-y-8 no-scrollbar">
                    {cart.map(i => (
                        <div key={i.id} className="flex gap-4 md:gap-6 items-center">
                            <img src={i.coverUrl} className="w-16 h-24 md:w-20 md:h-28 object-cover rounded shadow-md" alt={i.title} />
                            <div className="flex-1">
                                <p className="font-serif font-bold text-lg md:text-xl leading-tight">{i.title}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{i.quantity} x {i.price.toLocaleString()} Kz</p>
                            </div>
                            <button
                                onClick={() => setCart(cart.filter(x => x.id !== i.id))}
                                className="text-gray-200 hover:text-red-500 p-2"
                                title="Remover item do carrinho"
                                aria-label="Remover item do carrinho"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                    {cart.length === 0 && <p className="text-center py-20 text-gray-300 italic font-serif">O carrinho está vazio.</p>}
                </div>
                {cart.length > 0 && (
                    <div className="pt-8 border-t border-brand-50 mt-6 md:mt-10 space-y-6 md:space-y-8">
                        <div className="flex justify-between items-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subtotal</p>
                            <p className="text-3xl md:text-4xl font-serif font-bold">{total.toLocaleString()} Kz</p>
                        </div>
                        <button onClick={handleCheckout} className="w-full py-5 md:py-6 bg-brand-900 text-white font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-accent-gold transition-all">Finalizar Encomenda</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;

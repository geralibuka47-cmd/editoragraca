
import React from 'react';
import { FileText, Loader2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { CartItem } from '../types';

interface CheckoutPageProps {
    cart: CartItem[];
    checkoutStep: number;
    setCheckoutStep: (step: number) => void;
    isCheckoutLoading: boolean;
    finalizeOrder: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
    cart,
    checkoutStep,
    setCheckoutStep,
    isCheckoutLoading,
    finalizeOrder
}) => {
    const total = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

    return (
        <div className="py-12 md:py-32 max-w-3xl mx-auto px-4 md:px-6 animate-fade-in">
            <SectionHeader title="Finalizar Pedido" subtitle="Pagamento por Transferência" />
            <div className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-brand-100 shadow-xl space-y-8 md:space-y-12">
                <div className="flex justify-between items-center mb-6 md:mb-10">
                    {[1, 2].map(step => (
                        <div key={step} className={`flex items-center gap-2 ${checkoutStep >= step ? 'text-brand-900' : 'text-gray-300'}`}>
                            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-[10px] md:text-xs ${checkoutStep >= step ? 'bg-brand-900 text-white' : 'bg-brand-50'}`}>{step}</div>
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{step === 1 ? 'Resumo' : 'Pagamento'}</span>
                            {step === 1 && <div className="w-8 md:w-12 h-px bg-brand-100 mx-2 md:mx-4" />}
                        </div>
                    ))}
                </div>

                {checkoutStep === 1 ? (
                    <div className="space-y-6 md:space-y-8">
                        <div className="divide-y divide-brand-50">
                            {cart.map(item => (
                                <div key={item.id} className="py-4 flex justify-between gap-4">
                                    <div><p className="font-serif font-bold text-base md:text-lg">{item.title}</p><p className="text-[10px] text-gray-400">{item.quantity} exemplar(es)</p></div>
                                    <p className="font-bold text-sm md:text-base">{(item.price * item.quantity).toLocaleString()} Kz</p>
                                </div>
                            ))}
                        </div>
                        <div className="pt-8 border-t border-brand-900 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total a Pagar</p>
                            <p className="text-3xl md:text-4xl font-serif font-bold text-brand-900">{total.toLocaleString()} Kz</p>
                        </div>
                        <button onClick={() => setCheckoutStep(2)} className="w-full py-5 md:py-6 bg-brand-900 text-white font-bold uppercase tracking-widest text-[9px] md:text-[10px] rounded-2xl hover:bg-accent-gold transition-all shadow-xl">Prosseguir para Pagamento</button>
                    </div>
                ) : (
                    <div className="space-y-8 md:space-y-10">
                        <div className="bg-brand-50 p-6 md:p-8 rounded-3xl border border-brand-100">
                            <h4 className="font-serif font-bold text-lg md:text-xl mb-6">Dados Bancários</h4>
                            <div className="space-y-4 text-[11px] md:text-sm">
                                <div className="flex flex-col sm:flex-row justify-between border-b border-brand-100 pb-2"><span>Banco:</span><span className="font-bold">Atlântico</span></div>
                                <div className="flex flex-col sm:flex-row justify-between border-b border-brand-100 pb-2"><span>IBAN:</span><span className="font-bold font-mono break-all text-[10px] md:text-xs">AO06 0055 0000 4494 8662 1012 1</span></div>
                                <div className="flex flex-col sm:flex-row justify-between border-b border-brand-100 pb-2 mt-4"><span>Banco:</span><span className="font-bold">BFA</span></div>
                                <div className="flex flex-col sm:flex-row justify-between pb-2"><span>IBAN:</span><span className="font-bold font-mono break-all text-[10px] md:text-xs">AO06 0006 0000 0781 5251 3015 2</span></div>
                            </div>
                        </div>
                        <div className="p-8 md:p-10 border-2 border-dashed border-brand-100 rounded-3xl text-center">
                            <FileText className="mx-auto text-gray-300 mb-4" size={40} />
                            <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest">Anexar Comprovativo de Pagamento</p>
                            <input type="file" className="hidden" id="proof" />
                            <label htmlFor="proof" className="mt-6 inline-block px-8 py-3 bg-brand-50 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:bg-brand-100 transition-all">Seleccionar Ficheiro</label>
                        </div>
                        <button
                            onClick={finalizeOrder}
                            disabled={isCheckoutLoading}
                            className="w-full py-5 md:py-6 bg-brand-900 text-white font-bold uppercase tracking-widest text-[9px] md:text-[10px] rounded-2xl hover:bg-accent-gold transition-all shadow-xl flex items-center justify-center gap-3"
                        >
                            {isCheckoutLoading ? <Loader2 className="animate-spin" size={16} /> : 'Confirmar Encomenda'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;

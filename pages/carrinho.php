<?php

/**
 * Editora Graça — Shopping Cart Page (PHP Version)
 */
$pageTitle = "O Meu Carrinho";
require_once __DIR__ . '/../templates/header.php';
?>

<section class="section-fluid py-24 bg-gray-50 min-h-[80vh]">
    <div class="container">
        <div class="mb-16 animate-fade-in">
            <nav class="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <a href="/" class="hover:text-brand-primary transition-colors">Início</a>
                <i data-lucide="chevron-right" class="w-3 h-3"></i>
                <span class="text-brand-dark">Carrinho de Compras</span>
            </nav>
            <h1 class="text-5xl sm:text-7xl font-black uppercase leading-none tracking-tighter text-brand-dark">
                O Seu <br><span class="text-gradient-gold italic font-serif font-normal lowercase">Checkout</span>
            </h1>
        </div>

        <div class="grid lg:grid-cols-12 gap-12 items-start">
            <!-- Cart Items -->
            <div class="lg:col-span-8 space-y-6" id="cart-items-container">
                <!-- Skeleton / Loading -->
                <div class="animate-pulse space-y-4">
                    <div class="h-32 bg-white rounded-3xl border border-gray-100"></div>
                    <div class="h-32 bg-white rounded-3xl border border-gray-100"></div>
                </div>
            </div>

            <!-- Summary -->
            <aside class="lg:col-span-4 sticky top-32">
                <div class="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-brand-dark/5 space-y-8 animate-fade-in">
                    <h3 class="text-xs font-black uppercase tracking-[0.4em] text-brand-primary border-b border-gray-50 pb-4">Resumo do Pedido</h3>

                    <div class="space-y-4">
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-gray-400 font-bold uppercase tracking-widest">Subtotal</span>
                            <span id="cart-subtotal" class="font-black text-brand-dark">0 Kz</span>
                        </div>
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-gray-400 font-bold uppercase tracking-widest">Taxas</span>
                            <span class="font-black text-brand-dark">Incluídas</span>
                        </div>
                        <div class="pt-4 border-t border-gray-50 flex justify-between items-center">
                            <span class="text-[10px] font-black uppercase tracking-widest text-brand-dark">Total</span>
                            <span id="cart-total" class="text-2xl font-black text-brand-primary">0 Kz</span>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <button id="btn-checkout" class="w-full py-5 bg-brand-dark text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/10 flex items-center justify-center gap-3">
                            <span>Prosseguir Para Pagamento</span>
                            <i data-lucide="credit-card" class="w-4 h-4"></i>
                        </button>
                        <p class="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                            Pagamento seguro via transferência bancária ou MULTICAIXA Express.
                        </p>
                    </div>

                    <!-- Trust -->
                    <div class="flex items-center justify-center gap-6 pt-4 grayscale opacity-30">
                        <i data-lucide="shield-check" class="w-6 h-6"></i>
                        <i data-lucide="truck" class="w-6 h-6"></i>
                        <i data-lucide="lock" class="w-6 h-6"></i>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>

<!-- Checkout Logic -->
<script type="module">
    import {
        updateQuantity,
        removeFromCart,
        getCartTotal
    } from '/public/js/cart.js';
    import {
        reinitIcons
    } from '/public/js/utils.js';

    const itemsContainer = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    function renderCart() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        if (cart.length === 0) {
            itemsContainer.innerHTML = `
                <div class="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 animate-fade-in col-span-full">
                    <i data-lucide="shopping-cart" class="w-16 h-16 text-gray-200 mx-auto mb-4"></i>
                    <h3 class="text-xl font-black text-brand-dark uppercase">Carrinho Vazio</h3>
                    <p class="text-gray-400 text-sm mt-2 mb-8">Parece que ainda não escolheu nenhuma obra.</p>
                    <a href="/livros" class="inline-flex items-center gap-3 px-8 py-4 bg-brand-dark text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-brand-primary transition-all">
                        Explorar Livros <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </a>
                </div>
            `;
            subtotalEl.textContent = '0 Kz';
            totalEl.textContent = '0 Kz';
            reinitIcons(itemsContainer);
            return;
        }

        itemsContainer.innerHTML = cart.map(item => `
            <div class="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 animate-fade-in group">
                <div class="w-24 h-32 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                    <img src="${item.coverUrl}" class="w-full h-full object-cover">
                </div>
                
                <div class="flex-1 space-y-1 text-center sm:text-left">
                    <h4 class="text-lg font-black uppercase tracking-tight text-brand-dark line-clamp-1">${item.title}</h4>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Por ${item.author}</p>
                    <p class="text-brand-primary font-black uppercase text-xs pt-2">${new Intl.NumberFormat('pt-AO').format(item.price)} Kz</p>
                </div>

                <div class="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-2xl">
                    <button class="qty-btn" data-id="${item.id}" data-action="minus">
                        <i data-lucide="minus" class="w-3 h-3 text-gray-400 hover:text-brand-dark transition-colors"></i>
                    </button>
                    <span class="text-xs font-black w-4 text-center">${item.quantity}</span>
                    <button class="qty-btn" data-id="${item.id}" data-action="plus">
                        <i data-lucide="plus" class="w-3 h-3 text-gray-400 hover:text-brand-dark transition-colors"></i>
                    </button>
                </div>

                <button class="remove-btn p-4 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all text-gray-300" data-id="${item.id}">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            </div>
        `).join('');

        const total = getCartTotal();
        const formattedTotal = new Intl.NumberFormat('pt-AO').format(total) + ' Kz';
        subtotalEl.textContent = formattedTotal;
        totalEl.textContent = formattedTotal;

        reinitIcons(itemsContainer);
    }

    // Listen for local updates
    window.addEventListener('cartUpdated', renderCart);

    // Interaction delegated
    itemsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const id = btn.dataset.id;
        if (btn.classList.contains('remove-btn')) {
            removeFromCart(id);
        } else if (btn.classList.contains('qty-btn')) {
            const action = btn.dataset.action;
            updateQuantity(id, action === 'plus' ? 1 : -1);
        }
    });

    // Initial render
    renderCart();

    // Checkout redirect placeholder
    document.getElementById('btn-checkout').addEventListener('click', () => {
        alert('O checkout será ativado na Fase 5.2 (Integração de Pagamentos).');
    });
</script>
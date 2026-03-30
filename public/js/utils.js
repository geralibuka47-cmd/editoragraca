import { addToCart } from './cart.js';

/**
 * Renders an HTML string for a book card (mirrors templates/book-card.php)
 */
export function renderBookCard(book) {
    const price = book.price > 0
        ? new Intl.NumberFormat('pt-AO').format(book.price) + " Kz"
        : "Gratuito";

    const slug = book.slug || book.id;
    const rating = book.stats?.averageRating || '5.0';

    return `
        <div class="card-premium group cursor-pointer animate-fade-in" data-slug="${slug}">
            <div class="relative aspect-[3/4] overflow-hidden rounded-2xl mb-6">
                <img src="${book.coverUrl}" 
                     alt="${book.title}" 
                     class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                
                ${book.isNew ? `
                    <div class="absolute top-4 left-4 px-3 py-1 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                        Novo
                    </div>
                ` : ''}
                
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button class="view-btn p-4 bg-white text-brand-dark rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-2xl translate-y-4 group-hover:translate-y-0 duration-300">
                        <i data-lucide="eye" class="w-5 h-5"></i>
                    </button>
                    <button class="cart-btn p-4 bg-brand-primary text-white rounded-2xl hover:bg-brand-dark transition-all shadow-2xl translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                        <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>

            <div class="space-y-2">
                <h3 class="text-lg font-black text-brand-dark leading-tight uppercase line-clamp-1">${book.title}</h3>
                <p class="text-xs text-brand-gray font-bold uppercase tracking-widest">${book.author}</p>
                
                <div class="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                    <span class="text-xl font-black text-brand-primary">
                        ${price}
                    </span>
                    <div class="flex items-center gap-1 text-amber-500">
                        <i data-lucide="star" class="w-3 h-3 fill-current"></i>
                        <span class="text-xs font-black">${rating}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initializes Lucide icons and binds event listeners for book cards
 */
export function reinitIcons(container = document) {
    if (window.lucide) {
        window.lucide.createIcons({
            attrs: {
                "stroke-width": 2.5
            },
            nameAttr: "data-lucide",
            container: container
        });
    }

    // Bind Cart Buttons
    const cards = container.querySelectorAll('.card-premium');
    cards.forEach(card => {
        const slug = card.dataset.slug;

        // View Action
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.cart-btn')) {
                window.location.href = `/livro/${slug}`;
            }
        });

        // Cart Action
        const cartBtn = card.querySelector('.cart-btn');
        cartBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            // We need the book object. For now, since we only have the ID/Slug, 
            // the individual pages will need to handle the actual adding if they have the data,
            // or we fetch it here. Best: emit an event.
            const event = new CustomEvent('requestAddToCart', { detail: { slug } });
            window.dispatchEvent(event);
        });
    });
}

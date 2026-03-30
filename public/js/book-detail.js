/**
 * Editora Graça — Book Detail Logic (Vanila JS)
 */
import { getBookBySlug } from './books.js';
import { reinitIcons } from './utils.js';

let currentBook = null;

document.addEventListener('DOMContentLoaded', async () => {
    const slug = window.bookSlug;
    if (!slug) return;

    const container = document.getElementById('book-container');
    const loadingOverlay = document.getElementById('loading-overlay');
    const errorContainer = document.getElementById('error-container');

    try {
        // 1. Fetch Book Data
        currentBook = await getBookBySlug(slug);

        if (!currentBook) {
            loadingOverlay.classList.add('hidden');
            errorContainer.classList.remove('hidden');
            return;
        }

        // 2. Populate UI
        renderBook(currentBook);

        // 3. Setup Tab Listeners
        setupTabs();

        // 4. Show Content
        loadingOverlay.classList.add('hidden');
        container.classList.remove('hidden');
        reinitIcons(container);

    } catch (error) {
        console.error("Error loading book detail:", error);
        loadingOverlay.classList.add('hidden');
        errorContainer.classList.remove('hidden');
    }
});

function renderBook(book) {
    document.title = `${book.title} | Editora Graça`;

    document.getElementById('book-cover').src = book.coverUrl;
    document.getElementById('book-cover').alt = book.title;
    document.getElementById('book-title').textContent = book.title;
    document.getElementById('book-author').textContent = `Por ${book.author}`;
    document.getElementById('book-format-badge').textContent = book.format === 'digital' ? 'E-Book' : 'Físico';

    const priceText = book.price === 0 ? 'Gratuito' : `${new Intl.NumberFormat('pt-AO').format(book.price)} Kz`;
    document.getElementById('book-price').textContent = priceText;

    // Stats
    document.getElementById('stat-views').textContent = book.stats?.views || 0;
    document.getElementById('stat-downloads').textContent = book.stats?.downloads || 0;
    document.getElementById('stat-rating').textContent = book.stats?.averageRating || '—';

    // Description (Sinopse) - Default Tab
    renderTab('sinopse');

    // Badges
    const badgesContainer = document.getElementById('book-badges');
    if (book.category && book.category !== 'livro') {
        badgesContainer.innerHTML += `
            <span class="px-4 py-1.5 bg-brand-primary/20 text-brand-primary font-black text-[10px] uppercase tracking-[0.4em] rounded-full border border-brand-primary/30 flex items-center gap-2">
                <i data-lucide="sparkles" class="w-3 h-3"></i> ${book.category}
            </span>
        `;
    }
    if (book.genre) {
        badgesContainer.innerHTML += `
            <span class="px-4 py-1.5 bg-brand-primary/15 text-brand-primary font-black text-[10px] uppercase tracking-[0.2em] rounded-full border border-brand-primary/20">
                ${book.genre}
            </span>
        `;
    }
}

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;

            // UI Toggle
            tabBtns.forEach(b => {
                b.classList.remove('active', 'text-brand-dark');
                b.classList.add('text-gray-400');
                const line = b.querySelector('span');
                if (line) line.remove();
            });

            btn.classList.add('active', 'text-brand-dark');
            btn.classList.remove('text-gray-400');
            btn.insertAdjacentHTML('beforeend', '<span class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full"></span>');

            renderTab(tab);
        });
    });
}

function renderTab(tab) {
    const content = document.getElementById('tab-content');
    if (!currentBook) return;

    if (tab === 'sinopse') {
        content.innerHTML = `
            <div class="prose prose-lg max-w-none text-gray-600 leading-relaxed animate-fade-in">
                ${currentBook.description ? currentBook.description.split('\n').map(p => `<p>${p}</p>`).join('') : '<p class="italic text-gray-400">Sinopse ainda não disponível.</p>'}
            </div>
        `;
    } else if (tab === 'ficha') {
        const fields = [
            { label: 'Editor', value: currentBook.editor },
            { label: 'Diagramação', value: currentBook.diagramador },
            { label: 'Arte da Capa', value: currentBook.capa },
            { label: 'Revisão', value: currentBook.revisor },
            { label: 'ISBN', value: currentBook.isbn },
            { label: 'Ano de Edição', value: currentBook.launchDate ? new Date(currentBook.launchDate).getFullYear() : '—' },
            { label: 'Selo Editorial', value: 'Editora Graça' }
        ].filter(f => f.value);

        content.innerHTML = `
            <div class="grid sm:grid-cols-2 gap-6 animate-fade-in">
                ${fields.map(f => `
                    <div class="flex flex-col gap-1 border-b border-gray-100 pb-4">
                        <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">${f.label}</span>
                        <span class="font-bold text-brand-dark">${f.value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'avaliacoes') {
        content.innerHTML = `
            <div class="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl animate-fade-in">
                <i data-lucide="star" class="w-12 h-12 text-gray-200 mx-auto mb-4"></i>
                <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Ainda sem avaliações</p>
            </div>
        `;
    }
    reinitIcons(content);
}

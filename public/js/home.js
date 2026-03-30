/**
 * Editora Graça — HomePage Logic (100% Dynamic Firestore Sync)
 */
import { getBooks, getUpcomingBooks, getAuthors } from './books.js';
import { renderBookCard, renderAuthorCard, reinitIcons } from './utils.js';
import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    // 0. Institutional Content
    loadInstitutionalContent();

    // 1. Reading of the Month (Hero & Section)
    loadReadingOfMonth();

    // 2. Upcoming Releases
    loadUpcomingReleases();

    // 3. Categorized Books (Physical, Digital, Free)
    loadCategorizedBooks();

    // 4. Success Authors
    loadSuccessAuthors();
});

async function loadReadingOfMonth() {
    const heroContainer = document.getElementById('hero-reading-container');
    const sectionContainer = document.getElementById('reading-of-month-container');

    // We fetch a book with 'isReadingOfMonth' or just the first bestseller
    const books = await getBooks({ limit: 1 }); // Simplificação: pega o mais recente
    if (books.length > 0) {
        const book = books[0];

        // Update Hero image
        if (heroContainer) {
            heroContainer.innerHTML = `
                <div class="relative z-10 w-full max-w-[280px] sm:max-w-[350px] lg:max-w-[450px] mx-auto">
                    <div class="relative group cursor-pointer" onclick="window.location.href='/livro/${book.slug}'">
                        <div class="absolute inset-0 bg-brand-primary rounded-2xl rotate-6 group-hover:rotate-0 transition-transform duration-500"></div>
                        <img src="${book.coverUrl}" alt="${book.title}" class="relative w-full rounded-2xl shadow-2xl transition-transform duration-500 group-hover:-translate-y-4">
                    </div>
                </div>
            `;
        }

        // Update Reading of the Month section
        if (sectionContainer) {
            sectionContainer.innerHTML = `
                <section class="py-16 sm:py-24 md:py-32 bg-white relative overflow-hidden">
                    <div class="container mx-auto px-4 sm:px-6 md:px-12">
                        <div class="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
                            <div class="relative aspect-[3/4] max-w-[280px] sm:max-w-sm lg:max-w-md mx-auto">
                                <div class="absolute inset-0 bg-brand-primary/5 blur-3xl rounded-full"></div>
                                <img src="${book.coverUrl}" alt="${book.title}" class="relative z-10 w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
                                <div class="absolute -bottom-4 -right-4 sm:-bottom-10 sm:-right-10 w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-brand-primary rounded-full flex items-center justify-center text-white text-center p-3 sm:p-6 shadow-2xl z-20 rotate-12">
                                    <span class="text-[9px] sm:text-xs font-black uppercase tracking-[0.2em]">Leitura do <br> Mês</span>
                                </div>
                            </div>
                            <div class="space-y-4 sm:space-y-8">
                                <span class="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px] sm:text-xs">Destaque Editorial</span>
                                <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-brand-dark uppercase tracking-tighter leading-none">${book.title}</h2>
                                <p class="text-lg sm:text-2xl font-serif italic text-gray-500">${book.author}</p>
                                <p class="text-base sm:text-xl text-gray-600 leading-relaxed font-light">${book.description || ''}</p>
                                <div class="pt-4 sm:pt-6">
                                    <a href="/livro/${book.slug}" class="inline-flex items-center justify-center px-12 py-5 bg-brand-dark text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-primary transition-all shadow-xl no-underline">
                                        Mergulhar na Obra <i data-lucide="book-open" class="ml-3 w-5 h-5"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `;
            reinitIcons(sectionContainer);
        }
    }
}

async function loadUpcomingReleases() {
    const container = document.getElementById('upcoming-releases-grid');
    const section = document.getElementById('upcoming-section');
    if (!container || !section) return;

    const upcoming = await getUpcomingBooks();
    if (upcoming.length > 0) {
        section.classList.remove('hidden');
        container.innerHTML = '';
        upcoming.forEach(book => {
            const date = new Date(book.launchDate).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
            container.insertAdjacentHTML('beforeend', `
                <div class="group relative">
                    <a href="/livro/${book.slug}" class="block no-underline">
                        <div class="aspect-[2/3] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 group-hover:-translate-y-4 border border-white/5 group-hover:border-brand-primary/20">
                            <img src="${book.coverUrl}" alt="${book.title}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                            <div class="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/95 via-transparent to-transparent">
                                <p class="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">${date}</p>
                                <h4 class="font-black text-xs uppercase text-white line-clamp-1">${book.title}</h4>
                            </div>
                        </div>
                    </a>
                </div>
            `);
        });
        reinitIcons(container);
    }
}

async function loadCategorizedBooks() {
    const physicalGrid = document.getElementById('physical-books-grid');
    const digitalGrid = document.getElementById('digital-books-grid');
    const freeGrid = document.getElementById('free-books-grid');

    const allBooks = await getBooks({ limit: 20 });

    if (physicalGrid) {
        const physical = allBooks.filter(b => b.format === 'físico').slice(0, 4);
        if (physical.length > 0) {
            physicalGrid.innerHTML = '';
            physical.forEach(b => physicalGrid.insertAdjacentHTML('beforeend', renderBookCard(b)));
            reinitIcons(physicalGrid);
        }
    }

    if (digitalGrid) {
        const digital = allBooks.filter(b => b.format === 'digital' && b.price > 0).slice(0, 4);
        if (digital.length > 0) {
            digitalGrid.innerHTML = '';
            digital.forEach(b => digitalGrid.insertAdjacentHTML('beforeend', renderBookCard(b)));
            reinitIcons(digitalGrid);
        }
    }

    if (freeGrid) {
        const free = allBooks.filter(b => b.price === 0).slice(0, 4);
        if (free.length > 0) {
            freeGrid.innerHTML = '';
            free.forEach(b => freeGrid.insertAdjacentHTML('beforeend', renderBookCard(b)));
            reinitIcons(freeGrid);
        }
    }
}

async function loadSuccessAuthors() {
    const container = document.getElementById('authors-grid');
    if (!container) return;

    const authors = await getAuthors();
    if (authors.length > 0) {
        container.innerHTML = '';
        authors.slice(0, 3).forEach((author, i) => {
            container.insertAdjacentHTML('beforeend', renderAuthorCard(author, i));
        });
        reinitIcons(container);
    }
}

async function loadInstitutionalContent() {
    try {
        const configRef = doc(db, "site_content", "config");
        const snap = await getDoc(configRef);

        if (snap.exists()) {
            const data = snap.data();
            const inst = data.institutional;
            if (inst) {
                const heroTitle = document.querySelector('h1.uppercase.leading-\\[0\\.9\\]');
                const heroSubtitle = document.querySelector('p.text-gray-500.font-medium.max-w-lg');
                if (heroTitle && inst.homeHeroTitle) heroTitle.innerHTML = inst.homeHeroTitle.replace(/\n/g, '<br>');
                if (heroSubtitle && inst.homeHeroSubtitle) heroSubtitle.textContent = inst.homeHeroSubtitle;
            }
        }
    } catch (e) {
        console.error("Error loading institutional content:", e);
    }
}

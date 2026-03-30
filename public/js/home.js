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

    // 5. Tendencies (Most Viewed & Most Downloaded)
    loadTendencies();
});

async function loadReadingOfMonth() {
    const heroContainer = document.getElementById('hero-reading-container');
    const sectionContainer = document.getElementById('reading-of-month-container');

    const books = await getBooks({ limit: 50 });
    const readingOfMonth = books.find(b => b.featured) || books[0];

    if (readingOfMonth) {
        // Update Hero image
        if (heroContainer) {
            heroContainer.innerHTML = `
                <div class="relative z-10 w-full max-w-[280px] sm:max-w-[350px] lg:max-w-[450px] mx-auto">
                    <div class="relative group cursor-pointer" onclick="window.location.href='/livro/${readingOfMonth.slug}'">
                        <div class="absolute inset-0 bg-brand-primary rounded-2xl rotate-6 group-hover:rotate-0 transition-transform duration-500"></div>
                        <img src="${readingOfMonth.coverUrl}" alt="${readingOfMonth.title}" class="relative w-full rounded-2xl shadow-2xl transition-transform duration-500 group-hover:-translate-y-4">
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
                                <img src="${readingOfMonth.coverUrl}" alt="${readingOfMonth.title}" class="relative z-10 w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
                                <div class="absolute -bottom-4 -right-4 sm:-bottom-10 sm:-right-10 w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-brand-primary rounded-full flex items-center justify-center text-white text-center p-3 sm:p-6 shadow-2xl z-20 rotate-12">
                                    <span class="text-[9px] sm:text-xs font-black uppercase tracking-[0.2em]">Leitura do <br> Mês</span>
                                </div>
                            </div>
                            <div class="space-y-4 sm:space-y-8">
                                <span class="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px] sm:text-xs">Destaque Editorial</span>
                                <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-brand-dark uppercase tracking-tighter leading-none">${readingOfMonth.title}</h2>
                                <p class="text-lg sm:text-2xl font-serif italic text-gray-500">${readingOfMonth.author}</p>
                                <p class="text-base sm:text-xl text-gray-600 leading-relaxed font-light line-clamp-4">${readingOfMonth.description || ''}</p>
                                <div class="pt-4 sm:pt-6">
                                    <a href="/livro/${readingOfMonth.slug}" class="inline-flex items-center justify-center px-12 py-5 bg-brand-dark text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-primary transition-all shadow-xl no-underline">
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
                const line1 = document.getElementById('hero-title-line1');
                const line2 = document.getElementById('hero-title-line2');
                const heroSubtitle = document.querySelector('p.text-gray-500.font-medium.max-w-lg');

                if (line1 && inst.homeHeroTitle1) line1.textContent = inst.homeHeroTitle1;
                if (line2 && inst.homeHeroTitle2) line2.textContent = inst.homeHeroTitle2;
                if (heroSubtitle && inst.homeHeroSubtitle) heroSubtitle.textContent = inst.homeHeroSubtitle;
            }
        }
    } catch (e) {
        console.error("Error loading institutional content:", e);
    }
}

async function loadTendencies() {
    const mostViewedGrid = document.getElementById('most-viewed-grid');
    const mostViewedSection = document.getElementById('most-viewed-section');
    const mostDownloadedContainer = document.getElementById('most-downloaded-container');

    const allBooks = await getBooks({ limit: 50 });
    const released = allBooks.filter(b => b.status === 'released' || !b.status);

    // Most Viewed
    if (mostViewedGrid && mostViewedSection) {
        const viewed = [...released].sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0)).slice(0, 4);
        if (viewed.length > 0) {
            mostViewedSection.classList.remove('hidden');
            mostViewedGrid.innerHTML = viewed.map(b => renderBookCard(b)).join('');
            reinitIcons(mostViewedGrid);
        }
    }

    // Most Downloaded
    if (mostDownloadedContainer) {
        const downloaded = [...released].sort((a, b) => (b.stats?.downloads || 0) - (a.stats?.downloads || 0))[0];
        if (downloaded) {
            mostDownloadedContainer.innerHTML = `
                <div class="max-w-4xl mx-auto w-full">
                    <div class="bg-gradient-to-br from-brand-primary to-amber-600 rounded-2xl sm:rounded-[3rem] p-6 sm:p-12 text-white flex flex-col gap-6 sm:gap-8 relative overflow-hidden shadow-2xl">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div class="flex justify-between items-start relative z-10">
                            <div class="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                Mais Baixado
                            </div>
                            <div class="flex items-center gap-2 text-white/80 font-bold uppercase tracking-widest text-[10px]">
                                <i data-lucide="trending-up" class="w-4 h-4"></i>
                                Recorde de Vendas
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-5 gap-8 items-center relative z-10">
                            <div class="sm:col-span-2">
                                <img src="${downloaded.coverUrl}" alt="${downloaded.title}" class="w-full max-w-[200px] sm:max-w-none mx-auto rounded-2xl shadow-2xl rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                            </div>
                            <div class="sm:col-span-3 space-y-4 text-center sm:text-left">
                                <h3 class="text-2xl sm:text-3xl font-black uppercase leading-tight line-clamp-2 text-white">${downloaded.title}</h3>
                                <p class="text-white/80 font-bold uppercase tracking-widest text-xs italic">${downloaded.author}</p>
                                <div class="pt-4 flex flex-col items-center sm:items-start gap-2 text-[10px] font-black uppercase tracking-widest">
                                    <div class="flex items-center gap-2">
                                        <div class="w-2 h-2 bg-white rounded-full"></div>
                                        <span>${downloaded.stats?.downloads || 0}+ Downloads</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div class="w-2 h-2 bg-white rounded-full"></div>
                                        <span>${downloaded.stats?.averageRating || '4.9'} Avaliação Média</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a href="/livro/${downloaded.slug}" class="w-full py-5 bg-white text-brand-dark font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-dark hover:text-white transition-all shadow-xl relative z-10 text-center no-underline">
                            Adquirir Obra Agora
                        </a>
                    </div>
                </div>
            `;
            reinitIcons(mostDownloadedContainer);
        }
    }
}

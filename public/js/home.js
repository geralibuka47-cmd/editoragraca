/**
 * Editora Graça — HomePage Logic (Vanila JS)
 */
import { getBooks, getUpcomingBooks } from './books.js';
import { renderBookCard, reinitIcons } from './utils.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const catalogContainer = document.getElementById('featured-catalog');
    const upcomingContainer = document.getElementById('upcoming-releases-grid');
    const upcomingSection = document.getElementById('upcoming-section');

    // 0. Load Institutional Content
    loadInstitutionalContent();

    // 1. Fetch real books for main catalog
    if (catalogContainer) {
        const books = await getBooks({ limit: 8 });
        if (books.length > 0) {
            catalogContainer.innerHTML = '';
            books.forEach(book => {
                catalogContainer.insertAdjacentHTML('beforeend', renderBookCard(book));
            });
            reinitIcons(catalogContainer);
        }
    }

    // 2. Fetch Upcoming Releases
    if (upcomingContainer && upcomingSection) {
        const upcoming = await getUpcomingBooks();
        if (upcoming.length > 0) {
            upcomingSection.classList.remove('hidden');
            upcomingContainer.innerHTML = '';

            upcoming.forEach(book => {
                const date = new Date(book.launchDate).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
                const html = `
                    <div class="group relative">
                        <a href="/livro/${book.slug}" class="block">
                            <div class="aspect-[2/3] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 group-hover:-translate-y-4 border border-white/5 group-hover:border-brand-primary/20">
                                <img src="${book.coverUrl}" alt="${book.title}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                                <div class="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/95 via-transparent to-transparent">
                                    <p class="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">${date}</p>
                                    <h4 class="font-black text-xs uppercase text-white line-clamp-1">${book.title}</h4>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                upcomingContainer.insertAdjacentHTML('beforeend', html);
            });
            reinitIcons(upcomingContainer);
        } else {
            upcomingSection.classList.add('hidden');
        }
    }
});

async function loadInstitutionalContent() {
    try {
        const db = window.db;
        const configRef = doc(db, "site_content", "config");
        const snap = await getDoc(configRef);

        if (snap.exists()) {
            const data = snap.data();
            const inst = data.institutional;

            if (inst) {
                const heroTitle = document.querySelector('h1.uppercase.leading-\\[0\\.9\\]');
                const heroSubtitle = document.querySelector('p.text-gray-500.font-medium.max-w-lg');

                if (heroTitle && inst.homeHeroTitle) {
                    heroTitle.innerHTML = inst.homeHeroTitle.replace('\n', '<br>');
                }
                if (heroSubtitle && inst.homeHeroSubtitle) {
                    heroSubtitle.textContent = inst.homeHeroSubtitle;
                }
            }
        }
    } catch (e) {
        console.error("Error loading institutional content:", e);
    }
}

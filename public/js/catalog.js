/**
 * Editora Graça — Catalog Logic (Vanila JS)
 */
import { getBooks } from './books.js';
import { renderBookCard, reinitIcons } from './utils.js';

let allBooks = [];
let filteredBooks = [];
let currentGenre = 'Todos';
let currentFormat = 'all';
let currentSort = 'title-asc';
let searchQuery = '';
let currentView = 'grid';

const gridContainer = document.getElementById('catalog-grid');
const searchInput = document.getElementById('catalog-search');
const genreContainer = document.getElementById('genre-filters');
const formatContainer = document.getElementById('format-filters');
const sortSelect = document.getElementById('sort-by');
const clearBtn = document.getElementById('clear-filters');
const viewBtns = document.querySelectorAll('.view-btn');

document.addEventListener('DOMContentLoaded', async () => {
    if (!gridContainer) return;

    // 1. Initial Load
    allBooks = await getBooks();
    filteredBooks = [...allBooks];

    // 2. Setup Genre Filters
    setupGenres();

    // 3. Setup Listeners
    setupListeners();

    // 4. Initial Render
    render();
});

function setupGenres() {
    const genres = new Set(allBooks.map(b => b.genre).filter(Boolean));
    const sortedGenres = Array.from(genres).sort();

    sortedGenres.forEach(genre => {
        const btn = document.createElement('button');
        btn.className = 'genre-btn w-full text-left px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between group hover:bg-brand-light text-gray-500';
        btn.dataset.genre = genre;
        btn.innerHTML = `${genre} <i data-lucide="chevron-right" class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all"></i>`;
        genreContainer.appendChild(btn);
    });
    reinitIcons(genreContainer);
}

function setupListeners() {
    // Search
    searchInput?.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        applyFilters();
    });

    // Genres
    genreContainer?.addEventListener('click', (e) => {
        const btn = e.target.closest('.genre-btn');
        if (!btn) return;

        currentGenre = btn.dataset.genre;
        document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active', 'bg-brand-dark', 'text-white'));
        btn.classList.add('active', 'bg-brand-dark', 'text-white');

        applyFilters();
    });

    // Format
    formatContainer?.addEventListener('click', (e) => {
        const btn = e.target.closest('.format-btn');
        if (!btn) return;

        currentFormat = btn.dataset.format;
        document.querySelectorAll('.format-btn').forEach(b => {
            b.classList.remove('active', 'bg-brand-primary', 'text-white', 'border-brand-primary', 'shadow-lg');
            b.classList.add('bg-white', 'text-gray-400', 'border-gray-100');
        });
        btn.classList.add('active', 'bg-brand-primary', 'text-white', 'border-brand-primary', 'shadow-lg');
        btn.classList.remove('bg-white', 'text-gray-400', 'border-gray-100');

        applyFilters();
    });

    // Sort
    sortSelect?.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFilters();
    });

    // View Toggle
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentView = btn.dataset.view;
            viewBtns.forEach(b => b.classList.remove('active', 'bg-brand-primary', 'text-white', 'shadow-md'));
            btn.classList.add('active', 'bg-brand-primary', 'text-white', 'shadow-md');
            render();
        });
    });

    // Clear
    clearBtn?.addEventListener('click', () => {
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        currentGenre = 'Todos';
        currentFormat = 'all';
        // Reset buttons...
        applyFilters();
    });
}

function applyFilters() {
    filteredBooks = allBooks.filter(book => {
        const matchesSearch = !searchQuery ||
            book.title.toLowerCase().includes(searchQuery) ||
            book.author.toLowerCase().includes(searchQuery);

        const matchesGenre = currentGenre === 'Todos' || book.genre === currentGenre;
        const matchesFormat = currentFormat === 'all' || book.format === currentFormat;

        return matchesSearch && matchesGenre && matchesFormat;
    });

    // Sort
    if (currentSort === 'title-asc') {
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (currentSort === 'title-desc') {
        filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
    } else if (currentSort === 'price-asc') {
        filteredBooks.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
        filteredBooks.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'newest') {
        filteredBooks.sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime());
    }

    render();
}

function render() {
    if (!gridContainer) return;

    if (filteredBooks.length === 0) {
        gridContainer.innerHTML = `
            <div class="col-span-full py-20 text-center animate-fade-in">
                <i data-lucide="book-open" class="w-16 h-16 text-gray-200 mx-auto mb-4"></i>
                <h3 class="text-xl font-black text-brand-dark uppercase">Nenhuma obra encontrada</h3>
                <p class="text-gray-400 text-sm mt-2">Tente ajustar os seus filtros.</p>
            </div>
        `;
        reinitIcons(gridContainer);
        return;
    }

    gridContainer.className = currentView === 'grid'
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 animate-fade-in"
        : "flex flex-col gap-6 animate-fade-in";

    gridContainer.innerHTML = filteredBooks.map(renderBookCard).join('');
    reinitIcons(gridContainer);
}

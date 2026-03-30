import { onAuth } from './auth.js';
import { getBooks, getAuthors, saveBook, deleteBook } from './books.js';

let allBooks = [];
let allAuthors = [];
let currentStep = 1;
let selectedAuthors = [];
let editingBook = null;

onAuth((user) => {
    if (!user || user.role !== 'adm') {
        window.location.href = '/login';
        return;
    }
    init();
});

async function init() {
    await Promise.all([loadBooks(), loadAuthors()]);
    setupEventListeners();
}

async function loadBooks() {
    const loader = document.getElementById('admin-books-loading');
    const grid = document.getElementById('admin-books-grid');
    const emptyState = document.getElementById('book-empty-state');

    try {
        allBooks = await getBooks({ includeFuture: true });
        renderBooks(allBooks);

        loader.classList.add('hidden');
        if (allBooks.length === 0) {
            emptyState.classList.remove('hidden');
            grid.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            grid.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Error loading books:", error);
    }
}

async function loadAuthors() {
    allAuthors = await getAuthors();
    renderAuthorSelect();
}

function renderBooks(books) {
    const grid = document.getElementById('admin-books-grid');
    grid.innerHTML = '';

    books.forEach(book => {
        const item = document.createElement('div');
        item.className = "group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col";
        item.innerHTML = `
            <div class="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-6 shadow-lg group-hover:scale-[1.02] transition-transform duration-500">
                <img src="${book.coverUrl}" alt="${book.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button class="edit-btn p-4 bg-white text-brand-dark rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-xl" data-id="${book.id}">
                        <i data-lucide="edit-2" class="w-5 h-5"></i>
                    </button>
                    <button class="delete-btn p-4 bg-white text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl" data-id="${book.id}">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                </div>
                ${book.featured ? '<span class="absolute top-4 right-4 px-3 py-1 bg-brand-primary text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">Destaque</span>' : ''}
            </div>
            <div class="flex-1 space-y-2">
                <div class="flex items-center justify-between gap-4">
                    <span class="text-[9px] font-black uppercase tracking-widest text-brand-primary">${book.genre || 'Obra'}</span>
                    <span class="text-[9px] font-bold text-gray-400 capitalize">${book.format}</span>
                </div>
                <h3 class="text-lg font-black text-brand-dark leading-tight line-clamp-2">${book.title}</h3>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">${book.author}</p>
            </div>
            <div class="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                <span class="text-sm font-black text-brand-dark tabular-nums">${Number(book.price).toLocaleString()} Kz</span>
                <span class="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Stock: ${book.stock || 0}</span>
            </div>
        `;

        item.querySelector('.edit-btn').onclick = () => openModal(book);
        item.querySelector('.delete-btn').onclick = () => handleDelete(book.id, book.title);

        grid.appendChild(item);
    });

    if (window.lucide) window.lucide.createIcons();
}

// Wizard Logic
function setupEventListeners() {
    document.getElementById('add-book-btn').onclick = () => openModal();
    document.getElementById('close-modal').onclick = closeModal;
    document.getElementById('next-step-btn').onclick = nextStep;
    document.getElementById('prev-step-btn').onclick = prevStep;

    // Search & Filter
    document.getElementById('book-search').oninput = (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allBooks.filter(b => b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term));
        renderBooks(filtered);
    };

    document.getElementById('format-filter').onchange = (e) => {
        const format = e.target.value;
        const filtered = format === 'todos' ? allBooks : allBooks.filter(b => b.format === format);
        renderBooks(filtered);
    };

    // Live Cover Preview
    document.getElementById('book-cover').oninput = (e) => {
        const url = e.target.value;
        const preview = document.getElementById('cover-preview');
        const placeholder = document.getElementById('cover-placeholder');
        if (url) {
            preview.src = url;
            preview.classList.remove('hidden');
            placeholder.classList.add('hidden');
        } else {
            preview.classList.add('hidden');
            placeholder.classList.remove('hidden');
        }
    };

    // Format Change Logic
    document.getElementById('book-format').onchange = (e) => {
        const format = e.target.value;
        const digitalFields = document.getElementById('digital-fields');
        const paymentFields = document.getElementById('payment-fields');
        const price = parseFloat(document.getElementById('book-price').value) || 0;

        if (format === 'digital') {
            digitalFields.classList.remove('hidden');
        } else {
            digitalFields.classList.add('hidden');
        }

        // Only show payment if price > 0
        if (price > 0) {
            paymentFields.classList.remove('hidden');
        } else {
            paymentFields.classList.add('hidden');
        }
    };

    // Multi-author add
    document.getElementById('author-select').onchange = (e) => {
        const authorId = e.target.value;
        if (!authorId) return;
        const author = allAuthors.find(a => a.id === authorId);
        if (author && !selectedAuthors.find(a => a.id === authorId)) {
            selectedAuthors.push({ id: authorId, name: author.name });
            renderSelectedAuthors();
        }
        e.target.value = '';
    };

    // Form Submission
    document.getElementById('book-form').onsubmit = handleSave;
}

function openModal(book = null) {
    editingBook = book;
    currentStep = 1;
    selectedAuthors = book ? (book.authors || [{ id: book.authorId, name: book.author }]) : [];

    document.getElementById('modal-title').textContent = book ? "EDITAR OBRA" : "NOVA OBRA";

    if (book) {
        document.getElementById('book-id').value = book.id;
        document.getElementById('book-title').value = book.title;
        document.getElementById('book-genre').value = book.genre || '';
        document.getElementById('book-price').value = book.price;
        document.getElementById('book-category').value = book.category || 'livro';
        document.getElementById('book-cover').value = book.coverUrl;
        document.getElementById('book-featured').checked = book.featured || false;
        document.getElementById('book-stock').value = book.stock || 0;
        document.getElementById('book-description').value = book.description || '';

        document.getElementById('book-format').value = book.format || 'físico';
        document.getElementById('book-launch-date').value = book.launchDate ? book.launchDate.substring(0, 16) : '';
        document.getElementById('book-digital-url').value = book.digitalFileUrl || '';

        document.getElementById('bank-holder').value = book.accountHolder || '';
        document.getElementById('bank-iban').value = book.iban || '';
        document.getElementById('bank-number').value = book.accountNumber || '';
        document.getElementById('bank-express').value = book.express || '';

        document.getElementById('tech-editor').value = book.editor || '';
        document.getElementById('tech-diagramador').value = book.diagramador || '';
        document.getElementById('tech-paginador').value = book.paginador || '';
        document.getElementById('tech-capa').value = book.capa || '';
        document.getElementById('tech-revisor').value = book.revisor || '';
        document.getElementById('tech-isbn').value = book.isbn || '';
        document.getElementById('tech-deposito').value = book.depositoLegal || '';

        // Trigger preview
        document.getElementById('book-cover').dispatchEvent(new Event('input'));
        document.getElementById('book-format').dispatchEvent(new Event('change'));
    } else {
        document.getElementById('book-form').reset();
        document.getElementById('book-id').value = '';
        document.getElementById('cover-preview').classList.add('hidden');
        document.getElementById('cover-placeholder').classList.remove('hidden');
    }

    renderStep(1);
    renderSelectedAuthors();
    document.getElementById('book-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('book-modal').classList.add('hidden');
}

function renderStep(step) {
    currentStep = step;
    document.querySelectorAll('.step-content').forEach(c => c.classList.add('hidden'));
    document.getElementById(`step-content-${step}`).classList.remove('hidden');

    // Dots & Lines
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`step-dot-${i}`);
        const line = document.getElementById(`step-line-${i}`);
        if (i < step) {
            dot.classList.replace('bg-gray-100', 'bg-brand-dark');
            dot.classList.replace('text-gray-400', 'text-white');
            if (line) line.classList.replace('bg-gray-100', 'bg-brand-dark');
        } else if (i === step) {
            dot.classList.replace('bg-gray-100', 'bg-brand-dark');
            dot.classList.replace('text-gray-400', 'text-white');
            if (line) line.classList.replace('bg-brand-dark', 'bg-gray-100');
        } else {
            dot.classList.replace('bg-brand-dark', 'bg-gray-100');
            dot.classList.replace('text-white', 'text-gray-400');
            if (line) line.classList.replace('bg-brand-dark', 'bg-gray-100');
        }
    }

    // Buttons
    document.getElementById('prev-step-btn').textContent = step === 1 ? "CANCELAR" : "ANTERIOR";
    if (step === 4) {
        document.getElementById('next-step-btn').classList.add('hidden');
        document.getElementById('final-save-btn').classList.remove('hidden');
    } else {
        document.getElementById('next-step-btn').classList.remove('hidden');
        document.getElementById('final-save-btn').classList.add('hidden');
    }
}

function nextStep() {
    if (currentStep < 4) renderStep(currentStep + 1);
}

function prevStep() {
    if (currentStep === 1) closeModal();
    else renderStep(currentStep - 1);
}

function renderAuthorSelect() {
    const select = document.getElementById('author-select');
    select.innerHTML = '<option value="">-- Selecione para adicionar --</option>';
    allAuthors.forEach(a => {
        select.innerHTML += `<option value="${a.id}">${a.name}</option>`;
    });
}

function renderSelectedAuthors() {
    const list = document.getElementById('selected-authors-list');
    list.innerHTML = '';
    if (selectedAuthors.length === 0) {
        list.innerHTML = '<span class="text-xs text-gray-300 font-medium italic m-auto">Nenhum autor selecionado...</span>';
        return;
    }

    selectedAuthors.forEach(auth => {
        const chip = document.createElement('div');
        chip.className = "flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 group animate-scale-up";
        chip.innerHTML = `
            <span class="text-sm font-bold text-brand-dark">${auth.name}</span>
            <button type="button" class="w-5 h-5 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                <i data-lucide="x" class="w-3 h-3"></i>
            </button>
        `;
        chip.querySelector('button').onclick = () => {
            selectedAuthors = selectedAuthors.filter(a => a.id !== auth.id);
            renderSelectedAuthors();
        };
        list.appendChild(chip);
    });

    if (window.lucide) window.lucide.createIcons();
}

async function handleSave(e) {
    e.preventDefault();
    if (selectedAuthors.length === 0) {
        alert("Selecione pelo menos um autor.");
        renderStep(2);
        return;
    }

    const btn = document.getElementById('final-save-btn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>';

    const bookData = {
        id: document.getElementById('book-id').value,
        title: document.getElementById('book-title').value,
        genre: document.getElementById('book-genre').value,
        price: parseFloat(document.getElementById('book-price').value),
        category: document.getElementById('book-category').value,
        coverUrl: document.getElementById('book-cover').value,
        featured: document.getElementById('book-featured').checked,
        stock: parseInt(document.getElementById('book-stock').value),
        description: document.getElementById('book-description').value,

        authors: selectedAuthors,
        authorId: selectedAuthors[0].id,
        author: selectedAuthors[0].name,
        authorIds: selectedAuthors.map(a => a.id),

        format: document.getElementById('book-format').value,
        launchDate: document.getElementById('book-launch-date').value,
        digitalFileUrl: document.getElementById('book-digital-url').value,

        accountHolder: document.getElementById('bank-holder').value,
        iban: document.getElementById('bank-iban').value,
        accountNumber: document.getElementById('bank-number').value,
        express: document.getElementById('bank-express').value,

        editor: document.getElementById('tech-editor').value,
        diagramador: document.getElementById('tech-diagramador').value,
        paginador: document.getElementById('tech-paginador').value,
        capa: document.getElementById('tech-capa').value,
        revisor: document.getElementById('tech-revisor').value,
        isbn: document.getElementById('tech-isbn').value,
        depositoLegal: document.getElementById('tech-deposito').value
    };

    try {
        await saveBook(bookData);
        closeModal();
        loadBooks();
    } catch (error) {
        console.error("Error saving book:", error);
        alert("Erro ao gravar obra.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

async function handleDelete(id, title) {
    if (confirm(`Eliminar "${title}" permanentemente?`)) {
        try {
            await deleteBook(id);
            loadBooks();
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    }
}

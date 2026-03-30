import { onAuth } from './auth.js';
import { db } from './firebase-config.js';
import {
    collection,
    getDocs,
    updateDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let allManuscripts = [];

onAuth((user) => {
    if (!user || user.role !== 'adm') {
        window.location.href = '/login';
        return;
    }
    loadManuscripts();
});

async function loadManuscripts() {
    const loader = document.getElementById('admin-manuscripts-loading');
    const grid = document.getElementById('admin-manuscripts-grid');
    const emptyState = document.getElementById('manuscript-empty-state');

    try {
        const q = query(collection(db, "manuscripts"), orderBy("submittedDate", "desc"));
        const snapshot = await getDocs(q);
        allManuscripts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        renderManuscripts(allManuscripts);
        loader.classList.add('hidden');

        if (allManuscripts.length === 0) {
            emptyState.classList.remove('hidden');
            grid.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            grid.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Error loading manuscripts:", error);
    }
}

function renderManuscripts(manuscripts) {
    const grid = document.getElementById('admin-manuscripts-grid');
    grid.innerHTML = '';

    manuscripts.forEach(m => {
        const card = document.createElement('div');
        card.className = "group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden";

        const statusColors = {
            pending: 'bg-amber-50 text-amber-600 border-amber-100',
            review: 'bg-blue-50 text-blue-600 border-blue-100',
            approved: 'bg-green-50 text-green-600 border-green-100',
            rejected: 'bg-red-50 text-red-600 border-red-100',
            published: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
        };

        card.innerHTML = `
            <div class="p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                <div class="shrink-0 flex flex-col items-center gap-4">
                    <div class="w-16 h-16 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                        <i data-lucide="file-text" class="w-8 h-8"></i>
                    </div>
                    <div class="px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${statusColors[m.status] || statusColors.pending}">
                        ${m.status || 'pending'}
                    </div>
                </div>

                <div class="flex-1 min-w-0">
                    <span class="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary mb-1 block">
                        ${m.genre || 'Género'}
                    </span>
                    <h3 class="text-xl font-black text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                        ${m.title}
                    </h3>
                    <div class="flex flex-wrap items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span class="flex items-center gap-2"><i data-lucide="user" class="w-3 h-3"></i> ${m.authorName}</span>
                        <span class="flex items-center gap-2"><i data-lucide="book-open" class="w-3 h-3"></i> ${m.pages || '?'} Páginas</span>
                        <span class="flex items-center gap-2"><i data-lucide="clock" class="w-3 h-3"></i> ${new Date(m.submittedDate).toLocaleDateString()}</span>
                    </div>
                </div>

                <div class="flex items-center gap-3 shrink-0 self-center lg:self-auto pt-4 lg:pt-0">
                    <a href="${m.fileUrl}" target="_blank" class="p-4 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-2xl transition-all shadow-sm flex items-center gap-3">
                        <i data-lucide="download" class="w-5 h-5"></i>
                        <span class="text-[9px] font-black uppercase tracking-widest hidden sm:block">BAIXAR</span>
                    </a>
                    
                    <div class="w-px h-8 bg-gray-100 hidden lg:block"></div>

                    <div class="flex items-center gap-2">
                        <select class="status-select px-4 py-3 bg-gray-50 border-none rounded-2xl text-[9px] font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-gray-100 transition-colors" data-id="${m.id}">
                            <option value="pending" ${m.status === 'pending' ? 'selected' : ''}>Pendente</option>
                            <option value="review" ${m.status === 'review' ? 'selected' : ''}>Em Análise</option>
                            <option value="approved" ${m.status === 'approved' ? 'selected' : ''}>Aprovado</option>
                            <option value="rejected" ${m.status === 'rejected' ? 'selected' : ''}>Rejeitado</option>
                            <option value="published" ${m.status === 'published' ? 'selected' : ''}>Publicado</option>
                        </select>
                    </div>
                </div>
            </div>
        `;

        card.querySelector('.status-select').addEventListener('change', (e) => updateStatus(m.id, e.target.value));

        grid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
}

async function updateStatus(id, status) {
    try {
        await updateDoc(doc(db, "manuscripts", id), {
            status: status,
            reviewedDate: new Date().toISOString()
        });
        loadManuscripts(); // Reload to refresh UI
    } catch (error) {
        console.error("Error updating status:", error);
    }
}

// Filters & Search
document.getElementById('manuscript-search').addEventListener('input', (e) => {
    filterData();
});

document.getElementById('status-filter').addEventListener('change', (e) => {
    filterData();
});

function filterData() {
    const term = document.getElementById('manuscript-search').value.toLowerCase();
    const status = document.getElementById('status-filter').value;

    const filtered = allManuscripts.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(term) || m.authorName.toLowerCase().includes(term);
        const matchesStatus = status === 'all' || m.status === status;
        return matchesSearch && matchesStatus;
    });

    renderManuscripts(filtered);
}

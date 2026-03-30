/**
 * Editora Graça — Admin: Manuscripts Controller
 */
import { db } from './firebase-config.js';
import { collection, query, getDocs, orderBy, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let allManuscripts = [];

document.addEventListener('DOMContentLoaded', async () => {
    loadManuscripts();

    const searchInput = document.getElementById('manuscript-search');
    const filterSelect = document.getElementById('manuscript-filter');

    searchInput?.addEventListener('input', () => filterAndRender());
    filterSelect?.addEventListener('change', () => filterAndRender());
});

async function loadManuscripts() {
    const list = document.getElementById('manuscripts-list');
    try {
        const q = query(collection(db, 'manuscripts'), orderBy('submittedDate', 'desc'));
        const snapshot = await getDocs(q);
        allManuscripts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        filterAndRender();
    } catch (error) {
        console.error("Error loading manuscripts:", error);
        if (list) list.innerHTML = '<p class="text-xs text-red-500 font-bold uppercase tracking-widest text-center py-20">Erro ao carregar dados.</p>';
    }
}

function filterAndRender() {
    const list = document.getElementById('manuscripts-list');
    const searchTerm = document.getElementById('manuscript-search')?.value.toLowerCase() || '';
    const filterStatus = document.getElementById('manuscript-filter')?.value || 'all';

    if (!list) return;

    const filtered = allManuscripts.filter(m => {
        const matchesSearch = (m.title?.toLowerCase().includes(searchTerm) || m.authorName?.toLowerCase().includes(searchTerm));
        const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        list.innerHTML = '<div class="py-20 text-center"><p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhum manuscrito encontrado</p></div>';
        return;
    }

    list.innerHTML = '';
    filtered.forEach((m, i) => {
        const date = m.submittedDate ? new Date(m.submittedDate).toLocaleDateString() : 'N/A';
        const html = `
            <div class="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden animate-fade-in" style="animation-delay: ${i * 0.05}s">
                <div class="p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                    <div class="shrink-0 flex flex-col items-center gap-4">
                        <div class="w-16 h-16 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                            <i data-lucide="file-text" class="w-8 h-8"></i>
                        </div>
                        <div class="px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusColor(m.status)}">
                            ${m.status || 'pending'}
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <span class="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-1 block">${m.genre || 'Inconclusivo'}</span>
                        <h3 class="text-xl font-black text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">${m.title}</h3>
                        <div class="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span class="flex items-center gap-2"><i data-lucide="user" class="w-3 h-3"></i> ${m.authorName}</span>
                            <span>•</span>
                            <span class="flex items-center gap-2"><i data-lucide="book-open" class="w-3 h-3"></i> ${m.pages || '?'} Páginas</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                        <a href="${m.fileUrl}" target="_blank" class="p-4 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-2xl transition-all shadow-sm flex items-center gap-3">
                            <i data-lucide="download" class="w-5 h-5"></i>
                            <span class="text-[10px] font-black uppercase tracking-widest hidden sm:block">PDF</span>
                        </a>
                        <div class="w-px h-8 bg-gray-100 mx-2"></div>
                        <div class="flex items-center gap-2">
                           ${m.status === 'pending' ? `<button onclick="updateStatus('${m.id}', 'review')" class="px-4 py-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Analisar</button>` : ''}
                           ${(m.status === 'pending' || m.status === 'review') ? `
                                <button onclick="updateStatus('${m.id}', 'approved')" class="p-3 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all" title="Aprovar"><i data-lucide="check-circle" class="w-5 h-5"></i></button>
                                <button onclick="updateStatus('${m.id}', 'rejected')" class="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all" title="Rejeitar"><i data-lucide="x-circle" class="w-5 h-5"></i></button>
                           ` : ''}
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50/50 px-8 py-3 border-t border-gray-50 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-400">
                    <div class="flex items-center gap-4">
                        <span class="flex items-center gap-2"><i data-lucide="clock" class="w-3 h-3"></i> Submetido em ${date}</span>
                        ${m.email ? `<span class="flex items-center gap-2"><i data-lucide="mail" class="w-3 h-3"></i> ${m.email}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
        list.insertAdjacentHTML('beforeend', html);
    });

    if (window.lucide) window.lucide.createIcons();
}

function getStatusColor(status) {
    switch (status) {
        case 'approved': return 'bg-green-50 text-green-600 border-green-100';
        case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
        case 'review': return 'bg-blue-50 text-blue-600 border-blue-100';
        case 'published': return 'bg-brand-primary/10 text-brand-primary border-brand-primary/20';
        default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
}

window.updateStatus = async (id, newStatus) => {
    try {
        const docRef = doc(db, 'manuscripts', id);
        await updateDoc(docRef, {
            status: newStatus,
            reviewedDate: new Date().toISOString()
        });
        allManuscripts = allManuscripts.map(m => m.id === id ? { ...m, status: newStatus } : m);
        filterAndRender();
        alert(`Manuscrito atualizado para: ${newStatus}`);
    } catch (error) {
        console.error("Error updating status:", error);
        alert("Erro ao atualizar estado.");
    }
}

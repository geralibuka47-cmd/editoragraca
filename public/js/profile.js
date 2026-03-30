/**
 * Editora Graça — Profile Logic (Vanila JS)
 */
import { onAuth, logout } from './auth.js';
import { reinitIcons } from './utils.js';

let currentUser = null;
let activeTab = 'library';

const loadingOverlay = document.getElementById('profile-loading');
const mainContainer = document.getElementById('profile-main');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const userAvatar = document.getElementById('user-avatar');
const userRoleBadge = document.getElementById('user-role-badge');
const logoutBtn = document.getElementById('btn-logout');
const tabBtns = document.querySelectorAll('.profile-tab');
const tabContent = document.getElementById('tab-content');

document.addEventListener('DOMContentLoaded', () => {
    onAuth((user) => {
        if (!user) {
            window.location.href = '/login';
            return;
        }

        currentUser = user;
        renderHeader();
        renderTab(activeTab);

        loadingOverlay.classList.add('hidden');
        mainContainer.classList.remove('hidden');
        reinitIcons(mainContainer);
    });

    setupListeners();
});

function renderHeader() {
    userName.textContent = currentUser.name;
    userEmail.textContent = currentUser.email;
    userAvatar.textContent = currentUser.name.charAt(0);

    const roleMap = {
        'adm': 'Administrador',
        'autor': 'Autor Verificado',
        'leitor': 'Leitor Membro'
    };
    userRoleBadge.textContent = roleMap[currentUser.role] || 'Membro';
}

function setupListeners() {
    logoutBtn?.addEventListener('click', async () => {
        if (confirm('Tem a certeza que deseja terminar sessão?')) {
            await logout();
        }
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            activeTab = btn.dataset.tab;

            // UI Toggle
            tabBtns.forEach(b => {
                b.classList.remove('active', 'bg-brand-primary', 'text-white', 'shadow-lg');
                b.classList.add('text-gray-400');
            });
            btn.classList.add('active', 'bg-brand-primary', 'text-white', 'shadow-lg');
            btn.classList.remove('text-gray-400');

            renderTab(activeTab);
        });
    });
}

function renderTab(tab) {
    if (tab === 'library') {
        tabContent.innerHTML = `
            <div class="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 animate-fade-in">
                <i data-lucide="book-open" class="w-16 h-16 text-gray-200 mx-auto mb-4"></i>
                <h3 class="text-xl font-black text-brand-dark uppercase">Biblioteca Vazia</h3>
                <p class="text-gray-400 text-sm mt-2 mb-8">As obras digitais que adquirir aparecerão aqui.</p>
                <a href="/livros" class="inline-flex items-center gap-3 px-8 py-4 bg-brand-dark text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/10">
                    Explorar Catálogo <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
            </div>
        `;
    } else if (tab === 'favorites') {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

        if (wishlist.length === 0) {
            tabContent.innerHTML = `
                <div class="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 animate-fade-in">
                    <i data-lucide="heart" class="w-16 h-16 text-gray-200 mx-auto mb-4"></i>
                    <h3 class="text-xl font-black text-brand-dark uppercase">Sem Favoritos</h3>
                    <p class="text-gray-400 text-sm mt-2">Guarde as obras que mais gosta para ler mais tarde.</p>
                </div>
            `;
        } else {
            // Render wishlist cards... 
            tabContent.innerHTML = `
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
                   ${wishlist.map(book => `
                        <div class="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm group">
                            <div class="aspect-[2/3] rounded-2xl overflow-hidden mb-4">
                                <img src="${book.coverUrl}" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500">
                            </div>
                            <h4 class="font-black text-brand-dark uppercase text-[11px] truncate">${book.title}</h4>
                            <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">${book.author}</p>
                            <a href="/livro/${book.slug || ''}" class="mt-4 block w-full py-3 bg-brand-primary/10 text-brand-primary text-center rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all">Ver Obra</a>
                        </div>
                   `).join('')}
                </div>
            `;
        }
    } else if (tab === 'settings') {
        tabContent.innerHTML = `
            <div class="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm max-w-2xl mx-auto space-y-8 animate-fade-in">
                <h3 class="text-xs font-black uppercase tracking-[0.4em] text-brand-primary border-b border-gray-50 pb-4">Definições da Conta</h3>
                
                <div class="space-y-4">
                    <div class="flex flex-col gap-1">
                        <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Nome de Apresentação</span>
                        <span class="font-bold text-brand-dark text-sm p-4 bg-gray-50 rounded-2xl">${currentUser.name}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">E-mail Registado</span>
                        <span class="font-bold text-brand-dark text-sm p-4 bg-gray-50 rounded-2xl">${currentUser.email}</span>
                    </div>
                </div>

                <div class="pt-4">
                    <button class="text-brand-primary font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-2">
                        <i data-lucide="lock" class="w-3 h-3"></i> Alterar Palavra-passe
                    </button>
                </div>
            </div>
        `;
    }
    reinitIcons(tabContent);
}

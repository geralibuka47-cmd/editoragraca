/**
 * Editora Graça — Admin Logic (Vanila JS)
 */
import { onAuth } from './auth.js';
import { reinitIcons } from './utils.js';
import { getBooksMinimal } from './books.js';
import { db } from './firebase-config.js';
import { collection, getDocs, query } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const loadingOverlay = document.getElementById('admin-loading');
const mainContainer = document.getElementById('admin-main');

document.addEventListener('DOMContentLoaded', () => {
    onAuth((user) => {
        if (!user || user.role !== 'adm') {
            window.location.href = '/login';
            return;
        }

        renderDashboard();

        loadingOverlay.classList.add('hidden');
        mainContainer.classList.remove('hidden');
        reinitIcons(mainContainer);
    });
});

async function renderDashboard() {
    try {
        const [books, usersSnap, manuscriptsSnap] = await Promise.all([
            getBooksMinimal(),
            getDocs(collection(db, "users")),
            getDocs(collection(db, "manuscripts"))
        ]);

        // Stats Update
        const statBooks = document.getElementById('stat-books');
        if (statBooks) statBooks.textContent = books.length;

        const statUsers = document.getElementById('stat-users');
        if (statUsers) statUsers.textContent = usersSnap.size;

        const statManuscripts = document.getElementById('stat-manuscripts');
        if (statManuscripts) statManuscripts.textContent = manuscriptsSnap.size;

        const statSales = document.getElementById('stat-sales');
        if (statSales) statSales.textContent = '0'; // Logic for orders pending

        // Recent Orders Placeholder (More complex logic needed for real data)
        const recentOrdersContainer = document.getElementById('recent-orders');
        if (recentOrdersContainer) {
            recentOrdersContainer.innerHTML = '<p class="text-[10px] font-bold text-gray-300 uppercase tracking-widest text-center py-8">Funcionalidade em desenvolvimento...</p>';
        }

        // Recent Users (Show last 3)
        const recentUsersContainer = document.getElementById('recent-users');
        if (recentUsersContainer) {
            const lastUsers = usersSnap.docs.slice(-3).reverse();
            recentUsersContainer.innerHTML = '';
            lastUsers.forEach(doc => {
                const u = doc.data();
                const item = document.createElement('div');
                item.className = "flex items-center justify-between p-4 bg-gray-50 rounded-2xl";
                item.innerHTML = `
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-black text-xs uppercase">${(u.name || 'U').charAt(0)}</div>
                        <div>
                            <p class="text-xs font-black text-brand-dark">${u.name || 'Sem nome'}</p>
                            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">${u.role || 'Leitor'}</p>
                        </div>
                    </div>
                `;
                recentUsersContainer.appendChild(item);
            });
        }

    } catch (error) {
        console.error("Error rendering dashboard:", error);
    }

    reinitIcons(mainContainer);
}

/**
 * Editora Graça — Admin Users Logic (Vanila JS)
 */
import { onAuth } from './auth.js';
import { reinitIcons } from './utils.js';
import { db } from './firebase-config.js';
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const loadingOverlay = document.getElementById('admin-loading');
const mainContainer = document.getElementById('admin-main');
const usersList = document.getElementById('admin-users-list');

document.addEventListener('DOMContentLoaded', () => {
    onAuth((user) => {
        if (!user || user.role !== 'adm') {
            window.location.href = '/login';
            return;
        }

        loadUsers();

        loadingOverlay.classList.add('hidden');
        mainContainer.classList.remove('hidden');
        reinitIcons(mainContainer);
    });
});

async function loadUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        renderUsers(users);
    } catch (err) {
        console.error('Error loading users:', err);
        renderUsers([]);
    }
}

function renderUsers(users) {
    if (users.length === 0) {
        usersList.innerHTML = '<tr><td colspan="4" class="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">Nenhum utilizador encontrado.</td></tr>';
        return;
    }

    usersList.innerHTML = users.map(user => `
        <tr class="hover:bg-gray-50/50 transition-all group">
            <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-xs uppercase text-gray-400">
                        ${(user.name || 'U').charAt(0)}
                    </div>
                    <div class="flex flex-col">
                        <span class="font-black text-brand-dark uppercase text-[11px]">${user.name || 'Sem Nome'}</span>
                        <span class="text-[9px] text-gray-400 font-bold tracking-widest">${user.email}</span>
                    </div>
                </div>
            </td>
            <td class="px-8 py-6">
                <span class="text-[10px] font-black uppercase tracking-widest ${user.role === 'adm' ? 'text-brand-primary' : 'text-gray-400'}">${user.role}</span>
            </td>
            <td class="px-8 py-6">
                <span class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest">Ativo</span>
            </td>
            <td class="px-8 py-6 text-right space-x-2">
                <button class="p-3 hover:bg-brand-primary/10 text-brand-primary rounded-xl transition-all">
                    <i data-lucide="edit-3" class="w-4 h-4"></i>
                </button>
                <button class="delete-user-btn p-3 hover:bg-red-50 text-red-500 rounded-xl transition-all" data-id="${user.id}" data-name="${user.name}">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </td>
        </tr>
    `).join('');

    reinitIcons(usersList);
}

// Event Delegation for Actions
usersList.onclick = async (e) => {
    const deleteBtn = e.target.closest('.delete-user-btn');
    if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        const name = deleteBtn.dataset.name;
        if (confirm(`Eliminar utilizador "${name}" permanentemente?`)) {
            try {
                await deleteDoc(doc(db, "users", id));
                loadUsers();
            } catch (err) {
                console.error("Error deleting user:", err);
                alert("Erro ao eliminar utilizador.");
            }
        }
    }
};

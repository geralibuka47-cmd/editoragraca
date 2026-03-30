import { onAuth } from './auth.js';
import { db } from './firebase-config.js';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let allMembers = [];

onAuth((user) => {
    if (!user || user.role !== 'adm') {
        window.location.href = '/login';
        return;
    }
    loadMembers();
});

async function loadMembers() {
    const loader = document.getElementById('admin-team-loading');
    const list = document.getElementById('admin-team-list');
    const emptyState = document.getElementById('team-empty-state');

    try {
        const q = query(collection(db, "team"), orderBy("displayOrder", "asc"));
        const snapshot = await getDocs(q);
        allMembers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        renderMembers(allMembers);
        loader.classList.add('hidden');

        if (allMembers.length === 0) {
            emptyState.classList.remove('hidden');
            list.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            list.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Error loading team:", error);
    }
}

function renderMembers(members) {
    const list = document.getElementById('admin-team-list');
    list.innerHTML = '';

    members.forEach(member => {
        const item = document.createElement('div');
        item.className = "group bg-white p-5 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col sm:flex-row items-center gap-6";
        item.innerHTML = `
            <div class="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shadow-md shrink-0 group-hover:scale-105 transition-transform duration-500 border-2 border-white">
                <img src="${member.photoUrl || 'https://via.placeholder.com/150'}" alt="" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 text-center sm:text-left min-w-0">
                <div class="flex items-center justify-center sm:justify-start gap-3 mb-1">
                    <h3 class="text-lg font-black text-brand-dark truncate group-hover:text-brand-primary transition-colors">${member.name}</h3>
                    <span class="px-2 py-0.5 bg-gray-100 rounded text-[8px] font-bold text-gray-400 tabular-nums">#${member.displayOrder}</span>
                </div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
                    <i data-lucide="award" class="w-3 h-3 text-brand-primary"></i> ${member.role}
                </p>
            </div>
            <div class="hidden lg:flex items-center gap-4 px-8 border-x border-gray-50">
                ${member.socials?.instagram ? '<i data-lucide="instagram" class="w-4 h-4 text-pink-500/40"></i>' : ''}
                ${member.socials?.linkedin ? '<i data-lucide="linkedin" class="w-4 h-4 text-blue-500/40"></i>' : ''}
            </div>
            <div class="flex items-center gap-2">
                <button class="edit-btn p-3 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-2xl transition-all" data-id="${member.id}">
                    <i data-lucide="edit-2" class="w-4 h-4"></i>
                </button>
                <button class="delete-btn p-3 bg-gray-50 hover:bg-red-500 hover:text-white rounded-2xl transition-all text-red-500" data-id="${member.id}">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `;

        item.querySelector('.edit-btn').addEventListener('click', () => openModal(member));
        item.querySelector('.delete-btn').addEventListener('click', () => deleteMember(member.id, member.name));

        list.appendChild(item);
    });

    if (window.lucide) window.lucide.createIcons();
}

// Modal Logic
const modal = document.getElementById('member-modal');
const form = document.getElementById('member-form');

document.getElementById('add-member-btn').addEventListener('click', () => openModal());
document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('cancel-member').addEventListener('click', closeModal);

function openModal(member = null) {
    const title = document.getElementById('modal-title');
    const saveBtn = document.getElementById('save-member-btn');

    if (member) {
        title.textContent = "EDITAR MEMBRO";
        saveBtn.textContent = "ATUALIZAR MEMBRO";
        document.getElementById('member-id').value = member.id;
        document.getElementById('member-name').value = member.name;
        document.getElementById('member-role').value = member.role;
        document.getElementById('member-dept').value = member.department || '';
        document.getElementById('member-order').value = member.displayOrder;
        document.getElementById('member-photo').value = member.photoUrl;
        document.getElementById('member-insta').value = member.socials?.instagram || '';
        document.getElementById('member-linkedin').value = member.socials?.linkedin || '';
        document.getElementById('member-bio').value = member.bio || '';
    } else {
        title.textContent = "NOVO MEMBRO";
        saveBtn.textContent = "ADICIONAR MEMBRO";
        form.reset();
        document.getElementById('member-id').value = '';
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('member-id').value;
    const data = {
        name: document.getElementById('member-name').value,
        role: document.getElementById('member-role').value,
        department: document.getElementById('member-dept').value,
        displayOrder: parseInt(document.getElementById('member-order').value),
        photoUrl: document.getElementById('member-photo').value,
        socials: {
            instagram: document.getElementById('member-insta').value,
            linkedin: document.getElementById('member-linkedin').value
        },
        bio: document.getElementById('member-bio').value
    };

    try {
        if (id) {
            await updateDoc(doc(db, "team", id), data);
        } else {
            await addDoc(collection(db, "team"), data);
        }
        closeModal();
        loadMembers();
    } catch (error) {
        console.error("Error saving member:", error);
    }
});

async function deleteMember(id, name) {
    if (confirm(`Eliminar o membro "${name}" da equipa?`)) {
        try {
            await deleteDoc(doc(db, "team", id));
            loadMembers();
        } catch (error) {
            console.error("Error deleting member:", error);
        }
    }
}

// Search
document.getElementById('member-search').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allMembers.filter(m =>
        m.name.toLowerCase().includes(term) ||
        m.role.toLowerCase().includes(term)
    );
    renderMembers(filtered);
});

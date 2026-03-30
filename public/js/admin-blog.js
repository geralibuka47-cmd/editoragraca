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

let allPosts = [];

onAuth((user) => {
    if (!user || user.role !== 'adm') {
        window.location.href = '/login';
        return;
    }
    loadPosts();
});

async function loadPosts() {
    const loader = document.getElementById('admin-blog-loading');
    const grid = document.getElementById('admin-blog-grid');
    const emptyState = document.getElementById('blog-empty-state');

    try {
        const q = query(collection(db, "blog"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        renderPosts(allPosts);
        loader.classList.add('hidden');

        if (allPosts.length === 0) {
            emptyState.classList.remove('hidden');
            grid.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            grid.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Error loading posts:", error);
    }
}

function renderPosts(posts) {
    const grid = document.getElementById('admin-blog-grid');
    grid.innerHTML = '';

    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = "group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden flex flex-col";
        card.innerHTML = `
            <div class="h-48 bg-gray-100 relative overflow-hidden shrink-0">
                <img src="${post.imageUrl}" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                <div class="absolute top-4 left-4">
                    <div class="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-brand-dark shadow-sm">
                        ${new Date(post.date).toLocaleDateString()}
                    </div>
                </div>
            </div>
            <div class="p-8 flex-1 flex flex-col">
                <h3 class="text-xl font-black text-brand-dark mb-4 group-hover:text-brand-primary transition-colors line-clamp-2">${post.title}</h3>
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <i data-lucide="user" class="w-4 h-4"></i>
                    </div>
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${post.author}</span>
                </div>
                <div class="mt-auto pt-6 border-t border-gray-50 flex items-center justify-end gap-2">
                    <button class="edit-btn p-3 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-xl transition-all" data-id="${post.id}">
                        <i data-lucide="edit-2" class="w-4 h-4"></i>
                    </button>
                    <button class="delete-btn p-3 bg-gray-50 hover:bg-red-500 hover:text-white rounded-xl transition-all text-red-500" data-id="${post.id}">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `;

        card.querySelector('.edit-btn').addEventListener('click', () => openModal(post));
        card.querySelector('.delete-btn').addEventListener('click', () => deletePost(post.id, post.title));

        grid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
}

// Modal Logic
const modal = document.getElementById('post-modal');
const form = document.getElementById('post-form');

document.getElementById('add-post-btn').addEventListener('click', () => openModal());
document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('cancel-post').addEventListener('click', closeModal);

function openModal(post = null) {
    const title = document.getElementById('modal-title');
    const saveBtn = document.getElementById('save-post-btn');

    if (post) {
        title.textContent = "EDITAR ARTIGO";
        saveBtn.textContent = "GUARDAR ALTERAÇÕES";
        document.getElementById('post-id').value = post.id;
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-author').value = post.author;
        document.getElementById('post-image').value = post.imageUrl;
        document.getElementById('post-content').value = post.content;
    } else {
        title.textContent = "NOVO ARTIGO";
        saveBtn.textContent = "PUBLICAR ARTIGO";
        form.reset();
        document.getElementById('post-id').value = '';
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
    const id = document.getElementById('post-id').value;
    const data = {
        title: document.getElementById('post-title').value,
        author: document.getElementById('post-author').value,
        imageUrl: document.getElementById('post-image').value,
        content: document.getElementById('post-content').value,
        date: id ? allPosts.find(p => p.id === id).date : new Date().toISOString()
    };

    try {
        if (id) {
            await updateDoc(doc(db, "blog", id), data);
        } else {
            await addDoc(collection(db, "blog"), data);
        }
        closeModal();
        loadPosts();
    } catch (error) {
        console.error("Error saving post:", error);
    }
});

async function deletePost(id, title) {
    if (confirm(`Eliminar o artigo "${title}"?`)) {
        try {
            await deleteDoc(doc(db, "blog", id));
            loadPosts();
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    }
}

// Search
document.getElementById('blog-search').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allPosts.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.author.toLowerCase().includes(term)
    );
    renderPosts(filtered);
});

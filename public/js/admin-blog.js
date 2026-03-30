/**
 * Editora Graça — Admin: Blog Controller
 */
import { db } from './firebase-config.js';
import { collection, query, getDocs, orderBy, addDoc, deleteDoc, doc, Timestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let allPosts = [];

document.addEventListener('DOMContentLoaded', async () => {
    loadBlogPosts();

    const form = document.getElementById('blog-form');
    form?.addEventListener('submit', handleBlogSubmit);
});

async function loadBlogPosts() {
    const list = document.getElementById('blog-list');
    try {
        const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderPosts();
    } catch (error) {
        console.error("Error loading blog posts:", error);
        if (list) list.innerHTML = '<p class="text-xs text-red-500 font-bold uppercase tracking-widest text-center py-20 col-span-full">Erro ao carregar dados.</p>';
    }
}

function renderPosts() {
    const list = document.getElementById('blog-list');
    if (!list) return;

    if (allPosts.length === 0) {
        list.innerHTML = '<div class="col-span-full py-20 text-center"><p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhum artigo publicado</p></div>';
        return;
    }

    list.innerHTML = '';
    allPosts.forEach((post, i) => {
        const date = post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : 'N/A';
        const html = `
            <div class="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 animate-fade-in" style="animation-delay: ${i * 0.1}s">
                <div class="aspect-video relative overflow-hidden">
                    <img src="${post.imageUrl}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                         <button onclick="deletePost('${post.id}')" class="p-4 bg-red-500 text-white rounded-2xl hover:bg-brand-dark transition-all shadow-xl">
                            <i data-lucide="trash-2" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
                <div class="p-8 space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-black uppercase tracking-widest text-brand-primary">Geral</span>
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${date}</span>
                    </div>
                    <h3 class="text-xl font-black text-brand-dark uppercase tracking-tight group-hover:text-brand-primary transition-colors line-clamp-1">${post.title}</h3>
                    <p class="text-xs text-gray-500 line-clamp-2 italic">${post.content?.replace(/<[^>]*>?/gm, '')}</p>
                </div>
            </div>
        `;
        list.insertAdjacentHTML('beforeend', html);
    });

    if (window.lucide) window.lucide.createIcons();
}

window.openBlogModal = () => {
    document.getElementById('blog-modal').classList.remove('hidden');
    document.getElementById('modal-title').textContent = 'Novo Artigo';
    document.getElementById('blog-form').reset();
    document.getElementById('blog-id').value = '';
};

window.closeBlogModal = () => {
    document.getElementById('blog-modal').classList.add('hidden');
};

async function handleBlogSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('blog-title').value;
    const imageUrl = document.getElementById('blog-image').value;
    const content = document.getElementById('blog-content').value;

    try {
        await addDoc(collection(db, 'blog'), {
            title,
            imageUrl,
            content,
            author: "Administrador",
            createdAt: Timestamp.now()
        });
        alert("Artigo publicado com sucesso!");
        closeBlogModal();
        loadBlogPosts();
    } catch (error) {
        console.error("Error saving post:", error);
        alert("Erro ao publicar artigo.");
    }
}

window.deletePost = async (id) => {
    if (!confirm("Tem a certeza que deseja eliminar este artigo permanentemente?")) return;
    try {
        await deleteDoc(doc(db, 'blog', id));
        loadBlogPosts();
    } catch (error) {
        console.error("Error deleting post:", error);
        alert("Erro ao eliminar o artigo.");
    }
}

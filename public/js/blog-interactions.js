/**
 * Editora Graça — Blog Interactions Controller (Vanila JS)
 */
import {
    collection,
    query,
    getDocs,
    orderBy,
    where,
    addDoc,
    deleteDoc,
    Timestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { onAuth } from './auth.js';

let currentUser = null;
onAuth(user => {
    currentUser = user;
});

/**
 * Sets up the interaction zone for a specific post
 */
export function setupBlogInteractions(postId, container) {
    if (!container) return;

    // Initial render of the interaction zone
    renderInteractionZone(postId, container, { likesCount: 0, comments: [], isLiked: false });

    // Real-time listener for interactions
    const db = window.db;
    const likesQuery = query(collection(db, "blog_likes"), where('postId', '==', postId));
    const commentsQuery = query(
        collection(db, "blog_comments"),
        where('postId', '==', postId),
        orderBy('createdAt', 'asc')
    );

    let currentLikes = [];
    let currentComments = [];

    onSnapshot(likesQuery, (snapshot) => {
        currentLikes = snapshot.docs.map(doc => doc.data());
        console.log("Likes updated", currentLikes.length);
        updateUI(postId, container, currentLikes, currentComments);
    });

    onSnapshot(commentsQuery, (snapshot) => {
        currentComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Comments updated", currentComments.length);
        updateUI(postId, container, currentLikes, currentComments);
    });
}

function updateUI(postId, container, likes, comments) {
    const isLiked = currentUser ? likes.some(l => l.userId === currentUser.id) : false;
    renderInteractionZone(postId, container, {
        likesCount: likes.length,
        comments: comments,
        isLiked
    });
}

function renderInteractionZone(postId, container, data) {
    const { likesCount, comments, isLiked } = data;

    container.innerHTML = `
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">
            <div class="flex items-center gap-12">
                <button id="btn-like-post" class="flex items-center gap-4 transition-all ${isLiked ? 'text-brand-primary' : 'text-gray-400 hover:text-brand-dark'}">
                    <div class="p-4 rounded-2xl bg-gray-50 group-hover:bg-brand-light transition-colors">
                        <i data-lucide="heart" class="w-8 h-8 ${isLiked ? 'fill-current' : ''}"></i>
                    </div>
                    <span class="font-black text-xs uppercase tracking-widest">${likesCount} Reações</span>
                </button>
                <div class="flex items-center gap-4 text-gray-400">
                    <div class="p-4 rounded-2xl bg-gray-50">
                        <i data-lucide="message-circle" class="w-8 h-8"></i>
                    </div>
                    <span class="font-black text-xs uppercase tracking-widest">${comments.length} Comentários</span>
                </div>
            </div>
            
            <button class="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all">
                <i data-lucide="share-2" class="w-6 h-6"></i>
            </button>
        </div>

        <!-- Comments List -->
        <div class="space-y-8 pt-12 border-t border-gray-100">
            ${comments.map(c => `
                <div class="flex gap-6 pb-8 border-b border-gray-50 last:border-0 last:pb-0">
                    <div class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-primary shrink-0 border border-gray-100">
                        <i data-lucide="user" class="w-6 h-6"></i>
                    </div>
                    <div class="space-y-2 flex-grow">
                        <div class="flex items-center justify-between">
                            <p class="font-black text-[10px] uppercase tracking-widest text-brand-dark">${c.userName}</p>
                            <p class="text-[9px] text-gray-400 font-bold uppercase">${c.createdAt ? new Date(c.createdAt.seconds * 1000).toLocaleDateString() : 'Agora'}</p>
                        </div>
                        <p class="text-base text-gray-600 leading-relaxed font-medium">${c.content}</p>
                    </div>
                </div>
            `).join('')}
            ${comments.length === 0 ? '<p class="text-center py-8 text-gray-300 font-black text-[10px] uppercase tracking-widest">Nenhuma reflexão ainda. Seja o primeiro a comentar.</p>' : ''}
        </div>

        <!-- Add Comment -->
        <div class="pt-8">
            <div class="relative group">
                <textarea 
                    id="blog-comment-input"
                    placeholder="${currentUser ? 'Compartilhe a sua reflexão...' : 'Inicie sessão para participar na conversa'}" 
                    ${!currentUser ? 'disabled' : ''}
                    class="w-full h-32 px-10 py-8 bg-gray-50 rounded-[2.5rem] border-none focus:ring-4 focus:ring-brand-primary/10 text-brand-dark font-medium transition-all shadow-sm placeholder:text-gray-300 resize-none"
                ></textarea>
                <button 
                    id="btn-submit-comment"
                    ${!currentUser ? 'disabled' : ''}
                    class="absolute bottom-6 right-6 p-5 bg-brand-primary text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                >
                    <i data-lucide="send" class="w-6 h-6"></i>
                </button>
            </div>
        </div>
    `;

    // Re-init icons
    if (window.lucide) window.lucide.createIcons();

    // Event Listeners
    const btnLike = document.getElementById('btn-like-post');
    if (btnLike && currentUser) {
        btnLike.onclick = () => toggleLike(postId, currentUser.id, isLiked);
    }

    const btnSubmit = document.getElementById('btn-submit-comment');
    const commentInput = document.getElementById('blog-comment-input');
    if (btnSubmit && commentInput && currentUser) {
        btnSubmit.onclick = async () => {
            const content = commentInput.value.trim();
            if (!content) return;

            btnSubmit.disabled = true;
            try {
                await addDoc(collection(window.db, "blog_comments"), {
                    postId,
                    userId: currentUser.id,
                    userName: currentUser.name || 'Leitor Anonimo',
                    content: content,
                    createdAt: Timestamp.now()
                });
                commentInput.value = '';
            } catch (e) {
                console.error("Error adding comment:", e);
            } finally {
                btnSubmit.disabled = false;
            }
        };
    }
}

async function toggleLike(postId, userId, isLiked) {
    const db = window.db;
    try {
        if (isLiked) {
            const q = query(
                collection(db, "blog_likes"),
                where('postId', '==', postId),
                where('userId', '==', userId)
            );
            const snapshot = await getDocs(q);
            snapshot.forEach(async (docSnap) => {
                await deleteDoc(docSnap.ref);
            });
        } else {
            await addDoc(collection(db, "blog_likes"), {
                postId,
                userId,
                createdAt: Timestamp.now()
            });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
    }
}

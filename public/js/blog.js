import { db } from './firebase-config.js';
import {
    collection,
    query,
    getDocs,
    orderBy,
    where,
    doc,
    getDoc,
    limit,
    addDoc,
    Timestamp
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { reinitIcons } from './utils.js';
import { setupBlogInteractions } from './blog-interactions.js';

document.addEventListener('DOMContentLoaded', async () => {
    const blogContainer = document.getElementById('blog-main-container');
    if (!blogContainer) return;

    // Check if we are viewing a specific post (slug in URL)
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('slug');

    if (postSlug) {
        await renderSinglePost(postSlug, blogContainer);
    } else {
        await renderPostList(blogContainer);
    }
});

/**
 * Renders the full list of blog posts
 */
async function renderPostList(container) {
    try {
        const postsRef = collection(db, "blog");
        const q = query(postsRef, orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Load Custom Headlines from Config
        const configRef = doc(db, "site_content", "config");
        const configSnap = await getDoc(configRef);
        let headline = 'Crónicas & <br><span class="text-gradient-gold italic font-serif font-normal lowercase">Novidades</span>';
        let sub = 'Fique por dentro dos bastidores, eventos e reflexões sobre o mundo das letras na Editora Graça.';

        if (configSnap.exists()) {
            const data = configSnap.data();
            if (data.institutional?.newsletterTitle) headline = data.institutional.newsletterTitle.replace('\n', '<br>');
            if (data.institutional?.newsletterSubtitle) sub = data.institutional.newsletterSubtitle;
        }

        if (posts.length === 0) {
            container.innerHTML = `
                <div class="py-32 text-center">
                    <p class="text-gray-400 font-black uppercase tracking-widest text-xs">Ainda não foram publicadas crónicas.</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="container pb-24">
                <div class="flex flex-col md:flex-row justify-between items-end gap-8 mb-20 animate-fade-in">
                    <div class="space-y-4">
                        <span class="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary">O Nosso Jornal</span>
                        <h1 class="text-5xl sm:text-7xl font-black uppercase leading-none tracking-tighter text-brand-dark">
                            ${headline}
                        </h1>
                    </div>
                    <p class="text-gray-400 font-medium max-w-sm leading-relaxed text-sm">
                        ${sub}
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        `;

        posts.forEach(post => {
            const date = post.date ? new Date(post.date).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' }) : 'Recente';
            html += `
                <article onclick="window.location.href='?slug=${post.slug || post.id}'" class="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl shadow-brand-dark/5 group cursor-pointer flex flex-col h-full hover:shadow-2xl transition-all duration-500">
                    <div class="aspect-video overflow-hidden">
                        <img src="${post.imageUrl || 'https://picsum.photos/seed/blog/800/600'}" class="w-full h-full object-cover group-hover:scale-110 transition-all duration-700">
                    </div>
                    <div class="p-10 flex-grow space-y-4 flex flex-col">
                        <div class="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-brand-primary">
                            <span>Crónica</span>
                            <span class="w-1 h-1 bg-gray-200 rounded-full"></span>
                            <span class="text-gray-400">${date}</span>
                        </div>
                        <h3 class="text-2xl font-black uppercase tracking-tight text-brand-dark line-clamp-2">${post.title}</h3>
                        <p class="text-gray-400 text-sm leading-relaxed line-clamp-3">${post.content.substring(0, 120)}...</p>
                        <div class="pt-6 mt-auto">
                            <span class="inline-flex items-center gap-2 text-brand-primary font-black uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all">Ler Artigo <i data-lucide="arrow-right" class="w-4 h-4"></i></span>
                        </div>
                    </div>
                </article>
            `;
        });

        html += `
                </div>
                
                <!-- Newsletter Manifesto -->
                <section class="mt-32 py-24 bg-brand-light rounded-[4rem] relative overflow-hidden text-center space-y-10 px-8">
                     <h2 class="text-4xl md:text-6xl font-black text-brand-dark uppercase tracking-tighter leading-none">Subscreva o <br />nosso <span class="text-brand-primary italic">manifesto</span></h2>
                     <p class="text-gray-500 font-medium max-w-sm mx-auto">Receba crónicas exclusivas e convites para lançamentos diretamente no seu email.</p>
                     <div class="w-full max-w-md mx-auto relative group">
                        <input id="newsletter-email" type="email" placeholder="O seu melhor email..." class="w-full h-16 pl-8 pr-40 bg-white rounded-2xl border-none shadow-sm font-bold text-sm focus:ring-4 focus:ring-brand-primary/10">
                        <button id="btn-subscribe" class="absolute right-2 top-2 h-12 px-8 bg-brand-dark text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary transition-all">Subscrever</button>
                     </div>
                </section>
            </div>
        `;

        container.innerHTML = html;
        reinitIcons(container);
        setupNewsletter(container);
    } catch (error) {
        console.error("Error loading blog posts:", error);
    }
}

function setupNewsletter(container) {
    const btn = container.querySelector('#btn-subscribe');
    const input = container.querySelector('#newsletter-email');
    if (!btn || !input) return;

    btn.onclick = async () => {
        const email = input.value.trim();
        if (!email) return;

        btn.disabled = true;
        btn.textContent = 'Enviando...';
        try {
            await addDoc(collection(window.db, "newsletter"), {
                email: email,
                createdAt: Timestamp.now(),
                source: 'blog'
            });
            alert("Subscrição realizada com sucesso!");
            input.value = '';
        } catch (e) {
            console.error(e);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Subscrever';
        }
    };
}

/**
 * Renders a single post in detail
 */
async function renderSinglePost(slug, container) {
    try {
        const postsRef = collection(db, "blog");
        const q = query(postsRef, where("slug", "==", slug), limit(1));
        let snapshot = await getDocs(q);

        let post = null;
        if (!snapshot.empty) {
            post = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        } else {
            // Try by ID
            const docRef = doc(db, "blog", slug);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) post = { id: docSnap.id, ...docSnap.data() };
        }

        if (!post) {
            window.location.href = '/blog';
            return;
        }

        const date = post.date ? new Date(post.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

        container.innerHTML = `
            <div class="container animate-fade-in pb-32">
                <div class="max-w-4xl mx-auto">
                    <button onclick="window.location.href='/blog'" class="mb-12 flex items-center gap-3 text-brand-primary font-black uppercase text-[10px] tracking-widest group">
                        <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i> Voltar ao Jornal
                    </button>

                    <header class="space-y-8 mb-16">
                        <div class="flex items-center gap-6">
                            <span class="px-5 py-2 bg-brand-light text-brand-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                                Crónica Editorial
                            </span>
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <i data-lucide="clock" class="w-3 h-3"></i> 5 min de leitura
                            </span>
                        </div>

                        <h1 class="text-5xl md:text-8xl font-black text-brand-dark uppercase leading-[0.9] tracking-tighter">
                            ${post.title}
                        </h1>

                        <div class="flex items-center gap-8 pt-8 border-t border-gray-100 uppercase tracking-[0.2em] font-black text-[10px]">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-brand-primary border border-gray-200">
                                    <i data-lucide="user" class="w-6 h-6"></i>
                                </div>
                                <div>
                                    <p class="text-brand-dark">Por ${post.author || 'Editora Graça'}</p>
                                    <p class="text-gray-400">${date}</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div class="aspect-[16/8] rounded-[3rem] overflow-hidden shadow-2xl mb-16">
                        <img src="${post.imageUrl || 'https://picsum.photos/seed/blog/1200/600'}" class="w-full h-full object-cover">
                    </div>

                    <div class="prose prose-2xl prose-gray font-medium leading-relaxed max-w-none text-gray-700 font-serif">
                       ${post.content.split('\n').map(p => p.trim() ? `<p class="mb-8">${p}</p>` : '').join('')}
                    </div>

                    <!-- Interaction Zone -->
                    <div id="blog-interaction-zone" class="mt-24 p-12 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-brand-dark/5 space-y-12">
                       <!-- Populated by blog-interactions.js -->
                    </div>

                    <!-- Related Posts -->
                    <aside class="mt-32 pt-24 border-t border-gray-100">
                        <h2 class="text-3xl font-black uppercase tracking-tighter mb-12">Continuar a ler</h2>
                        <div id="related-posts-grid" class="grid md:grid-cols-2 gap-8">
                            <!-- JS populated -->
                        </div>
                    </aside>
                </div>
            </div>
        `;

        reinitIcons(container);
        setupBlogInteractions(post.id, document.getElementById('blog-interaction-zone'));
        loadRelatedPosts(post.id);
    } catch (error) {
        console.error("Error loading single post:", error);
    }
}

async function loadRelatedPosts(currentId) {
    try {
        const q = query(collection(db, "blog"), limit(3));
        const snapshot = await getDocs(q);
        const posts = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(p => p.id !== currentId)
            .slice(0, 2);

        const container = document.getElementById('related-posts-grid');
        if (!container) return;

        container.innerHTML = posts.map(p => `
            <div onclick="window.location.href='?slug=${p.slug || p.id}'" class="group cursor-pointer bg-gray-50 p-6 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 flex gap-6 items-center">
                <div class="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200 shrink-0">
                    <img src="${p.imageUrl}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                </div>
                <div class="space-y-2">
                    <h3 class="font-black text-sm uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-brand-primary transition-colors">${p.title}</h3>
                    <p class="text-[9px] font-black text-brand-primary uppercase tracking-widest">Ler Crónica</p>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error("Error loading related posts:", e);
    }
}

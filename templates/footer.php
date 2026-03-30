    </main>

    <footer class="bg-brand-dark text-white border-t border-white/5 font-sans safe-area-bottom">
        <div class="container mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-10">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-6">

                <!-- Logo -->
                <a href="/" class="flex items-center gap-3 shrink-0 no-underline">
                    <img src="/public/img/logo.png" alt="Editora Graça" class="h-8 w-auto brightness-0 invert opacity-80 hover:opacity-100 transition-opacity">
                    <span class="font-serif font-black text-lg tracking-tight uppercase hidden sm:inline text-white">
                        Editora <span class="text-brand-primary">Graça</span>
                    </span>
                </a>

                <!-- Icon Navigation -->
                <nav class="flex items-center gap-1 sm:gap-2" aria-label="Navegação principal">
                    <a href="/" title="Início" class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all group relative">
                        <i data-lucide="home" class="w-4 h-4"></i>
                    </a>
                    <a href="/livros" title="Catálogo" class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all group relative">
                        <i data-lucide="book-open" class="w-4 h-4"></i>
                    </a>
                    <a href="/sobre" title="Sobre" class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all group relative">
                        <i data-lucide="info" class="w-4 h-4"></i>
                    </a>
                    <a href="/servicos" title="Serviços" class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all group relative">
                        <i data-lucide="briefcase" class="w-4 h-4"></i>
                    </a>
                    <a href="/contacto" title="Contacto" class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all group relative">
                        <i data-lucide="mail" class="w-4 h-4"></i>
                    </a>
                </nav>

                <!-- Social + Copyright -->
                <div class="flex flex-col sm:flex-row items-center gap-4">
                    <div class="flex items-center gap-2">
                        <a href="https://instagram.com/editoragraca" target="_blank" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary transition-colors" aria-label="Instagram">
                            <i data-lucide="instagram" class="w-3.5 h-3.5"></i>
                        </a>
                        <a href="https://facebook.com/editoragraca" target="_blank" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary transition-colors" aria-label="Facebook">
                            <i data-lucide="facebook" class="w-3.5 h-3.5"></i>
                        </a>
                    </div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-0">
                        © <?php echo date("Y"); ?> Editora Graça · <a href="https://ibuka47.com" target="_blank" class="text-brand-primary hover:text-white no-underline transition-colors">ibuka47</a>
                    </p>
                </div>
            </div>
        </div>
    </footer>

    <!-- JS -->
    <script>
        // Initialize Lucide Icons
        lucide.createIcons();
    </script>
    <script type="module">
        import {
            onAuth
        } from '/public/js/auth.js';
        import {
            addToCart
        } from '/public/js/cart.js';
        import {
            getBookBySlug
        } from '/public/js/books.js';

        // Cart Badge Sync
        window.addEventListener('cartUpdated', (e) => {
            const count = e.detail.count;
            const badge = document.getElementById('cart-count');
            if (badge) {
                badge.textContent = count;
                if (count > 0) {
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }
        });

        // Global Add to Cart Handler (for book cards)
        window.addEventListener('requestAddToCart', async (e) => {
            const {
                slug
            } = e.detail;
            try {
                const book = await getBookBySlug(slug);
                if (book) {
                    addToCart(book);
                    alert(`"${book.title}" adicionado ao carrinho!`);
                }
            } catch (err) {
                console.error('Error adding to cart:', err);
            }
        });

        onAuth((user) => {
            const userLink = document.querySelector('a[aria-label="Minha conta"]');
            if (user && userLink) {
                userLink.href = '/perfil';
                userLink.innerHTML = `
                    <div class="flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 rounded-full border border-brand-primary/20 transition-all hover:bg-brand-primary hover:text-white group">
                        <span class="hidden sm:block text-[9px] font-black uppercase tracking-widest text-brand-dark group-hover:text-white">${user.name.split(' ')[0]}</span>
                        <i data-lucide="user" class="w-4 h-4"></i>
                    </div>
                `;
                lucide.createIcons();
            } else if (userLink) {
                userLink.href = '/login';
                userLink.innerHTML = '<i data-lucide="user" class="w-5 h-5"></i>';
                lucide.createIcons();
            }
        });
    </script>

    <!-- WhatsApp Bubble -->
    <a id="whatsapp-bubble" href="https://wa.me/244973038386" target="_blank" class="fixed bottom-8 right-8 z-[100] group" aria-label="Fale connosco no WhatsApp">
        <div class="relative">
            <div class="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 scale-150 animate-pulse"></div>
            <div class="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500 relative z-10">
                <i data-lucide="message-circle" class="w-8 h-8"></i>
            </div>
            <div class="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-6 py-3 rounded-2xl shadow-2xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 pointer-events-none whitespace-nowrap">
                <p class="text-[10px] font-black uppercase tracking-widest text-emerald-600">Fale Connosco</p>
                <p class="text-xs font-bold text-gray-500">Apoio em tempo real</p>
            </div>
        </div>
    </a>

    <!-- Footer Dynamic Sync -->
    <script type="module">
        import {
            doc,
            getDoc
        } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
        import {
            db
        } from '/public/js/firebase-config.js';

        document.addEventListener('DOMContentLoaded', async () => {
            try {
                const configRef = doc(db, "site_content", "config");
                const snap = await getDoc(configRef);
                if (snap.exists()) {
                    const data = snap.data();

                    // WhatsApp
                    if (data.contact?.whatsapp) {
                        const wa = document.getElementById('whatsapp-bubble');
                        if (wa) wa.href = `https://wa.me/${data.contact.whatsapp.replace(/\D/g, '')}`;
                    }

                    // Socials
                    if (data.socials) {
                        const fb = document.querySelector('a[href*="facebook.com"]');
                        if (fb && data.socials.facebook) fb.href = data.socials.facebook;

                        const ig = document.querySelector('a[href*="instagram.com"]');
                        if (ig && data.socials.instagram) ig.href = data.socials.instagram;
                    }

                    // Footer Description
                    if (data.institutional?.footerAbout) {
                        const desc = document.querySelector('footer p.text-sm');
                        if (desc) desc.textContent = data.institutional.footerAbout;
                    }
                }
            } catch (e) {
                console.warn("Footer sync failed:", e);
            }
        });
    </script>

    </body>

    </html>
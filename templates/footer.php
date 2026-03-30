    </main>

    <footer class="bg-brand-dark text-white section-fluid mt-auto">
        <div class="container grid-universal">
            <!-- About -->
            <div class="flex flex-col gap-6">
                <div class="flex items-center gap-3">
                    <img src="/public/img/logo.png" alt="Logo" class="h-10 w-auto brightness-0 invert opacity-80">
                    <div class="flex flex-col leading-[0.85]">
                        <span class="font-serif font-black text-[12px] uppercase tracking-tight text-white/60">Editora</span>
                        <span class="font-serif font-black text-brand-primary text-xl uppercase tracking-tighter">Graça</span>
                    </div>
                </div>
                <p class="text-sm text-white/60 max-w-xs">
                    Fundada em 2020 em Malanje, a Editora Graça é uma casa editorial angolana focada na excelência literária e na promoção de autores lusófonos.
                </p>
                <!-- Social -->
                <div class="flex gap-4">
                    <a href="https://facebook.com/editoragraca" class="p-2 bg-white/5 hover:bg-brand-primary rounded-xl transition-all" aria-label="Facebook">
                        <i data-lucide="facebook" class="w-5 h-5"></i>
                    </a>
                    <a href="https://instagram.com/editoragraca" class="p-2 bg-white/5 hover:bg-brand-primary rounded-xl transition-all" aria-label="Instagram">
                        <i data-lucide="instagram" class="w-5 h-5"></i>
                    </a>
                </div>
            </div>

            <!-- Links -->
            <div class="grid grid-cols-2 gap-8 lg:col-span-2">
                <div class="flex flex-col gap-6">
                    <h4 class="font-black uppercase tracking-widest text-xs text-brand-primary">Explorar</h4>
                    <nav class="flex flex-col gap-3">
                        <a href="/livros" class="text-sm text-white/50 hover:text-white transition-colors">Catálogo</a>
                        <a href="/blog" class="text-sm text-white/50 hover:text-white transition-colors">Blog</a>
                        <a href="/servicos" class="text-sm text-white/50 hover:text-white transition-colors">Serviços</a>
                        <a href="/projetos" class="text-sm text-white/50 hover:text-white transition-colors">Portefólio</a>
                    </nav>
                </div>
                <div class="flex flex-col gap-6">
                    <h4 class="font-black uppercase tracking-widest text-xs text-brand-primary">Institucional</h4>
                    <nav class="flex flex-col gap-3">
                        <a href="/sobre" class="text-sm text-white/50 hover:text-white transition-colors">Sobre Nós</a>
                        <a href="/contacto" class="text-sm text-white/50 hover:text-white transition-colors">Contactos</a>
                        <a href="/termos" class="text-sm text-white/50 hover:text-white transition-colors">Termos e Condições</a>
                    </nav>
                </div>
            </div>

            <!-- Newsletter Placeholder -->
            <div class="flex flex-col gap-6">
                <h4 class="font-black uppercase tracking-widest text-xs text-brand-primary">Newsletter</h4>
                <p class="text-xs text-white/40">Inscreva-se para receber novidades sobre lançamentos e eventos literários.</p>
                <form class="flex gap-2">
                    <input type="email" placeholder="Seu email" class="input-premium bg-white/5 border-white/10 text-white placeholder:text-white/20 px-4 py-2 text-sm rounded-lg flex-1">
                    <button class="btn-premium px-4 py-2" style="font-size: 10px;">OK</button>
                </form>
            </div>
        </div>

        <div class="container border-t border-white/5 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-[10px] font-bold uppercase tracking-widest text-white/20">
                &copy; <?php echo date("Y"); ?> Editora Graça. Todos os direitos reservados.
            </p>
            <div class="flex gap-6">
                <span class="text-[10px] font-bold uppercase tracking-widest text-white/20">Feito em Angola</span>
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
    <a href="https://wa.me/244973038386" target="_blank" class="fixed bottom-8 right-8 z-[100] group" aria-label="Fale connosco no WhatsApp">
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

    </body>

    </html>
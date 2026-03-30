<?php

/**
 * Editora Graça — Book Detail Page (PHP Version)
 */
$slug = $_GET['slug'] ?? '';
$pageTitle = "Carregando Obra..."; // Will be updated by JS

require_once __DIR__ . '/../templates/header.php';
?>

<div id="book-detail-content" class="min-h-screen bg-white font-sans text-brand-dark">
    <!-- Skeleton / Loading State -->
    <div id="loading-overlay" class="fixed inset-0 flex items-center justify-center bg-white z-[60]">
        <div class="flex flex-col items-center gap-4">
            <i data-lucide="loader-2" class="w-10 h-10 text-brand-primary animate-spin"></i>
            <p class="text-gray-400 text-xs font-bold uppercase tracking-widest">A carregar obra...</p>
        </div>
    </div>

    <!-- The actual content will be mirrored from BookPage.tsx but as HTML shells -->
    <div id="book-container" class="hidden">
        <!-- Hero Section -->
        <section class="bg-brand-dark text-white pt-20 pb-16 sm:pb-24 relative overflow-hidden">
            <div class="absolute inset-0 opacity-5 pointer-events-none">
                <div class="absolute top-0 right-0 w-1/2 h-full bg-brand-primary blur-[120px]"></div>
            </div>
            <div class="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
                <button onclick="window.history.back()" class="flex items-center gap-2 text-white/40 hover:text-brand-primary transition-colors text-xs font-bold uppercase tracking-widest mb-12 group">
                    <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i>
                    Voltar
                </button>

                <div class="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                    <!-- Cover -->
                    <div class="lg:col-span-4 flex justify-center lg:justify-start">
                        <div class="relative w-52 sm:w-64 lg:w-full max-w-xs aspect-[2/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                            <img id="book-cover" src="" alt="" class="w-full h-full object-cover">
                            <div id="book-format-badge" class="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10"></div>
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="lg:col-span-8 space-y-8">
                        <div class="flex flex-wrap items-center gap-3" id="book-badges">
                            <!-- Badges injected by JS -->
                        </div>

                        <div>
                            <h1 id="book-title" class="text-3xl sm:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter"></h1>
                            <p id="book-author" class="mt-4 text-xl sm:text-2xl text-gray-400 italic font-light"></p>
                        </div>

                        <!-- Stats -->
                        <div class="flex flex-wrap items-center gap-6 py-6 border-y border-white/10">
                            <div>
                                <p id="book-price" class="text-3xl font-black text-white"></p>
                                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">AOA</p>
                            </div>
                            <div class="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                <i data-lucide="eye" class="w-4 h-4 text-gray-400"></i>
                                <span id="stat-views" class="text-sm font-black">0</span>
                                <span class="text-[10px] text-gray-400 uppercase tracking-widest">vistas</span>
                            </div>
                            <div class="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                <i data-lucide="download" class="w-4 h-4 text-gray-400"></i>
                                <span id="stat-downloads" class="text-sm font-black">0</span>
                                <span class="text-[10px] text-gray-400 uppercase tracking-widest">baixados</span>
                            </div>
                            <div class="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                <i data-lucide="star" class="w-4 h-4 text-amber-500 fill-amber-500"></i>
                                <span id="stat-rating" class="text-sm font-black">—</span>
                                <span class="text-[10px] text-gray-400 uppercase tracking-widest">avaliação</span>
                            </div>
                        </div>

                        <!-- CTAs -->
                        <div class="flex flex-wrap gap-4 items-center">
                            <button id="btn-action" class="flex items-center gap-3 px-10 py-5 bg-white text-brand-dark font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-2xl">
                                <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                                <span>Adicionar ao Carrinho</span>
                            </button>

                            <button id="btn-favorite" class="p-5 rounded-2xl border-2 border-white/10 text-white/40 hover:border-brand-primary hover:text-brand-primary transition-all">
                                <i data-lucide="heart" class="w-5 h-5"></i>
                            </button>

                            <button id="btn-share" class="p-5 rounded-2xl border-2 border-white/10 text-white/40 hover:border-brand-primary hover:text-brand-primary transition-all">
                                <i data-lucide="share-2" class="w-5 h-5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Tabs Section -->
        <section class="bg-gray-50 py-16 sm:py-24">
            <div class="container mx-auto px-4 sm:px-6 md:px-12">
                <div class="grid lg:grid-cols-12 gap-12">
                    <!-- Sidebar Info -->
                    <aside class="lg:col-span-4 space-y-8">
                        <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                            <h3 class="text-xs font-black uppercase tracking-[0.4em] text-brand-primary">Ficha da Obra</h3>
                            <ul class="space-y-4" id="technical-details">
                                <!-- Technical details injected here -->
                            </ul>
                        </div>
                    </aside>

                    <!-- Main Content Tabs -->
                    <div class="lg:col-span-8">
                        <div class="flex gap-8 border-b border-gray-200 mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
                            <button class="tab-btn active pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative text-brand-dark" data-tab="sinopse">
                                Sinopse
                                <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full"></span>
                            </button>
                            <button class="tab-btn pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative text-gray-400 hover:text-gray-600" data-tab="ficha">
                                Ficha Técnica
                            </button>
                            <button class="tab-btn pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative text-gray-400 hover:text-gray-600" data-tab="avaliacoes">
                                Avaliações
                            </button>
                        </div>

                        <div id="tab-content" class="min-h-[200px]">
                            <!-- Tab content injected here -->
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <!-- Error State -->
    <div id="error-container" class="hidden min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <i data-lucide="book-open" class="w-16 h-16 text-gray-200"></i>
        <h2 id="error-message" class="text-2xl font-black text-brand-dark uppercase">Obra não encontrada</h2>
        <a href="/livros" class="px-8 py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-primary transition-all">
            Voltar ao Catálogo
        </a>
    </div>
</div>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>

<!-- Detail Logic -->
<script>
    window.bookSlug = "<?php echo $slug; ?>";
</script>
<script type="module" src="/public/js/book-detail.js"></script>
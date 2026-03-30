<?php

/**
 * Editora Graça — Catalog Page (PHP Version)
 */
$pageTitle = "Acervo Literário";
require_once __DIR__ . '/../templates/header.php';
?>

<section class="section-fluid py-20 bg-gray-50 flex flex-col items-center justify-center text-center relative overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-primary blur-[120px] rounded-full"></div>
    </div>

    <div class="container relative z-10">
        <nav class="flex items-center justify-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <a href="/" class="hover:text-brand-primary transition-colors">Início</a>
            <i data-lucide="chevron-right" class="w-3 h-3"></i>
            <span class="text-brand-dark">Acervo Literário</span>
        </nav>

        <h1 class="text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-black uppercase leading-[0.85] tracking-tighter mb-6">
            O Nosso <br><span class="text-gradient-gold italic font-serif font-normal lowercase">Catálogo</span>
        </h1>
        <p class="text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Um repositório vivo de conhecimento e cultura angolana, selecionado com rigor e paixão editorial.
        </p>
    </div>
</section>

<div class="container mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-20">
    <div class="flex flex-col lg:flex-row gap-12">
        <!-- Sidebar Filter -->
        <aside class="hidden lg:block w-80 shrink-0 space-y-10 sticky top-32 h-fit">
            <div class="bg-gray-50/50 backdrop-blur-xl p-10 rounded-[3rem] border border-gray-100 space-y-12">
                <!-- Search -->
                <div class="space-y-4">
                    <label class="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary ml-2">Pesquisa Local</label>
                    <div class="relative group">
                        <i data-lucide="search" class="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-primary transition-colors"></i>
                        <input type="text" id="catalog-search" placeholder="Título ou autor..."
                            class="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border-none text-xs font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all shadow-sm">
                    </div>
                </div>

                <!-- Genres -->
                <div class="space-y-4">
                    <label class="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary ml-2">Géneros Literários</label>
                    <div id="genre-filters" class="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        <button class="genre-btn active w-full text-left px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between group bg-brand-dark text-white" data-genre="Todos">
                            Todos
                            <i data-lucide="chevron-right" class="w-3 h-3"></i>
                        </button>
                        <!-- Genres will be injected here -->
                    </div>
                </div>

                <!-- Format -->
                <div class="space-y-4">
                    <label class="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary ml-2">Formato da Obra</label>
                    <div class="grid grid-cols-1 gap-2" id="format-filters">
                        <button class="format-btn active px-6 py-3 rounded-xl text-xs font-bold border transition-all text-center bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20" data-format="all">
                            Todos os Formatos
                        </button>
                        <button class="format-btn px-6 py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-3 bg-white text-gray-400 border-gray-100" data-format="digital">
                            <i data-lucide="layers" class="w-3 h-4"></i> E-Books
                        </button>
                        <button class="format-btn px-6 py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-3 bg-white text-gray-400 border-gray-100" data-format="físico">
                            <i data-lucide="book-copy" class="w-3 h-4"></i> Edições Físicas
                        </button>
                    </div>
                </div>

                <!-- Clear -->
                <button id="clear-filters" class="hidden w-full py-4 text-[9px] font-black uppercase tracking-widest text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                    <i data-lucide="x" class="w-3 h-3"></i> Limpar Filtros
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-grow space-y-12">
            <!-- Controls -->
            <div class="flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 p-4 rounded-[2rem] border border-gray-100 gap-4">
                <div class="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <button class="view-btn active w-10 h-10 flex items-center justify-center rounded-xl transition-all bg-brand-primary text-white shadow-md" data-view="grid">
                        <i data-lucide="layout-grid" class="w-5 h-5"></i>
                    </button>
                    <button class="view-btn w-10 h-10 flex items-center justify-center rounded-xl transition-all text-gray-300 hover:bg-gray-50" data-view="list">
                        <i data-lucide="list" class="w-5 h-5"></i>
                    </button>
                </div>

                <div class="flex-grow hidden sm:block h-[1px] bg-gray-200 mx-8"></div>

                <div class="flex items-center gap-3">
                    <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Ordenar:</span>
                    <div class="relative">
                        <select id="sort-by" class="appearance-none pl-6 pr-12 py-3 bg-white rounded-xl border border-gray-100 text-xs font-bold text-brand-dark focus:ring-4 focus:ring-brand-primary/5 cursor-pointer shadow-sm">
                            <option value="title-asc">A-Z Alfabeto</option>
                            <option value="title-desc">Z-A Alfabeto</option>
                            <option value="price-asc">Preço Crescente</option>
                            <option value="price-desc">Preço Decrescente</option>
                            <option value="newest">Recém-chegados</option>
                        </select>
                        <i data-lucide="sliders" class="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-300 pointer-events-none"></i>
                    </div>
                </div>
            </div>

            <!-- Grid -->
            <div id="catalog-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 min-h-[400px]">
                <!-- Skeleton loaders or initial content -->
                <div class="col-span-full flex flex-col items-center justify-center py-20 animate-pulse">
                    <i data-lucide="loader-2" class="w-10 h-10 text-brand-primary animate-spin mb-4"></i>
                    <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">A carregar biblioteca...</p>
                </div>
            </div>
        </main>
    </div>
</div>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>

<!-- Catalog Logic -->
<script type="module" src="/public/js/catalog.js"></script>
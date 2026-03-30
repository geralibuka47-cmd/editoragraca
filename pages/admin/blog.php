<?php

/**
 * Editora Graça — Admin: Blog/Journal (100% Parity)
 */
$pageTitle = "Gestão do Jornal";
require_once __DIR__ . '/../../templates/admin-header.php';
?>

<div class="space-y-8 animate-fade-in">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <span class="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em]">Voz Editorial</span>
            <h2 class="text-4xl sm:text-5xl font-black text-brand-dark uppercase tracking-tighter leading-none mt-2">
                Jornal <span class="text-brand-primary italic font-serif lowercase font-normal">Graça</span>
            </h2>
        </div>
        <button onclick="openBlogModal()" class="px-8 py-4 bg-brand-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-brand-primary transition-all flex items-center gap-3">
            <i data-lucide="plus" class="w-4 h-4"></i> Novo Artigo
        </button>
    </div>

    <!-- Blog Posts List -->
    <div id="blog-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="col-span-full h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
            <span class="text-xs font-bold uppercase tracking-widest">A carregar artigos...</span>
        </div>
    </div>
</div>

<!-- Blog Modal -->
<div id="blog-modal" class="fixed inset-0 z-[100] hidden">
    <div class="absolute inset-0 bg-brand-dark/20 backdrop-blur-md"></div>
    <div class="absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl animate-slide-in p-8 sm:p-12 overflow-y-auto">
        <div class="flex justify-between items-center mb-10">
            <h3 id="modal-title" class="text-3xl font-black text-brand-dark uppercase tracking-tight">Novo Artigo</h3>
            <button onclick="closeBlogModal()" class="p-4 bg-gray-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
        </div>

        <form id="blog-form" class="space-y-6">
            <input type="hidden" id="blog-id">

            <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Título do Artigo</label>
                <input type="text" id="blog-title" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none">
            </div>

            <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">URL da Imagem de Capa</label>
                <input type="url" id="blog-image" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none">
            </div>

            <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Conteúdo</label>
                <textarea id="blog-content" rows="10" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none resize-none"></textarea>
            </div>

            <button type="submit" class="w-full py-6 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-[0.4em] hover:bg-brand-primary transition-all shadow-xl">
                Publicar Agora
            </button>
        </form>
    </div>
</div>

<script type="module" src="/public/js/admin-blog.js"></script>

<?php include __DIR__ . '/../../templates/footer.php'; ?>
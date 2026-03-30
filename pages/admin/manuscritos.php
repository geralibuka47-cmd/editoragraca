<?php

/**
 * Editora Graça — Admin: Manuscritos (100% Parity)
 */
$pageTitle = "Gestão de Manuscritos";
require_once __DIR__ . '/../../templates/admin-header.php';
?>

<div class="space-y-8 animate-fade-in">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <span class="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px]">Novos Talentos</span>
            <h2 class="text-4xl sm:text-5xl font-black text-brand-dark uppercase tracking-tighter leading-none mt-2">
                Manuscritos
            </h2>
        </div>
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div class="relative flex-1 w-full text-brand-dark">
            <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
            <input
                type="text"
                id="manuscript-search"
                placeholder="Pesquisar por título ou autor..."
                class="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none">
        </div>
        <select
            id="manuscript-filter"
            class="w-full md:w-auto px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest outline-none cursor-pointer hover:bg-gray-100 transition-colors text-brand-dark">
            <option value="all">Todos os Estados</option>
            <option value="pending">⏳ Pendentes</option>
            <option value="review">🔍 Em Análise</option>
            <option value="approved">✅ Aprovados</option>
            <option value="rejected">❌ Rejeitados</option>
            <option value="published">📚 Publicados</option>
        </select>
    </div>

    <!-- Manuscripts List -->
    <div id="manuscripts-list" class="grid grid-cols-1 gap-6">
        <div class="h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
            <span class="text-xs font-bold uppercase tracking-widest">A carregar manuscritos...</span>
        </div>
    </div>
</div>

<!-- Scripts -->
<script type="module" src="/public/js/admin-manuscripts.js"></script>

<?php include __DIR__ . '/../../templates/footer.php'; ?>
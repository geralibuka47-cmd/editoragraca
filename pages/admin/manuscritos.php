<?php
$pageTitle = "Gestão de Manuscritos";
require_once __DIR__ . '/../../templates/header.php';
?>

<div class="min-h-screen bg-gray-50 pb-20">
    <div class="container mx-auto px-6 pt-32">
        <?php require_once __DIR__ . '/../../templates/admin-header.php'; ?>

        <!-- Filters & Search -->
        <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div class="relative flex-1 w-full">
                <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                <input type="text" id="manuscript-search" placeholder="Pesquisar por título ou autor..." class="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all">
            </div>
            <select id="status-filter" class="w-full md:w-auto px-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-gray-100 transition-colors">
                <option value="all">Todos os Estados</option>
                <option value="pending">⏳ Pendente</option>
                <option value="review">🔍 Em Análise</option>
                <option value="approved">✅ Aprovado</option>
                <option value="rejected">❌ Rejeitado</option>
            </select>
        </div>

        <!-- Loading State -->
        <div id="admin-manuscripts-loading" class="py-20 flex flex-col items-center gap-4">
            <div class="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">A carregar submissões...</span>
        </div>

        <!-- Manuscripts Grid -->
        <div id="admin-manuscripts-grid" class="grid grid-cols-1 gap-6 hidden">
            <!-- Manuscripts will be injected here -->
        </div>

        <!-- Empty State -->
        <div id="manuscript-empty-state" class="hidden py-32 text-center space-y-6">
            <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto text-gray-300">
                <i data-lucide="file-text" class="w-10 h-10"></i>
            </div>
            <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhum manuscrito encontrado.</p>
        </div>
    </div>
</div>

<script type="module" src="/public/js/admin-manuscripts.js"></script>

<?php require_once __DIR__ . '/../../templates/footer.php'; ?>
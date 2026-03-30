<?php

/**
 * Editora Graça — Admin Dashboard (PHP Version)
 */
$pageTitle = "Painel de Administração";
require_once __DIR__ . '/../../templates/header.php';
?>

<div id="admin-content" class="min-h-screen bg-gray-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
    <!-- Auth Guard Loading -->
    <div id="admin-loading" class="fixed inset-0 bg-white z-[60] flex items-center justify-center">
        <div class="flex flex-col items-center gap-4">
            <i data-lucide="shield-check" class="w-10 h-10 text-brand-primary animate-spin"></i>
            <p class="text-gray-400 text-xs font-black uppercase tracking-widest">A validar credenciais...</p>
        </div>
    </div>

    <div class="max-w-7xl mx-auto hidden" id="admin-main">
        <?php require_once __DIR__ . '/../../templates/admin-header.php'; ?>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" id="admin-stats">
            <!-- Stats cards here -->
            <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <i data-lucide="book-open" class="w-6 h-6"></i>
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Livros</p>
                    <p class="text-3xl font-black text-brand-dark" id="stat-books">-</p>
                </div>
            </div>

            <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <i data-lucide="shopping-cart" class="w-6 h-6"></i>
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Vendas (Mês)</p>
                    <p class="text-3xl font-black text-brand-dark" id="stat-sales">-</p>
                </div>
            </div>

            <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                    <i data-lucide="users" class="w-6 h-6"></i>
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Utilizadores</p>
                    <p class="text-3xl font-black text-brand-dark" id="stat-users">-</p>
                </div>
            </div>

            <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                    <i data-lucide="file-text" class="w-6 h-6"></i>
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Manuscritos</p>
                    <p class="text-3xl font-black text-brand-dark" id="stat-manuscripts">-</p>
                </div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="grid lg:grid-cols-2 gap-8">
            <div class="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-brand-dark/5">
                <h3 class="text-xs font-black uppercase tracking-[0.4em] text-brand-primary border-b border-gray-50 pb-6 mb-6 flex justify-between items-center">
                    Últimas Encomendas
                    <a href="/admin/encomendas" class="text-[9px] hover:underline">Ver Todas</a>
                </h3>
                <div class="space-y-4" id="recent-orders">
                    <!-- List -->
                </div>
            </div>

            <div class="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-brand-dark/5">
                <h3 class="text-xs font-black uppercase tracking-[0.4em] text-brand-primary border-b border-gray-50 pb-6 mb-6 flex justify-between items-center">
                    Novos Utilizadores
                    <a href="/admin/utilizadores" class="text-[9px] hover:underline">Gerir</a>
                </h3>
                <div class="space-y-4" id="recent-users">
                    <!-- List -->
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../../templates/footer.php'; ?>

<!-- Admin Dashboard Logic -->
<script type="module" src="/public/js/admin.js"></script>
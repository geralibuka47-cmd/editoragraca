<?php

/**
 * Editora Graça — Admin Orders Management (PHP Version)
 */
$pageTitle = "Gerir Encomendas | Administração";
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

        <!-- Orders Table -->
        <div class="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-brand-dark/5 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">ID / Data</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Cliente</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Total</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Estado</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="admin-orders-list" class="divide-y divide-gray-50">
                        <tr>
                            <td colspan="5" class="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">A carregar encomendas...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../../templates/footer.php'; ?>

<!-- Admin Orders Logic -->
<script type="module" src="/public/js/admin-orders.js"></script>
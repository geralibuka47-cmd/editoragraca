<?php

/**
 * Editora Graça — Admin Settings Page (PHP Version)
 */
$pageTitle = "Configurações";
require_once __DIR__ . '/../../templates/header.php';
?>

<div class="min-h-screen bg-gray-50 flex flex-col pt-24">
    <div class="container py-12">
        <?php require_once __DIR__ . '/../../templates/admin-header.php'; ?>

        <div id="settings-app" class="flex flex-col lg:flex-row gap-12 animate-fade-in">
            <!-- Sidebar Tabs -->
            <aside class="lg:w-64 shrink-0 space-y-2">
                <button data-tab="geral" class="tab-btn w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest bg-brand-dark text-white shadow-lg">
                    <i data-lucide="globe" class="w-4 h-4"></i> Geral
                </button>
                <button data-tab="institucional" class="tab-btn w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:text-brand-dark">
                    <i data-lucide="type" class="w-4 h-4"></i> Institucional
                </button>
                <button data-tab="social" class="tab-btn w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:text-brand-dark">
                    <i data-lucide="share-2" class="w-4 h-4"></i> Redes Sociais
                </button>
                <button data-tab="servicos" class="tab-btn w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:text-brand-dark">
                    <i data-lucide="layout" class="w-4 h-4"></i> Serviços
                </button>
                <button data-tab="seguranca" class="tab-btn w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:text-brand-dark">
                    <i data-lucide="shield" class="w-4 h-4"></i> Segurança
                </button>
            </aside>

            <!-- Main Content Area -->
            <div class="flex-1 bg-white rounded-[3.5rem] p-8 md:p-12 border border-gray-100 shadow-sm min-h-[600px] relative">
                <div id="tab-content" class="space-y-10">
                    <!-- Loading state -->
                    <div class="flex flex-col items-center justify-center py-32 gap-4">
                        <div class="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Carregando Definições...</p>
                    </div>
                </div>

                <!-- Footer Actions -->
                <div class="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                    <button id="save-settings" class="flex items-center gap-3 px-10 py-5 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all shadow-xl shadow-brand-primary/20">
                        <i data-lucide="save" class="w-4 h-4"></i> Guardar Alterações
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../../templates/footer.php'; ?>

<!-- Settings Logic -->
<script type="module" src="/public/js/admin-settings.js"></script>
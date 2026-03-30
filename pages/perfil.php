<?php

/**
 * Editora Graça — Profile Page (PHP Version)
 */
$pageTitle = "O Meu Perfil";
require_once __DIR__ . '/../templates/header.php';
?>

<div id="profile-content" class="min-h-screen bg-gray-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
    <!-- Loading Overlay -->
    <div id="profile-loading" class="fixed inset-0 bg-white z-[60] flex items-center justify-center">
        <div class="flex flex-col items-center gap-4">
            <i data-lucide="loader-2" class="w-10 h-10 text-brand-primary animate-spin"></i>
            <p class="text-gray-400 text-xs font-bold uppercase tracking-widest">A carregar perfil...</p>
        </div>
    </div>

    <div class="max-w-7xl mx-auto hidden" id="profile-main">
        <!-- Header -->
        <div class="bg-white rounded-[3rem] shadow-xl shadow-brand-dark/5 border border-gray-100 p-8 mb-12 flex flex-col md:flex-row items-center gap-8 animate-fade-in">
            <div id="user-avatar" class="w-32 h-32 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-5xl font-black uppercase overflow-hidden border-4 border-white shadow-lg">
                <!-- Letter or Image -->
            </div>

            <div class="flex-1 text-center md:text-left space-y-4">
                <div>
                    <h1 id="user-name" class="text-4xl font-black uppercase tracking-tighter text-brand-dark"></h1>
                    <p id="user-email" class="text-gray-400 font-medium"></p>
                </div>
                <div class="flex items-center justify-center md:justify-start gap-4">
                    <span id="user-role-badge" class="px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-primary/20"></span>
                </div>
            </div>

            <button id="btn-logout" class="flex items-center gap-3 px-8 py-4 border-2 border-gray-100 rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all font-black text-[10px] uppercase tracking-widest text-gray-400">
                <i data-lucide="log-out" class="w-4 h-4"></i> Terminar Sessão
            </button>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex justify-center mb-12">
            <div class="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex gap-4 overflow-x-auto no-scrollbar">
                <button class="profile-tab active px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-brand-primary text-white shadow-lg shadow-brand-primary/20" data-tab="library">
                    <i data-lucide="download" class="w-4 h-4 inline mr-2"></i> Minha Biblioteca
                </button>
                <button class="profile-tab px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all text-gray-400 hover:bg-gray-50" data-tab="favorites">
                    <i data-lucide="heart" class="w-4 h-4 inline mr-2"></i> Favoritos
                </button>
                <button class="profile-tab px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all text-gray-400 hover:bg-gray-50" data-tab="settings">
                    <i data-lucide="settings" class="w-4 h-4 inline mr-2"></i> Definições
                </button>
            </div>
        </div>

        <!-- Tab Content -->
        <div id="tab-content" class="min-h-[400px]">
            <!-- Content Injected here -->
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>

<!-- Profile Logic -->
<script type="module" src="/public/js/profile.js"></script>
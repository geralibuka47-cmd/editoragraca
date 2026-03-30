<?php

/**
 * Editora Graça — Admin: Equipa (100% Parity)
 */
$pageTitle = "Gestão da Equipa";
require_once __DIR__ . '/../../templates/admin-header.php';
?>

<div class="space-y-8 animate-fade-in">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <span class="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em]">Capital Humano</span>
            <h2 class="text-4xl sm:text-5xl font-black text-brand-dark uppercase tracking-tighter leading-none mt-2">
                Equipa <span class="text-brand-primary italic font-serif lowercase font-normal">Graça</span>
            </h2>
        </div>
        <button onclick="openTeamModal()" class="px-8 py-4 bg-brand-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-brand-primary transition-all flex items-center gap-3">
            <i data-lucide="plus" class="w-4 h-4"></i> Novo Membro
        </button>
    </div>

    <!-- Team Grid -->
    <div id="team-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="col-span-full h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
            <span class="text-xs font-bold uppercase tracking-widest">A carregar equipa...</span>
        </div>
    </div>
</div>

<!-- Team Modal -->
<div id="team-modal" class="fixed inset-0 z-[100] hidden">
    <div class="absolute inset-0 bg-brand-dark/20 backdrop-blur-md"></div>
    <div class="absolute inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl animate-slide-in p-8 sm:p-12 overflow-y-auto">
        <div class="flex justify-between items-center mb-10">
            <h3 id="modal-title" class="text-3xl font-black text-brand-dark uppercase tracking-tight">Membro da Equipa</h3>
            <button onclick="closeTeamModal()" class="p-4 bg-gray-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
        </div>

        <form id="team-form" class="space-y-6">
            <input type="hidden" id="member-id">

            <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Nome Completo</label>
                <input type="text" id="member-name" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none">
            </div>

            <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Cargo / Função</label>
                <input type="text" id="member-role" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none">
            </div>

            <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Departamento</label>
                <select id="member-dept" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none">
                    <option value="Liderança">Liderança</option>
                    <option value="Editorial">Editorial</option>
                    <option value="Design & Produção">Design & Produção</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Distribuição">Distribuição</option>
                </select>
            </div>

            <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">URL da Imagem</label>
                <input type="url" id="member-image" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none">
            </div>

            <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Bio / Descrição</label>
                <textarea id="member-bio" rows="4" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none resize-none"></textarea>
            </div>

            <button type="submit" class="w-full py-6 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-[0.4em] hover:bg-brand-primary transition-all shadow-xl">
                Guardar Membro
            </button>
        </form>
    </div>
</div>

<script type="module" src="/public/js/admin-team.js"></script>

<?php include __DIR__ . '/../../templates/footer.php'; ?>
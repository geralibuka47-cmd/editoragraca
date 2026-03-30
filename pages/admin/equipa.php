<?php
$pageTitle = "Gestão de Equipa";
require_once __DIR__ . '/../../templates/header.php';
?>

<div class="min-h-screen bg-gray-50 pb-20">
    <div class="container mx-auto px-6 pt-32">
        <?php require_once __DIR__ . '/../../templates/admin-header.php'; ?>

        <!-- Filters & Search -->
        <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
            <div class="relative flex-1">
                <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                <input type="text" id="member-search" placeholder="Pesquisar por nome ou cargo..." class="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all">
            </div>
        </div>

        <!-- Loading State -->
        <div id="admin-team-loading" class="py-20 flex flex-col items-center gap-4">
            <div class="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">A carregar equipa...</span>
        </div>

        <!-- Team List -->
        <div id="admin-team-list" class="grid grid-cols-1 gap-4 hidden">
            <!-- Members will be injected here -->
        </div>

        <!-- Empty State -->
        <div id="team-empty-state" class="hidden py-32 text-center space-y-6">
            <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto text-gray-300">
                <i data-lucide="users" class="w-10 h-10"></i>
            </div>
            <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhum membro encontrado.</p>
        </div>
    </div>
</div>

<!-- Modal -->
<div id="member-modal" class="fixed inset-0 z-[100] hidden">
    <div class="absolute inset-0 bg-brand-dark/40 backdrop-blur-md"></div>
    <div class="absolute inset-0 flex items-center justify-center p-6">
        <div class="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
            <div class="p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
                <h3 id="modal-title" class="text-2xl font-black text-brand-dark uppercase tracking-tighter">NOVO MEMBRO</h3>
                <button id="close-modal" class="p-3 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <form id="member-form" class="flex-1 overflow-y-auto p-8 space-y-8">
                <input type="hidden" id="member-id">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-6">
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nome Completo</label>
                            <input type="text" id="member-name" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" placeholder="Nome do membro">
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Cargo / Função</label>
                            <input type="text" id="member-role" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" placeholder="Diretor Editorial, etc.">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Departamento</label>
                                <input type="text" id="member-dept" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" placeholder="Editorial">
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Ordem</label>
                                <input type="number" id="member-order" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" value="0">
                            </div>
                        </div>
                    </div>
                    <div class="space-y-6">
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Foto (URL)</label>
                            <input type="url" id="member-photo" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" placeholder="https://...">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Instagram</label>
                                <input type="url" id="member-insta" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" placeholder="URL">
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">LinkedIn</label>
                                <input type="url" id="member-linkedin" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" placeholder="URL">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Biografia</label>
                    <textarea id="member-bio" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none italic" rows="4" placeholder="Breve biografia..."></textarea>
                </div>
            </form>

            <div class="p-8 border-t border-gray-50 bg-gray-50/30 flex items-center justify-end gap-4 shrink-0">
                <button type="button" id="cancel-member" class="px-8 py-4 bg-white text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-brand-dark transition-all border border-gray-100">CANCELAR</button>
                <button type="submit" form="member-form" id="save-member-btn" class="px-10 py-4 bg-brand-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/10">GUARDAR MEMBRO</button>
            </div>
        </div>
    </div>
</div>

<script type="module" src="/public/js/admin-team.js"></script>

<?php require_once __DIR__ . '/../../templates/footer.php'; ?>
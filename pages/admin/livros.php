<?php
$pageTitle = "Gestão de Livros";
require_once __DIR__ . '/../../templates/header.php';
?>

<div class="min-h-screen bg-gray-50 pb-20">
    <div class="container mx-auto px-6 pt-32">
        <?php require_once __DIR__ . '/../../templates/admin-header.php'; ?>

        <!-- Filters & Search -->
        <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div class="relative flex-1 w-full">
                <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                <input type="text" id="book-search" placeholder="Pesquisar por título ou autor..." class="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all">
            </div>
            <select id="format-filter" class="w-full md:w-auto px-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-gray-100 transition-colors">
                <option value="todos">Todos os Formatos</option>
                <option value="físico">📖 Físico</option>
                <option value="digital">📱 Digital</option>
            </select>
        </div>

        <!-- Loading State -->
        <div id="admin-books-loading" class="py-20 flex flex-col items-center gap-4">
            <div class="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">A carregar acervo...</span>
        </div>

        <!-- Books Grid -->
        <div id="admin-books-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 hidden">
            <!-- Books will be injected here -->
        </div>

        <!-- Empty State -->
        <div id="book-empty-state" class="hidden py-32 text-center space-y-6">
            <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto text-gray-300">
                <i data-lucide="book" class="w-10 h-10"></i>
            </div>
            <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhum livro encontrado.</p>
        </div>
    </div>
</div>

<!-- Modal -->
<div id="book-modal" class="fixed inset-0 z-[100] hidden">
    <div class="absolute inset-0 bg-brand-dark/40 backdrop-blur-md"></div>
    <div class="absolute inset-0 flex items-center justify-center p-6">
        <div class="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-scale-up">
            <!-- Modal Header with Progress -->
            <div class="p-8 border-b border-gray-50 shrink-0">
                <div class="flex items-center justify-between mb-8">
                    <h3 id="modal-title" class="text-2xl font-black text-brand-dark uppercase tracking-tighter">NOVA OBRA</h3>
                    <button id="close-modal" class="p-3 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <!-- Progress Indicator -->
                <div class="flex items-center gap-4">
                    <div class="flex-1 flex items-center gap-3">
                        <div id="step-dot-1" class="step-dot w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black bg-brand-dark text-white">1</div>
                        <div id="step-line-1" class="step-line h-1 flex-1 rounded-full bg-gray-100"></div>
                    </div>
                    <div class="flex-1 flex items-center gap-3">
                        <div id="step-dot-2" class="step-dot w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black bg-gray-100 text-gray-400">2</div>
                        <div id="step-line-2" class="step-line h-1 flex-1 rounded-full bg-gray-100"></div>
                    </div>
                    <div class="flex-1 flex items-center gap-3">
                        <div id="step-dot-3" class="step-dot w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black bg-gray-100 text-gray-400">3</div>
                        <div id="step-line-3" class="step-line h-1 flex-1 rounded-full bg-gray-100"></div>
                    </div>
                    <div class="flex items-center">
                        <div id="step-dot-4" class="step-dot w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black bg-gray-100 text-gray-400">4</div>
                    </div>
                </div>
                <div class="flex justify-between mt-2 px-2 text-[8px] font-black uppercase tracking-widest text-gray-400 text-center w-full">
                    <span class="w-1/4">Geral</span>
                    <span class="w-1/4">Autor</span>
                    <span class="w-1/4">Formato</span>
                    <span class="w-1/4">Ficha Técnica</span>
                </div>
            </div>

            <!-- Step Containers -->
            <form id="book-form" class="flex-1 overflow-y-auto p-8">
                <input type="hidden" id="book-id">

                <!-- Step 1: Geral -->
                <div id="step-content-1" class="step-content space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-6">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Título</label>
                                <input type="text" id="book-title" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" placeholder="Título da obra">
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Gênero</label>
                                <input type="text" id="book-genre" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" placeholder="Ex: Romance, Poesia...">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Preço (Kz)</label>
                                    <input type="number" id="book-price" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" value="0">
                                </div>
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Tipo</label>
                                    <select id="book-category" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none cursor-pointer">
                                        <option value="livro">Livro Individual</option>
                                        <option value="coletânea">Coletânea</option>
                                        <option value="antologia">Antologia</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-6">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Capa (URL)</label>
                                <input type="url" id="book-cover" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" placeholder="https://...">
                            </div>
                            <div class="flex items-center gap-6">
                                <div class="w-20 h-28 bg-gray-50 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center shrink-0">
                                    <img id="cover-preview" src="" alt="" class="w-full h-full object-cover hidden">
                                    <i data-lucide="image" class="w-6 h-6 text-gray-300" id="cover-placeholder"></i>
                                </div>
                                <div class="flex-1 space-y-4">
                                    <div class="flex items-center gap-3">
                                        <input type="checkbox" id="book-featured" class="w-5 h-5 rounded-lg border-gray-200 text-brand-primary cursor-pointer">
                                        <label for="book-featured" class="text-xs font-black text-brand-dark uppercase tracking-widest cursor-pointer">Destacar Obra</label>
                                    </div>
                                    <div class="space-y-1">
                                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Stock</label>
                                        <input type="number" id="book-stock" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none" value="0">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Sinopse</label>
                        <textarea id="book-description" rows="4" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none" placeholder="Descrição da obra..."></textarea>
                    </div>
                </div>

                <!-- Step 2: Autor -->
                <div id="step-content-2" class="step-content hidden space-y-8">
                    <div class="space-y-6">
                        <div class="space-y-4">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Adicionar Autores</label>
                            <select id="author-select" class="w-full px-8 py-6 bg-gray-50 border-none rounded-[2rem] text-lg font-black outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer">
                                <option value="">-- Selecione para adicionar --</option>
                                <!-- Authors injected via JS -->
                            </select>
                        </div>
                        <div class="space-y-3">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Autores Selecionados</label>
                            <div id="selected-authors-list" class="flex flex-wrap gap-3 min-h-[100px] p-6 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                <span class="text-xs text-gray-300 font-medium italic m-auto">Nenhum autor selecionado...</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Formato -->
                <div id="step-content-3" class="step-content hidden space-y-8">
                    <div class="p-8 bg-brand-primary/5 rounded-[2.5rem] border-2 border-brand-primary/10 space-y-8">
                        <div class="flex items-center gap-6">
                            <div class="space-y-2 flex-1">
                                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Formato da Obra</label>
                                <select id="book-format" class="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold outline-none">
                                    <option value="físico">📖 Físico</option>
                                    <option value="digital">📱 Digital</option>
                                </select>
                            </div>
                            <div class="space-y-2 flex-1">
                                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Data de Lançamento</label>
                                <input type="datetime-local" id="book-launch-date" class="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold outline-none">
                            </div>
                        </div>

                        <div id="digital-fields" class="hidden space-y-4">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Link Permanente (PDF/ePub)</label>
                            <input type="url" id="book-digital-url" class="w-full px-8 py-6 bg-white border-2 border-brand-primary/5 rounded-[2rem] text-sm font-bold outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all" placeholder="https://google.drive/...">
                        </div>

                        <div id="payment-fields" class="space-y-6">
                            <div class="flex items-center gap-2 mb-2">
                                <i data-lucide="credit-card" class="w-4 h-4 text-brand-primary"></i>
                                <span class="text-[10px] font-black uppercase tracking-widest text-brand-dark">Dados para Recebimento</span>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input type="text" id="bank-holder" class="px-6 py-4 bg-white rounded-2xl text-sm font-bold outline-none" placeholder="Titular da Conta">
                                <input type="text" id="bank-iban" class="px-6 py-4 bg-white rounded-2xl text-sm font-bold outline-none" placeholder="IBAN (AO06...)">
                                <input type="text" id="bank-number" class="px-6 py-4 bg-white rounded-2xl text-sm font-bold outline-none" placeholder="Número de Conta">
                                <input type="text" id="bank-express" class="px-6 py-4 bg-white rounded-2xl text-sm font-bold outline-none" placeholder="Express (Opcional)">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 4: Ficha Técnica -->
                <div id="step-content-4" class="step-content hidden space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Editor</label>
                            <input type="text" id="tech-editor" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none" placeholder="Nome">
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Diagramador</label>
                            <input type="text" id="tech-diagramador" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none" placeholder="Nome">
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Paginador</label>
                            <input type="text" id="tech-paginador" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none" placeholder="Nome">
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Capa por</label>
                            <input type="text" id="tech-capa" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none" placeholder="Nome">
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Revisor</label>
                            <input type="text" id="tech-revisor" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none" placeholder="Nome">
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">ISBN</label>
                            <input type="text" id="tech-isbn" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none" placeholder="978-...">
                        </div>
                        <div class="space-y-2 md:col-span-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Depósito Legal</label>
                            <input type="text" id="tech-deposito" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none" placeholder="Número">
                        </div>
                    </div>
                </div>
            </form>

            <div class="p-8 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between shrink-0">
                <button type="button" id="prev-step-btn" class="px-8 py-4 bg-white text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-brand-dark transition-all border border-gray-100">CANCELAR</button>
                <div class="flex gap-4">
                    <button type="button" id="next-step-btn" class="px-10 py-4 bg-brand-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/10">PRÓXIMO PASSO</button>
                    <button type="submit" form="book-form" id="final-save-btn" class="hidden px-10 py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20">PUBLICAR OBRA</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="module" src="/public/js/admin-books.js"></script>

<?php require_once __DIR__ . '/../../templates/footer.php'; ?>
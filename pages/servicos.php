<?php

/**
 * Editora Graça — Services Page (Full Parity Version)
 */
$pageTitle = "Serviços Editoriais & Simulador";
require_once __DIR__ . '/../templates/header.php';
?>

<section class="section-fluid py-24 bg-gray-50 overflow-hidden">
    <div class="container">
        <div class="text-center max-w-3xl mx-auto space-y-6 mb-20 animate-fade-in">
            <span class="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary">O Nosso Atelier</span>
            <h1 class="text-5xl sm:text-7xl font-black uppercase leading-none tracking-tighter text-brand-dark">
                Serviços de <br><span class="text-gradient-gold italic font-serif font-normal lowercase">Cura Literária</span>
            </h1>
            <p class="text-gray-500 font-medium leading-relaxed">
                Transformamos o seu manuscrito numa obra de arte literária, com acompanhamento personalizado em todas as fases da produção.
            </p>
        </div>

        <!-- Service Grid (6 Cards for Full Parity) -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            <!-- 1. Revisão -->
            <div class="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-brand-dark/5 space-y-6 group hover:translate-y-[-10px] transition-all duration-500">
                <div class="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <i data-lucide="edit-3" class="w-8 h-8"></i>
                </div>
                <h3 class="text-xl font-black uppercase tracking-tight text-brand-dark">Revisão & Copydesk</h3>
                <p class="text-gray-400 text-sm leading-relaxed">Refinamento linguístico e estrutural para garantir a clareza e fluidez do seu texto.</p>
                <ul class="space-y-2 text-[10px] font-black uppercase tracking-widest text-brand-primary/60">
                    <li>✓ Gramática Crítica</li>
                    <li>✓ Estilo Narrativo</li>
                </ul>
            </div>

            <!-- 2. Diagramação -->
            <div class="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-brand-dark/5 space-y-6 group hover:translate-y-[-10px] transition-all duration-500">
                <div class="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <i data-lucide="layout" class="w-8 h-8"></i>
                </div>
                <h3 class="text-xl font-black uppercase tracking-tight text-brand-dark">Diagramação</h3>
                <p class="text-gray-400 text-sm leading-relaxed">Design de interiores sofisticado, otimizado para leitura fluida em papel ou e-ink.</p>
                <ul class="space-y-2 text-[10px] font-black uppercase tracking-widest text-brand-primary/60">
                    <li>✓ Tipografia Exclusiva</li>
                    <li>✓ Formatos Digitais</li>
                </ul>
            </div>

            <!-- 3. Capa -->
            <div class="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-brand-dark/5 space-y-6 group hover:translate-y-[-10px] transition-all duration-500">
                <div class="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <i data-lucide="image" class="w-8 h-8"></i>
                </div>
                <h3 class="text-xl font-black uppercase tracking-tight text-brand-dark">Design de Capa</h3>
                <p class="text-gray-400 text-sm leading-relaxed">Criamos identidades visuais impactantes que capturam a essência da sua obra no primeiro olhar.</p>
                <ul class="space-y-2 text-[10px] font-black uppercase tracking-widest text-brand-primary/60">
                    <li>✓ Ilustração Digital</li>
                    <li>✓ Acabamentos Premium</li>
                </ul>
            </div>

            <!-- 4. Impressão -->
            <div class="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-brand-dark/5 space-y-6 group hover:translate-y-[-10px] transition-all duration-500">
                <div class="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <i data-lucide="printer" class="w-8 h-8"></i>
                </div>
                <h3 class="text-xl font-black uppercase tracking-tight text-brand-dark">Gestão de Impressão</h3>
                <p class="text-gray-400 text-sm leading-relaxed">Supervisão técnica de impressão e acabamentos, do boneco à tiragem final.</p>
                <ul class="space-y-2 text-[10px] font-black uppercase tracking-widest text-brand-primary/60">
                    <li>✓ Papéis Especiais</li>
                    <li>✓ Controlo de Qualidade</li>
                </ul>
            </div>

            <!-- 5. Marketing (New Parity) -->
            <div class="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-brand-dark/5 space-y-6 group hover:translate-y-[-10px] transition-all duration-500">
                <div class="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <i data-lucide="trending-up" class="w-8 h-8"></i>
                </div>
                <h3 class="text-xl font-black uppercase tracking-tight text-brand-dark">Marketing Editorial</h3>
                <p class="text-gray-400 text-sm leading-relaxed">Estratégias de lançamento e posicionamento de mercado para autores independentes.</p>
                <ul class="space-y-2 text-[10px] font-black uppercase tracking-widest text-brand-primary/60">
                    <li>✓ Gestão de Redes</li>
                    <li>✓ Book Trailers</li>
                </ul>
            </div>

            <!-- 6. E-book (New Parity) -->
            <div class="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-brand-dark/5 space-y-6 group hover:translate-y-[-10px] transition-all duration-500">
                <div class="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <i data-lucide="smartphone" class="w-8 h-8"></i>
                </div>
                <h3 class="text-xl font-black uppercase tracking-tight text-brand-dark">E-book & Digital</h3>
                <p class="text-gray-400 text-sm leading-relaxed">Conversão profissional para ePub e distribuição global em marketplaces digitais.</p>
                <ul class="space-y-2 text-[10px] font-black uppercase tracking-widest text-brand-primary/60">
                    <li>✓ Layout Fluído</li>
                    <li>✓ Kindle/Apple Books</li>
                </ul>
            </div>
        </div>

        <!-- Budget Simulator (The missing functional piece) -->
        <div id="budget-simulator" class="max-w-4xl mx-auto bg-white rounded-[3rem] border border-gray-100 shadow-3xl overflow-hidden relative">
            <div class="bg-brand-dark p-12 text-white flex justify-between items-center relative overflow-hidden">
                <div class="relative z-10">
                    <h2 class="text-3xl font-black uppercase tracking-tight mb-2">Simulador de Investimento</h2>
                    <p class="text-gray-400 font-medium text-sm italic">"A sua visão literária traduzida em valor real."</p>
                </div>
                <div class="absolute right-0 top-0 h-full w-1/3 bg-brand-primary/20 blur-[80px] rounded-full translate-x-1/2"></div>
                <i data-lucide="calculator" class="w-16 h-16 text-brand-primary relative z-10"></i>
            </div>

            <div class="p-12">
                <!-- Progress Indicators -->
                <div class="flex items-center justify-between mb-16 relative px-4">
                    <div class="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -z-0 -translate-y-1/2"></div>
                    <?php for ($i = 1; $i <= 4; $i++): ?>
                        <div class="step-indicator relative z-10 flex flex-col items-center gap-3">
                            <div class="step-circle w-12 h-12 rounded-full border-2 border-gray-100 bg-white flex items-center justify-center font-black text-xs text-gray-300 transition-all duration-500">
                                <?php echo $i; ?>
                            </div>
                            <span class="text-[9px] font-black uppercase tracking-widest text-gray-400 hidden sm:block">PASSO <?php echo $i; ?></span>
                        </div>
                    <?php endfor; ?>
                </div>

                <!-- Step 1: Service -->
                <div class="step-content space-y-8" data-step="1">
                    <div class="grid md:grid-cols-3 gap-6">
                        <button class="service-opt p-8 border-2 border-gray-50 rounded-3xl text-left transition-all hover:bg-gray-50 group" data-service="revisao">
                            <i data-lucide="edit-3" class="w-8 h-8 mb-4 text-gray-300 group-hover:text-brand-primary transition-colors"></i>
                            <h4 class="font-black text-sm uppercase text-brand-dark mb-2">Revisão</h4>
                            <p class="text-[10px] text-gray-400 leading-relaxed uppercase tracking-tighter">Foco na gramática e estilo.</p>
                        </button>
                        <button class="service-opt p-8 border-2 border-gray-50 rounded-3xl text-left transition-all hover:bg-gray-50 group" data-service="diagramacao">
                            <i data-lucide="layout" class="w-8 h-8 mb-4 text-gray-300 group-hover:text-brand-primary transition-colors"></i>
                            <h4 class="font-black text-sm uppercase text-brand-dark mb-2">Paginação</h4>
                            <p class="text-[10px] text-gray-400 leading-relaxed uppercase tracking-tighter">Layout para impressão e digital.</p>
                        </button>
                        <button class="service-opt p-8 border-2 border-gray-50 rounded-3xl text-left transition-all hover:bg-gray-50 group" data-service="completo">
                            <i data-lucide="sparkles" class="w-8 h-8 mb-4 text-gray-300 group-hover:text-brand-primary transition-colors"></i>
                            <h4 class="font-black text-sm uppercase text-brand-dark mb-2">Completo</h4>
                            <p class="text-[10px] text-gray-400 leading-relaxed uppercase tracking-tighter">Ciclo de publicação integral.</p>
                        </button>
                    </div>
                </div>

                <!-- Step 2: Details -->
                <div class="step-content hidden space-y-12" data-step="2">
                    <div class="grid md:grid-cols-2 gap-10">
                        <div class="space-y-4">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Páginas Estimadas</label>
                            <input type="number" name="pages" placeholder="Ex: 200" class="input-premium w-full text-2xl font-black">
                        </div>
                        <div class="space-y-4">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Género Literário</label>
                            <select name="genre" class="input-premium w-full h-20 text-sm font-bold uppercase tracking-widest">
                                <option value="">Seleccionar...</option>
                                <option value="Romance">Romance</option>
                                <option value="Poesia">Poesia</option>
                                <option value="Técnico">Técnico/Académico</option>
                                <option value="Infantil">Infantil</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Extras -->
                <div class="step-content hidden" data-step="3">
                    <div class="grid grid-cols-2 gap-6">
                        <label class="flex items-center gap-4 p-6 border-2 border-gray-50 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all">
                            <input type="checkbox" name="extras" value="capa" class="w-6 h-6 accent-brand-primary">
                            <div>
                                <p class="font-black text-brand-dark text-sm uppercase">Capa Exclusiva</p>
                                <p class="text-[10px] text-brand-primary font-bold">+ 10.000 Kz</p>
                            </div>
                        </label>
                        <label class="flex items-center gap-4 p-6 border-2 border-gray-50 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all">
                            <input type="checkbox" name="extras" value="isbn" class="w-6 h-6 accent-brand-primary">
                            <div>
                                <p class="font-black text-brand-dark text-sm uppercase">Registo ISBN</p>
                                <p class="text-[10px] text-brand-primary font-bold">+ 6.000 Kz</p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Step 4: Submit -->
                <div class="step-content hidden space-y-12" data-step="4">
                    <div class="bg-brand-dark/5 border border-brand-primary/10 rounded-[2rem] p-10 text-center space-y-4">
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Investimento Previsto</p>
                        <div id="price-estimate" class="text-4xl md:text-6xl font-black text-brand-primary tracking-tighter">0,00 Kz</div>
                    </div>
                    <div class="grid md:grid-cols-2 gap-6">
                        <input type="text" name="name" placeholder="O seu Nome" class="input-premium w-full h-16 text-sm font-bold">
                        <input type="tel" name="phone" placeholder="WhatsApp / Terminal" class="input-premium w-full h-16 text-sm font-bold">
                        <input type="email" name="email" placeholder="Email de Contato" class="input-premium w-full h-16 text-sm font-bold md:col-span-2">
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-between items-center mt-16 pt-10 border-t border-gray-50">
                    <button id="back-step" class="hidden btn-premium bg-white border-2 border-gray-100 text-gray-400 px-10 py-5 hover:border-brand-primary hover:text-brand-primary">VOLTAR</button>
                    <div class="ml-auto flex gap-4">
                        <button id="next-step" class="btn-premium bg-brand-dark text-white px-10 py-5 hover:bg-brand-primary">PRÓXIMO</button>
                        <button id="submit-budget" class="hidden btn-premium bg-brand-primary text-white px-12 py-5 shadow-2xl shadow-brand-primary/30">RECEBER PROPOSTA FORMAL</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-20 p-12 bg-brand-dark rounded-[3rem] text-center space-y-8 relative overflow-hidden">
            <div class="absolute inset-0 opacity-10 pointer-events-none">
                <div class="absolute top-0 right-0 w-full h-full bg-brand-primary blur-[100px] rounded-full"></div>
            </div>
            <h2 class="text-3xl font-black uppercase tracking-tight text-white relative z-10">Método Editora Graça</h2>
            <p class="text-gray-400 max-w-xl mx-auto relative z-10 uppercase text-[10px] font-bold tracking-[0.3em]">O nosso compromisso é com a imortalidade da sua obra.</p>
            <div class="grid md:grid-cols-3 gap-12 relative z-10 pt-8">
                <div class="space-y-4">
                    <div class="text-3xl font-black text-brand-primary">01</div>
                    <h4 class="text-white font-bold uppercase text-xs">Análise Técnica</h4>
                    <p class="text-gray-500 text-[10px] uppercase tracking-tighter">Leitura crítica rigorosa de cada original.</p>
                </div>
                <div class="space-y-4">
                    <div class="text-3xl font-black text-brand-primary">02</div>
                    <h4 class="text-white font-bold uppercase text-xs">Artesanato Digital</h4>
                    <p class="text-gray-500 text-[10px] uppercase tracking-tighter">Design exclusivo pautado pelo modernismo.</p>
                </div>
                <div class="space-y-4">
                    <div class="text-3xl font-black text-brand-primary">03</div>
                    <h4 class="text-white font-bold uppercase text-xs">Curadoria Final</h4>
                    <p class="text-gray-500 text-[10px] uppercase tracking-tighter">Supervisão directa pelo nosso director criativo.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<script type="module" src="/public/js/budget-simulator.js"></script>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>
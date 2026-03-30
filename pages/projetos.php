<?php

/**
 * Editora Graça — Projects & Initiatives (Full Parity Version)
 */
$pageTitle = "Projetos & Iniciativas";
require_once __DIR__ . '/../templates/header.php';
?>

<section id="projects-portal" class="section-fluid py-24 bg-white overflow-hidden min-h-screen">
    <div class="container">
        <!-- Hero Parity -->
        <div class="text-center max-w-4xl mx-auto space-y-6 mb-20">
            <span class="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary">Portefólio de Impacto</span>
            <h1 class="text-5xl sm:text-7xl md:text-9xl font-black uppercase leading-[0.8] tracking-tighter text-brand-dark">
                Nosso <br><span class="text-brand-primary italic font-serif font-normal lowercase">Portefólio</span>
            </h1>
            <p class="text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
                Além do papel e da tinta, construímos pontes para o conhecimento e ferramentas para a preservação da nossa identidade cultural.
            </p>
        </div>

        <!-- Navigation Tabs -->
        <div class="sticky top-24 z-40 bg-white/80 backdrop-blur-xl py-6 mb-20 border-b border-gray-50">
            <div class="flex justify-center gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                <button data-target="academia" class="flex items-center gap-3 px-8 py-4 rounded-2xl whitespace-nowrap transition-all duration-500 font-black text-[10px] uppercase tracking-widest bg-brand-dark text-white shadow-2xl">
                    <i data-lucide="graduation-cap" class="w-4 h-4 text-brand-primary"></i>
                    Academia Graça
                </button>
                <button data-target="fundacao" class="flex items-center gap-3 px-8 py-4 rounded-2xl whitespace-nowrap transition-all duration-500 font-black text-[10px] uppercase tracking-widest bg-gray-50 text-gray-400 hover:bg-gray-100">
                    <i data-lucide="heart" class="w-4 h-4"></i>
                    Fundação Graça
                </button>
                <button data-target="play" class="flex items-center gap-3 px-8 py-4 rounded-2xl whitespace-nowrap transition-all duration-500 font-black text-[10px] uppercase tracking-widest bg-gray-50 text-gray-400 hover:bg-gray-100">
                    <i data-lucide="play-circle" class="w-4 h-4"></i>
                    Graça Play
                </button>
            </div>
        </div>

        <!-- 1. Academia Graça Section -->
        <div id="academia" class="project-section animate-fade-in">
            <div class="grid lg:grid-cols-2 gap-24 items-center">
                <div class="space-y-12">
                    <div class="space-y-4">
                        <span class="text-brand-primary font-black text-[10px] uppercase tracking-[0.5em]">Cultivando o intelecto</span>
                        <h2 class="text-5xl md:text-8xl font-black text-brand-dark uppercase tracking-tighter leading-tight">
                            Academia <br><span class="text-brand-primary italic font-serif lowercase font-normal">Intelectual</span>
                        </h2>
                    </div>
                    <p class="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                        A Academia Graça é um projeto educacional criado para orientar escritores de tenra idade e contribuir para a formação intelectual de jovens estudantes em Angola.
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-4">
                            <i data-lucide="users" class="w-8 h-8 text-brand-primary"></i>
                            <div>
                                <p class="text-2xl font-black text-brand-dark">5 Ativos</p>
                                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Estudantes</p>
                            </div>
                        </div>
                        <div class="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-4">
                            <i data-lucide="target" class="w-8 h-8 text-brand-primary"></i>
                            <div>
                                <p class="text-2xl font-black text-brand-dark">Integral</p>
                                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Foco Curricular</p>
                            </div>
                        </div>
                        <div class="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-4">
                            <i data-lucide="radio" class="w-8 h-8 text-brand-primary"></i>
                            <div>
                                <p class="text-2xl font-black text-brand-dark">Ativa</p>
                                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Estado</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative">
                    <div class="aspect-[4/5] bg-gray-100 rounded-[4rem] overflow-hidden shadow-3xl transform rotate-3 hover:rotate-0 transition-all duration-1000">
                        <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80" alt="Academia" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 2. Fundação Graça Section (Hidden initially) -->
        <div id="fundacao" class="project-section hidden animate-fade-in text-center max-w-4xl mx-auto py-20 space-y-16">
            <div class="w-32 h-32 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <i data-lucide="heart" class="w-16 h-16 fill-current"></i>
            </div>
            <div class="space-y-6">
                <h2 class="text-6xl md:text-9xl font-black text-brand-dark tracking-tighter uppercase leading-none">
                    Fundação <br><span class="text-red-500 italic font-serif lowercase font-normal">Graça</span>
                </h2>
                <p class="text-2xl text-gray-400 font-medium leading-relaxed italic">
                    "Erradicando o analfabetismo literário e apoiando talentos periféricos africanos."
                </p>
            </div>
            <div class="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto pt-10">
                <div class="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 text-left space-y-4">
                    <i data-lucide="globe" class="w-8 h-8 text-brand-primary"></i>
                    <h4 class="font-black text-sm uppercase text-brand-dark">Impacto Rural</h4>
                    <p class="text-xs text-gray-500">Expansão literária para além das capitais provinciais angolanas.</p>
                </div>
                <div class="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 text-left space-y-4">
                    <i data-lucide="layers" class="w-8 h-8 text-brand-primary"></i>
                    <h4 class="font-black text-sm uppercase text-brand-dark">Artesanato Digital</h4>
                    <p class="text-xs text-gray-500">Digitalização de acervos históricos e obras raras em perigo.</p>
                </div>
            </div>
        </div>

        <!-- 3. Graça Play Section (Hidden initially) -->
        <div id="play" class="project-section hidden animate-fade-in">
            <div class="bg-brand-dark rounded-[4rem] p-12 md:p-24 overflow-hidden relative text-white">
                <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_30%,#f0a500_0%,transparent_50%)]"></div>
                <div class="grid lg:grid-cols-2 gap-24 relative z-10">
                    <div class="space-y-12">
                        <div class="space-y-6">
                            <span class="text-brand-primary font-black text-xs uppercase tracking-[0.5em] flex items-center gap-4">
                                <i data-lucide="radio" class="w-4 h-4 animate-pulse"></i> EM DIRECTO
                            </span>
                            <h2 class="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none">
                                Graça <br><span class="text-brand-primary">Play</span>
                            </h2>
                        </div>
                        <p class="text-xl text-gray-400 font-medium leading-relaxed max-w-lg">
                            O Graça Play é o nosso hub de áudio onde o design sonoro e a curadoria literária convergem no podcast literário de maior impacto em Malanje.
                        </p>
                        <!-- Zeno.fm Player -->
                        <div class="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/10 shadow-3xl">
                            <div class="flex items-center gap-6 mb-8">
                                <div class="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center">
                                    <i data-lucide="headphones" class="w-8 h-8 text-white"></i>
                                </div>
                                <div>
                                    <p class="text-[10px] font-black uppercase tracking-widest text-brand-primary">BROADCASTING</p>
                                    <p class="text-xl font-black">Emissão Central</p>
                                </div>
                            </div>
                            <iframe src="https://zeno.fm/player/graceplay" width="100%" height="180" frameBorder="0" scrolling="no" class="rounded-2xl grayscale contrast-125 opacity-80"></iframe>
                        </div>
                    </div>
                    <div class="space-y-12">
                        <div class="flex items-center justify-between">
                            <h3 class="text-2xl font-black uppercase tracking-widest">Arquivo de Vozes</h3>
                            <i data-lucide="mic" class="w-6 h-6 text-brand-primary"></i>
                        </div>
                        <!-- Podcast Episodes List (Dynamic) -->
                        <div id="podcast-episodes" class="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                            <!-- JS injected contents -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Final CTA Institutional -->
<section class="py-32 bg-gray-50 relative overflow-hidden">
    <div class="container relative z-10">
        <div class="flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div class="max-w-2xl space-y-8">
                <h3 class="text-4xl md:text-7xl font-black text-brand-dark uppercase tracking-tighter leading-none">
                    Sustente esta <br><span class="text-brand-primary">Inovação</span>
                </h3>
                <p class="text-xl text-gray-500 font-medium leading-relaxed">
                    Estas iniciativas são financiadas através de parcerias estratégicas e de uma percentagem da venda de cada livro da Editora Graça.
                </p>
            </div>
            <a href="/contacto" class="btn-premium bg-brand-dark text-white px-16 py-10 rounded-full hover:bg-brand-primary">SEJA PARCEIRO</a>
        </div>
    </div>
</section>

<script type="module" src="/public/js/projects.js"></script>

<?php require_once __DIR__ . '/../templates/header.php'; ?>
<?php

/**
 * Editora Graça — Projetos & Iniciativas (100% Absolute Parity)
 */
$pageTitle = "Projetos";
require_once __DIR__ . '/../templates/header.php';
?>

<div class="bg-white min-h-screen">
    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 overflow-hidden bg-white">
        <div class="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
            <div class="max-w-5xl">
                <span class="text-brand-primary font-black text-xs uppercase tracking-[0.5em] mb-6 block animate-fade-in">Impacto & Cultura</span>
                <h1 class="text-5xl sm:text-7xl md:text-9xl font-black uppercase leading-[0.8] tracking-tighter mb-8 animate-fade-in">
                    Nosso <br>
                    <span class="text-brand-primary italic font-serif font-normal lowercase">Portefólio</span>
                </h1>
                <p class="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl leading-relaxed animate-fade-in" style="animation-delay: 0.1s">
                    Além do papel e da tinta, construímos pontes para o conhecimento e ferramentas para a preservação da nossa identidade cultural.
                </p>
            </div>
        </div>
        <div class="absolute top-0 right-0 w-[50vw] h-full bg-gray-50/50 -z-10 skew-x-12 translate-x-1/4"></div>
    </section>

    <!-- Tab Navigation -->
    <div class="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-6 sm:py-8 px-4 sm:px-6 md:px-12">
        <div class="container mx-auto flex justify-start sm:justify-center gap-4 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
            <button onclick="switchProjectTab('academia')"
                class="project-tab-btn flex items-center gap-3 px-8 py-4 rounded-2xl whitespace-nowrap transition-all duration-500 font-black text-[10px] uppercase tracking-widest bg-brand-dark text-white shadow-2xl shadow-brand-dark/20 scale-105 active"
                data-tab="academia">
                <i data-lucide="graduation-cap" class="w-4 h-4 text-brand-primary"></i>
                Academia Graça
            </button>
            <button onclick="switchProjectTab('fundacao')"
                class="project-tab-btn flex items-center gap-3 px-8 py-4 rounded-2xl whitespace-nowrap transition-all duration-500 font-black text-[10px] uppercase tracking-widest bg-gray-50 text-gray-400 hover:bg-gray-100"
                data-tab="fundacao">
                <i data-lucide="heart" class="w-4 h-4"></i>
                Fundação Graça
            </button>
            <button onclick="switchProjectTab('play')"
                class="project-tab-btn flex items-center gap-3 px-8 py-4 rounded-2xl whitespace-nowrap transition-all duration-500 font-black text-[10px] uppercase tracking-widest bg-gray-50 text-gray-400 hover:bg-gray-100"
                data-tab="play">
                <i data-lucide="play-circle" class="w-4 h-4"></i>
                Graça Play
            </button>
        </div>
    </div>

    <!-- Main Content Area -->
    <main class="py-20 sm:py-32 px-4 sm:px-6 md:px-12">
        <div class="container mx-auto">

            <!-- ACADEMIA GRACA -->
            <div id="tab-content-academia" class="tab-content block animate-fade-in">
                <!-- Dynamically Hydrated -->
            </div>

            <!-- FUNDACAO GRACA -->
            <div id="tab-content-fundacao" class="tab-content hidden animate-fade-in">
                <!-- Dynamically Hydrated -->
            </div>

            <!-- GRACA PLAY -->
            <div id="tab-content-play" class="tab-content hidden animate-fade-in">
                <div class="bg-brand-dark rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-12 md:p-24 overflow-hidden relative text-white">
                    <div class="grid lg:grid-cols-2 gap-16 md:gap-24 relative z-10">
                        <div class="space-y-10 sm:space-y-12">
                            <div class="space-y-6">
                                <span class="text-brand-primary font-black text-xs uppercase tracking-[0.5em] flex items-center gap-4">
                                    <i data-lucide="radio" class="w-4 h-4 animate-pulse"></i> Live Literature
                                </span>
                                <h2 class="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
                                    Graça <br><span class="text-brand-primary">Play</span>
                                </h2>
                            </div>
                            <p class="text-lg sm:text-xl text-gray-400 font-medium leading-relaxed max-w-lg">
                                O Graça Play é o nosso hub de áudio e conteúdo multimédia, onde a literatura, a cultura africana e histórias inspiradoras se cruzam. Sintoniza a nossa estação ou explora o arquivo de vozes que definem Angola hoje.
                            </p>

                            <!-- Player Widget -->
                            <div class="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-8 border border-white/10">
                                <div class="flex items-center gap-6 mb-6 sm:mb-8">
                                    <div class="w-12 h-12 sm:w-16 sm:h-16 bg-brand-primary rounded-full flex items-center justify-center">
                                        <i data-lucide="headphones" class="w-6 h-6 sm:w-8 sm:h-8 text-white"></i>
                                    </div>
                                    <div>
                                        <p class="text-[10px] font-black uppercase tracking-widest text-brand-primary">Broadcasting</p>
                                        <p class="text-lg sm:text-xl font-black">Emissão Directa</p>
                                    </div>
                                </div>
                                <iframe src="https://zeno.fm/player/graceplay" width="100%" height="180" frameBorder="0" scrolling="no" class="rounded-xl grayscale contrast-125 opacity-80"></iframe>
                            </div>
                        </div>

                        <div class="space-y-8 sm:space-y-12">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl sm:text-2xl font-black uppercase tracking-widest">Episódios Recentes</h3>
                                <i data-lucide="mic" class="w-6 h-6 text-brand-primary"></i>
                            </div>
                            <div id="podcast-episodes-grid" class="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                                <!-- JS Populated -->
                                <div class="flex justify-center py-20">
                                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </main>

    <!-- Final CTA -->
    <section class="py-24 sm:py-32 bg-gray-50 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        <div class="container mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div class="max-w-2xl space-y-8">
                <h3 class="text-4xl sm:text-6xl md:text-7xl font-black text-brand-dark uppercase tracking-tighter leading-none">
                    Sustente esta <br><span class="text-brand-primary">Inovação</span>
                </h3>
                <p class="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed">
                    Estas iniciativas são financiadas através de parcerias estratégicas e de uma percentagem da venda de cada livro da Editora Graça.
                </p>
            </div>
            <a href="/sobre" class="w-full sm:w-auto px-12 sm:px-16 py-8 sm:py-10 bg-brand-dark text-white rounded-[2rem] font-black uppercase text-[10px] sm:text-xs tracking-[0.4em] hover:bg-brand-primary transition-all shadow-xl flex items-center justify-center gap-6 group no-underline">
                Seja Parceiro
                <i data-lucide="chevron-right" class="w-6 h-6 group-hover:translate-x-2 transition-transform"></i>
            </a>
        </div>
    </section>
</div>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>

<script type="module" src="/public/js/projects.js"></script>
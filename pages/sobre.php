<?php

/**
 * Editora Graça — Sobre Nós (100% Absolute Parity)
 */
$pageTitle = "Sobre Nós";
require_once __DIR__ . '/../templates/header.php';
?>

<div class="bg-white">
    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 overflow-hidden bg-white">
        <div class="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
            <div class="max-w-5xl">
                <span class="text-brand-primary font-black text-xs uppercase tracking-[0.5em] mb-6 block animate-fade-in">Nossa História</span>
                <h1 class="text-5xl sm:text-7xl md:text-9xl font-black uppercase leading-[0.8] tracking-tighter mb-8 animate-fade-in">
                    Sobre <br>
                    <span class="text-brand-primary italic font-serif font-normal lowercase">Nós</span>
                </h1>
                <p id="about-intro-text" class="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl leading-relaxed animate-fade-in" style="animation-delay: 0.1s">
                    <!-- Hydrated via JS -->
                </p>
            </div>
        </div>
        <div class="absolute top-0 right-0 w-[50vw] h-full bg-gray-50/50 -z-10 skew-x-12 translate-x-1/4"></div>
    </section>

    <!-- Cinematic Storytelling -->
    <section class="py-24 sm:py-32 bg-white relative overflow-hidden px-4 sm:px-6 md:px-12">
        <div class="container mx-auto">
            <div class="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
                <div class="space-y-8 sm:space-y-12">
                    <span class="text-brand-primary font-black text-xs uppercase tracking-[0.5em]">A Nossa Razão de Ser</span>
                    <h2 class="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none text-brand-dark">
                        Curadoria de <br><span class="text-brand-primary italic font-serif lowercase font-normal">Obra-Prima</span>
                    </h2>
                    <p id="about-essence-text" class="text-lg sm:text-2xl text-gray-500 font-medium leading-relaxed">
                        <!-- Hydrated via JS -->
                    </p>
                    <div class="flex gap-8 sm:gap-12 pt-4">
                        <div class="space-y-2">
                            <p id="about-stats-books" class="text-4xl font-black text-brand-dark">--</p>
                            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Obras Publicadas</p>
                        </div>
                        <div class="space-y-2">
                            <p id="about-stats-talent" class="text-4xl font-black text-brand-dark">--</p>
                            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Talento Lusófono</p>
                        </div>
                    </div>
                </div>
                <div class="relative">
                    <div class="aspect-square bg-gray-100 rounded-[3rem] sm:rounded-[5rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-1000 shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80"
                            alt="Editora Graça Essence"
                            class="w-full h-full object-cover">
                    </div>
                    <div class="absolute -bottom-8 -left-8 sm:-bottom-10 sm:-left-10 w-56 h-56 sm:w-64 sm:h-64 bg-brand-dark p-8 sm:p-10 rounded-[3rem] text-white shadow-2xl -rotate-6 hidden md:block">
                        <i data-lucide="quote" class="w-8 h-8 sm:w-10 sm:h-10 text-brand-primary mb-4"></i>
                        <p id="about-founder-quote-small" class="text-[10px] sm:text-xs font-medium leading-relaxed italic uppercase tracking-widest">"Construímos o palco para o génio literário angolano brilhar globalmente."</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Core Values -->
    <section class="py-24 sm:py-32 bg-brand-dark text-white px-4 sm:px-6 md:px-12">
        <div class="container mx-auto">
            <div class="text-center mb-16 sm:mb-24 space-y-4 sm:space-y-6">
                <span class="text-brand-primary font-black text-xs uppercase tracking-[0.5em]">Valores Inegociáveis</span>
                <h2 class="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter">O Nosso <span class="text-brand-primary italic font-serif lowercase font-normal">ADN</span></h2>
            </div>

            <div id="about-values-grid" class="grid md:grid-cols-3 gap-8 sm:gap-12">
                <!-- Hydrated via JS -->
            </div>
        </div>
    </section>

    <!-- Timeline Experience -->
    <section class="py-24 sm:py-32 bg-white overflow-hidden px-4 sm:px-6 md:px-12">
        <div class="container mx-auto">
            <div class="max-w-4xl mx-auto">
                <div class="flex items-center gap-6 sm:gap-10 mb-16 sm:mb-24">
                    <div class="w-12 h-12 sm:w-16 sm:h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-white">
                        <i data-lucide="history" class="w-6 h-6 sm:w-8 sm:h-8"></i>
                    </div>
                    <h2 class="text-3xl sm:text-5xl md:text-6xl font-black text-brand-dark uppercase tracking-tighter">A Jornada do <span class="text-brand-primary">Tempo</span></h2>
                </div>

                <div id="about-timeline-container" class="space-y-16 sm:space-y-24 relative pb-10">
                    <!-- Hydrated via JS -->
                </div>
            </div>
        </div>
    </section>

    <!-- Founder Spotlight -->
    <section class="py-24 sm:py-32 bg-gray-50 relative px-4 sm:px-6 md:px-12">
        <div class="container mx-auto">
            <div id="about-founder-container" class="bg-white rounded-[3rem] sm:rounded-[5rem] p-10 sm:p-20 md:p-32 shadow-2xl overflow-hidden relative border border-gray-100">
                <!-- Hydrated via JS -->
            </div>
        </div>
    </section>

    <!-- Final CTA -->
    <section class="py-24 sm:py-32 bg-white px-4 sm:px-6 md:px-12 text-center">
        <div class="container mx-auto">
            <div class="max-w-4xl mx-auto space-y-10 sm:space-y-16">
                <i data-lucide="star" class="w-12 h-12 sm:w-16 sm:h-16 text-brand-primary mx-auto animate-pulse"></i>
                <h2 class="text-4xl sm:text-7xl md:text-9xl font-black text-brand-dark uppercase tracking-tighter leading-none">
                    Faça <span class="text-brand-primary">História</span> Connosco
                </h2>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
                    <a href="/servicos" class="w-full sm:w-auto px-12 sm:px-16 py-8 sm:py-10 bg-brand-dark text-white rounded-[2rem] font-black uppercase text-[10px] sm:text-xs tracking-[0.4em] hover:bg-brand-primary transition-all shadow-xl flex items-center justify-center gap-4 group no-underline">
                        Seja Autor Graça
                        <i data-lucide="chevron-right" class="w-5 h-5 group-hover:translate-x-2 transition-transform"></i>
                    </a>
                    <a href="/livros" class="w-full sm:w-auto px-12 sm:px-16 py-8 sm:py-10 bg-white border-2 border-brand-dark text-brand-dark rounded-[2rem] font-black uppercase text-[10px] sm:text-xs tracking-[0.4em] hover:bg-gray-50 transition-all flex items-center justify-center gap-4 no-underline">
                        Ver Acervo <i data-lucide="arrow-up-right" class="w-5 h-5"></i>
                    </a>
                </div>
            </div>
        </div>
    </section>
</div>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>

<!-- About Logic -->
<script type="module" src="/public/js/about.js"></script>
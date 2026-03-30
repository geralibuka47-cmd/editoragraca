<?php

/**
 * Editora Graça — HomePage (100% Data-Driven Version)
 */
$pageTitle = "Início";
require_once __DIR__ . '/../templates/header.php';
?>

<div class="bg-white overflow-hidden font-sans text-brand-dark">
    <!-- 1. HERO SECTION -->
    <section class="min-h-screen section-fluid flex items-center relative overflow-hidden bg-white">
        <div class="absolute top-0 right-0 w-1/2 h-full bg-gray-50 skew-x-12 translate-x-1/3 -z-10 hidden lg:block"></div>

        <div class="container mx-auto grid lg:grid-cols-2 gap-10 sm:gap-16 items-center w-full">
            <div class="space-y-8 animate-fade-in">
                <div id="hero-badge-container" class="inline-flex items-center gap-3 px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-brand-primary/30">
                    <i data-lucide="zap" class="w-4 h-4 text-white animate-pulse"></i>
                    <span>🎉 Lançamento Oficial — Já Online</span>
                </div>

                <h1 class="uppercase leading-[0.9] tracking-tighter text-brand-dark">
                    Onde a Arte <br>
                    <span class="text-brand-primary italic font-serif lowercase font-normal">Encontra o Legado</span>
                </h1>
                <p class="text-gray-500 font-medium max-w-lg leading-relaxed text-sm sm:text-base md:text-lg">
                    Curadoria de excelência para leitores que exigem o extraordinário. Conheça as vozes que moldam o futuro da cultura.
                </p>

                <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 pt-4">
                    <a href="/livros" class="w-full sm:w-auto px-10 py-5 bg-brand-dark text-white rounded-xl font-bold uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl group no-underline flex items-center justify-center gap-3">
                        Explorar Acervo <i data-lucide="arrow-right" class="w-5 h-5 group-hover:translate-x-2 transition-transform"></i>
                    </a>
                    <a href="/sobre" class="w-full sm:w-auto px-10 py-5 bg-white border-2 border-brand-dark text-brand-dark rounded-xl font-bold uppercase tracking-widest hover:bg-gray-50 transition-all no-underline flex items-center justify-center">
                        A Nossa Essência
                    </a>
                </div>

                <!-- Stats (Dynamic) -->
                <div class="grid grid-cols-2 sm:flex items-center gap-8 sm:gap-16 pt-10 border-t border-gray-100">
                    <div>
                        <p id="stats-books-count" class="text-3xl sm:text-4xl font-black text-brand-dark">--</p>
                        <p class="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-bold mt-1">Obras Publicadas</p>
                    </div>
                    <div>
                        <p id="stats-readers-count" class="text-3xl sm:text-4xl font-black text-brand-dark">100%</p>
                        <p class="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-bold mt-1">Talento Lusófono</p>
                    </div>
                </div>
            </div>

            <!-- Hero Image (Dynamic) -->
            <div id="hero-reading-container" class="relative hidden lg:block animate-fade-in" style="animation-delay: 0.2s;">
                <!-- Dynamically Hydrated -->
            </div>
        </div>
    </section>

    <!-- 2. LEITURA DO MÊS (Dynamic) -->
    <div id="reading-of-month-container">
        <!-- Dynamically Hydrated -->
    </div>

    <!-- 3. PRÓXIMOS LANÇAMENTOS -->
    <section id="upcoming-section" class="py-24 sm:py-32 bg-brand-dark text-white relative overflow-hidden hidden px-4 sm:px-6 md:px-12">
        <div class="absolute top-0 right-0 w-[60vw] h-[60vw] bg-brand-primary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div class="container mx-auto relative z-10">
            <div class="space-y-4 mb-20">
                <span class="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-3">
                    <i data-lucide="sparkles" class="w-4 h-4"></i> EXCLUSIVIDADE & FUTURO
                </span>
                <h2 class="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                    Próximos <br><span class="text-brand-primary italic font-serif lowercase font-normal">Capítulos</span>
                </h2>
            </div>
            <div id="upcoming-releases-grid" class="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                <!-- JS Hydrated -->
            </div>
        </div>
    </section>

    <!-- 4. CATÁLOGO EM DESTAQUE -->
    <section class="py-24 md:py-32 bg-white px-4 sm:px-6 md:px-12">
        <div class="container mx-auto">
            <div class="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                <div class="space-y-4">
                    <span class="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-brand-primary">Coleção Técnica & Literária</span>
                    <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-brand-dark uppercase tracking-tighter leading-none">Catálogo em Destaque</h2>
                </div>
                <a href="/livros" class="text-[10px] sm:text-xs font-black uppercase tracking-widest text-brand-dark hover:text-brand-primary transition-colors border-b-2 border-brand-primary/20 pb-1 no-underline">Ver Catálogo Completo</a>
            </div>

            <!-- Físicos -->
            <div class="mb-24">
                <div class="flex items-center gap-4 mb-10">
                    <h3 class="text-xl font-black uppercase tracking-tight text-brand-dark">Livros Físicos</h3>
                    <div class="h-px flex-1 bg-gray-100"></div>
                </div>
                <div id="physical-books-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    <!-- Hydrated via JS -->
                </div>
            </div>

            <!-- Digitais -->
            <div class="mb-24" id="ebooks-section">
                <div class="flex items-center gap-4 mb-10">
                    <h3 class="text-xl font-black uppercase tracking-tight text-brand-dark">E-books Premium</h3>
                    <div class="h-px flex-1 bg-gray-100"></div>
                </div>
                <div id="digital-books-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    <!-- Hydrated via JS -->
                </div>
            </div>

            <!-- Gratuitos -->
            <div id="free-section">
                <div class="flex items-center gap-4 mb-10">
                    <h3 class="text-xl font-black uppercase tracking-tight text-brand-dark">Acesso Gratuito</h3>
                    <div class="h-px flex-1 bg-gray-100"></div>
                </div>
                <div id="free-books-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    <!-- Hydrated via JS -->
                </div>
            </div>
        </div>
    </section>

    <!-- 5. EXPERIÊNCIA PHILOS -->
    <section class="py-24 md:py-32 bg-brand-dark relative overflow-hidden px-4 sm:px-6 md:px-12">
        <div class="container mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div class="space-y-12">
                <div class="space-y-6">
                    <span class="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em]">Experiência</span>
                    <h2 class="text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                        Mais que uma <br>Editora, um <br><span class="text-brand-primary italic font-serif lowercase font-normal">Movimento.</span>
                    </h2>
                </div>
                <div class="grid gap-6">
                    <div class="flex items-center gap-4 group">
                        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                            <i data-lucide="check" class="w-6 h-6"></i>
                        </div>
                        <p class="text-xl font-bold text-white/90">Acabamentos de luxo em cada edição.</p>
                    </div>
                    <div class="flex items-center gap-4 group">
                        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                            <i data-lucide="check" class="w-6 h-6"></i>
                        </div>
                        <p class="text-xl font-bold text-white/90">Curadoria de autores angolanos.</p>
                    </div>
                    <div class="flex items-center gap-4 group">
                        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                            <i data-lucide="check" class="w-6 h-6"></i>
                        </div>
                        <p class="text-xl font-bold text-white/90">Eventos exclusivos para membros.</p>
                    </div>
                </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-6">
                <div class="p-10 bg-white/5 rounded-[3rem] border border-white/10 space-y-6 hover:bg-white/10 transition-all">
                    <i data-lucide="star" class="w-10 h-10 text-brand-primary"></i>
                    <h4 class="text-2xl font-black text-white uppercase">Premium</h4>
                    <p class="text-gray-400 leading-relaxed font-medium">Qualidade inegociável em cada página impressa.</p>
                </div>
                <div class="p-10 bg-white/5 rounded-[3rem] border border-white/10 space-y-6 hover:bg-white/10 transition-all mt-12">
                    <i data-lucide="clock" class="w-10 h-10 text-brand-primary"></i>
                    <h4 class="text-2xl font-black text-white uppercase">Eterno</h4>
                    <p class="text-gray-400 leading-relaxed font-medium">Obras feitas para durar gerações.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 6. AUTORES DE SUCESSO -->
    <section class="py-24 sm:py-32 bg-white px-4 sm:px-6 md:px-12">
        <div class="container mx-auto">
            <div class="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
                <span class="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em] block mb-6">Mentes Brilhantes</span>
                <h2 class="text-4xl sm:text-6xl font-black text-brand-dark uppercase tracking-tighter leading-none mb-8">Nossos Autores</h2>
                <p class="text-gray-500 font-medium text-lg leading-relaxed">Conheça os talentos que dão vida à nossa linha editorial.</p>
            </div>

            <!-- Authors Dynamic Grid -->
            <div id="authors-grid" class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <!-- Dynamically Hydrated -->
            </div>
        </div>
    </section>

    <!-- 7. NEWSLETTER -->
    <section class="py-12 sm:py-16 md:py-24 bg-brand-dark px-4 sm:px-6 md:px-12 border-t border-white/10">
        <div class="container mx-auto text-center max-w-3xl">
            <i data-lucide="mail" class="w-10 h-10 sm:w-12 sm:h-12 text-brand-primary mx-auto mb-4 sm:mb-6"></i>
            <h2 class="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 sm:mb-6 uppercase tracking-tight">Fique a par das novidades</h2>
            <p class="text-gray-400 mb-6 sm:mb-10 text-sm sm:text-lg">Junte-se à nossa lista exclusiva de leitores e receba atualizações sobre novos lançamentos.</p>
            <form class="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10 w-full" onsubmit="event.preventDefault(); alert('Em breve!')">
                <input type="email" placeholder="Seu melhor email" class="flex-1 h-14 px-6 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-colors">
                <button type="submit" class="h-14 px-10 bg-brand-primary text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-brand-dark transition-all">Subscrever</button>
            </form>
        </div>
    </section>
</div>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>

<!-- Home Logic -->
<script type="module" src="/public/js/home.js"></script>
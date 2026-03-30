<?php

/**
 * Editora Graça — About Page (Full Parity Version)
 */
$pageTitle = "A Nossa Herança";
require_once __DIR__ . '/../templates/header.php';
?>

<!-- Hero Parity -->
<section class="section-fluid py-32 bg-white relative overflow-hidden">
    <div class="container text-center space-y-8">
        <span class="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary">Nossa Razão de Ser</span>
        <h1 class="text-5xl sm:text-7xl md:text-9xl font-black uppercase leading-[0.8] tracking-tighter text-brand-dark">
            Sobre <br><span class="text-brand-primary italic font-serif font-normal lowercase">Nós</span>
        </h1>
        <p class="text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed text-lg italic">
            "Não somos apenas uma editora; somos os arquitetos de um novo renascimento intelectual angolano, onde a estética e o rigor convergem."
        </p>
    </div>
</section>

<!-- Values (ADN) -->
<section class="py-32 bg-brand-dark text-white overflow-hidden">
    <div class="container">
        <div class="text-center mb-24 space-y-6">
            <span class="text-brand-primary font-black text-xs uppercase tracking-[0.5em]">Valores Inegociáveis</span>
            <h2 class="text-5xl md:text-7xl font-black uppercase tracking-tighter">O Nosso <span class="text-brand-primary italic font-serif lowercase font-normal">ADN</span></h2>
        </div>

        <div class="grid md:grid-cols-3 gap-12">
            <div class="p-12 bg-white/5 rounded-[4rem] border border-white/10 hover:bg-brand-primary/10 transition-all group">
                <i data-lucide="palette" class="w-12 h-12 text-brand-primary mb-10 group-hover:scale-125 transition-transform duration-500"></i>
                <h3 class="text-3xl font-black uppercase tracking-tight mb-4">Estética Radical</h3>
                <p class="text-gray-400 font-medium leading-relaxed">Acreditamos que a beleza é a porta de entrada para a sabedoria intelectual.</p>
            </div>
            <div class="p-12 bg-white/5 rounded-[4rem] border border-white/10 hover:bg-brand-primary/10 transition-all group">
                <i data-lucide="shield" class="w-12 h-12 text-brand-primary mb-10 group-hover:scale-125 transition-transform duration-500"></i>
                <h3 class="text-3xl font-black uppercase tracking-tight mb-4">Rigor Editorial</h3>
                <p class="text-gray-400 font-medium leading-relaxed">Cada vírgula é auditada para garantir o padrão internacional de excelência.</p>
            </div>
            <div class="p-12 bg-white/5 rounded-[4rem] border border-white/10 hover:bg-brand-primary/10 transition-all group">
                <i data-lucide="zap" class="w-12 h-12 text-brand-primary mb-10 group-hover:scale-125 transition-transform duration-500"></i>
                <h3 class="text-3xl font-black uppercase tracking-tight mb-4">Vanguarda Digital</h3>
                <p class="text-gray-400 font-medium leading-relaxed">Exploramos novas fronteiras de leitura num mundo em constante mutação.</p>
            </div>
        </div>
    </div>
</section>

<!-- Timeline Journey -->
<section class="py-32 bg-white overflow-hidden">
    <div class="container mx-auto">
        <div class="max-w-4xl mx-auto">
            <div class="flex items-center gap-10 mb-24">
                <i data-lucide="history" class="w-12 h-12 text-brand-primary"></i>
                <h2 class="text-4xl md:text-6xl font-black text-brand-dark uppercase tracking-tighter">A Jornada do <span class="text-brand-primary">Tempo</span></h2>
            </div>

            <div class="space-y-24 relative">
                <!-- Visual Line -->
                <div class="absolute left-10 top-0 bottom-0 w-px bg-gray-100 md:left-1/2"></div>

                <!-- 2020 -->
                <div class="relative flex flex-col md:flex-row gap-12 items-center">
                    <div class="flex-1 md:text-right pl-20 md:pl-0">
                        <p class="text-6xl md:text-8xl font-black text-gray-100 mb-2 italic font-serif">2020</p>
                        <h4 class="text-2xl font-black text-brand-dark uppercase tracking-tight mb-4">A Génese</h4>
                        <p class="text-gray-500 font-medium leading-relaxed max-w-sm mx-auto md:ml-auto md:mr-0">Fundação por Nilton Graça, unindo design e literatura em Malanje.</p>
                    </div>
                    <div class="absolute left-7 md:static w-6 h-6 bg-brand-dark border-4 border-brand-primary rounded-full z-10 shadow-xl"></div>
                    <div class="flex-1 hidden md:block"></div>
                </div>

                <!-- 2021 -->
                <div class="relative flex flex-col md:flex-row-reverse gap-12 items-center">
                    <div class="flex-1 md:text-left pl-20 md:pl-0">
                        <p class="text-6xl md:text-8xl font-black text-gray-100 mb-2 italic font-serif">2021</p>
                        <h4 class="text-2xl font-black text-brand-dark uppercase tracking-tight mb-4">Ascensão Digital</h4>
                        <p class="text-gray-500 font-medium leading-relaxed max-w-sm mx-auto md:mr-auto md:ml-0">Primeiras edições sob o selo de vanguardismo e expansão de catálogo.</p>
                    </div>
                    <div class="absolute left-7 md:static w-6 h-6 bg-brand-dark border-4 border-brand-primary rounded-full z-10 shadow-xl"></div>
                    <div class="flex-1 hidden md:block"></div>
                </div>

                <!-- 2023 -->
                <div class="relative flex flex-col md:flex-row gap-12 items-center">
                    <div class="flex-1 md:text-right pl-20 md:pl-0">
                        <p class="text-6xl md:text-8xl font-black text-gray-100 mb-2 italic font-serif">2023</p>
                        <h4 class="text-2xl font-black text-brand-dark uppercase tracking-tight mb-4">Consolidação</h4>
                        <p class="text-gray-500 font-medium leading-relaxed max-w-sm mx-auto md:ml-auto md:mr-0">Marca de 26+ obras imortalizadas e 18 províncias alcançadas.</p>
                    </div>
                    <div class="absolute left-7 md:static w-6 h-6 bg-brand-dark border-4 border-brand-primary rounded-full z-10 shadow-xl"></div>
                    <div class="flex-1 hidden md:block"></div>
                </div>

                <!-- 2026 -->
                <div class="relative flex flex-col md:flex-row-reverse gap-12 items-center">
                    <div class="flex-1 md:text-left pl-20 md:pl-0">
                        <p class="text-6xl md:text-8xl font-black text-gray-100 mb-2 italic font-serif">2026</p>
                        <h4 class="text-2xl font-black text-brand-dark uppercase tracking-tight mb-4">O Futuro</h4>
                        <p class="text-gray-500 font-medium leading-relaxed max-w-sm mx-auto md:mr-auto md:ml-0">Reestruturação premium e expansão para o mercado editorial global.</p>
                    </div>
                    <div class="absolute left-7 md:static w-6 h-6 bg-brand-dark border-4 border-brand-primary rounded-full z-10 shadow-xl"></div>
                    <div class="flex-1 hidden md:block"></div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Founder Spotlight -->
<section class="py-32 bg-gray-50 relative overflow-hidden">
    <div class="container relative z-10">
        <div class="bg-white rounded-[5rem] p-12 md:p-32 shadow-3xl border border-gray-100 overflow-hidden relative">
            <div class="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

            <div class="grid lg:grid-cols-2 gap-24 items-center">
                <div class="order-2 lg:order-1 space-y-12 animate-fade-in-left">
                    <div class="space-y-4">
                        <p class="text-brand-primary font-black text-[10px] uppercase tracking-[0.5em]">O Visionário</p>
                        <h2 class="text-5xl md:text-8xl font-black text-brand-dark uppercase tracking-tighter leading-none">
                            Nilton <br>Graça
                        </h2>
                    </div>
                    <p class="text-2xl font-serif italic text-gray-400 leading-relaxed">
                        "A literatura angolana é um gigante adormecido. A minha missão é acordá-lo com a dignidade e a estética que o nosso povo merece."
                    </p>
                    <div class="space-y-2">
                        <p class="text-brand-dark font-black uppercase text-xs tracking-widest">Fundador & Diretor Criativo</p>
                        <div class="w-20 h-1 bg-brand-primary"></div>
                    </div>
                </div>
                <div class="order-1 lg:order-2 animate-fade-in-right">
                    <div class="aspect-[4/5] bg-gray-100 rounded-[4rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl scale-95 hover:scale-100">
                        <img src="/public/img/niltongraca.png" alt="Nilton Graça" class="w-full h-full object-cover">
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Final CTA Heritage -->
<section class="py-32 bg-white">
    <div class="container text-center max-w-4xl space-y-12">
        <i data-lucide="star" class="w-16 h-16 text-brand-primary mx-auto animate-pulse"></i>
        <h2 class="text-6xl md:text-9xl font-black text-brand-dark uppercase tracking-tighter leading-none">
            Faça <span class="text-brand-primary">História</span> Connosco
        </h2>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
            <a href="/contacto" class="btn-premium bg-brand-dark text-white px-16 py-10 rounded-full flex items-center gap-6 group">
                SEJA AUTOR GRAÇA
                <i data-lucide="chevron-right" class="w-6 h-6 group-hover:translate-x-2 transition-transform"></i>
            </a>
            <a href="/livros" class="btn-premium bg-white border-2 border-brand-dark text-brand-dark px-16 py-10 rounded-full flex items-center gap-6">
                VER ACERVO <i data-lucide="arrow-up-right" class="w-6 h-6"></i>
            </a>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>

<!-- About Logic -->
<script type="module" src="/public/js/about.js"></script>
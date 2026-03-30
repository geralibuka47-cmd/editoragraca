<?php

/**
 * Editora Graça — HomePage (100% Absolute Parity Version)
 */
$pageTitle = "Início";

// 1. Data Source (Constants Mock as defined in React legacy)
require_once __DIR__ . '/../templates/header.php';

// Mock Data
$stats = [
    'booksCount' => 40,
    'authorsCount' => 12,
    'readersCount' => 500
];

$books = [
    [
        'id' => '1',
        'slug' => 'o-vendedor-de-passados',
        'title' => 'O Vendedor de Passados',
        'author' => 'José Eduardo Agualusa',
        'price' => 4500,
        'genre' => 'Ficção Literária',
        'format' => 'físico',
        'coverUrl' => 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=450',
        'isBestseller' => true,
        'isNew' => true,
        'description' => 'Uma sátira brilhante sobre a construção da memória e identidade na Angola pós-guerra.',
        'stats' => ['averageRating' => '4.9', 'downloads' => 120, 'views' => 450]
    ],
    [
        'id' => '2',
        'slug' => 'terra-sonambula',
        'title' => 'Terra Sonâmbula',
        'author' => 'Mia Couto',
        'price' => 5200,
        'genre' => 'Ficção Literária',
        'format' => 'físico',
        'coverUrl' => 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=450',
        'isBestseller' => true,
        'description' => 'Um clássico moderno que entrelaça a dura realidade da guerra com o realismo mágico.',
        'stats' => ['averageRating' => '5.0', 'downloads' => 85, 'views' => 380]
    ],
    [
        'id' => '3',
        'slug' => 'a-geracao-da-utopia',
        'title' => 'A Geração da Utopia',
        'author' => 'Pepetela',
        'price' => 3800,
        'genre' => 'História e Biografia',
        'format' => 'digital',
        'coverUrl' => 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=450',
        'isNew' => true,
        'description' => 'Uma reflexão profunda sobre os sonhos e desilusões da geração que lutou pela independência.',
        'stats' => ['averageRating' => '4.8', 'downloads' => 60, 'views' => 200]
    ],
    [
        'id' => '4',
        'slug' => 'bom-dia-camaradas',
        'title' => 'Bom Dia Camaradas',
        'author' => 'Ondjaki',
        'price' => 0,
        'genre' => 'Ficção Literária',
        'format' => 'digital',
        'coverUrl' => 'https://images.unsplash.com/photo-1476275402162-3caca16f5243?auto=format&fit=crop&q=80&w=450',
        'description' => 'A vida em Luanda vista através dos olhos de uma criança, com humor e ternura.',
        'stats' => ['averageRating' => '4.7', 'downloads' => 300, 'views' => 150]
    ],
];

// Authors
$authors = [
    ['name' => 'António Graça', 'count' => 15, 'role' => 'Líder de Preferência', 'img' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'],
    ['name' => 'Maria Luísa', 'count' => 8, 'role' => 'Autora do Mês', 'img' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'],
    ['name' => 'Jose Eduardo Agualusa', 'count' => 5, 'role' => 'Consagrado', 'img' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'],
];

$readingOfMonth = $books[0];
$physicalBooks = array_filter($books, fn($b) => $b['format'] === 'físico');
$ebooks = array_filter($books, fn($b) => $b['format'] === 'digital');
$freeBooks = array_filter($books, fn($b) => $b['price'] == 0);

?>

<div class="bg-white overflow-hidden font-sans text-brand-dark">
    <!-- 1. HERO SECTION -->
    <section class="min-h-screen section-fluid flex items-center relative overflow-hidden bg-white">
        <div class="absolute top-0 right-0 w-1/2 h-full bg-gray-50 skew-x-12 translate-x-1/3 -z-10 hidden lg:block"></div>

        <div class="container mx-auto grid lg:grid-cols-2 gap-10 sm:gap-16 items-center w-full">
            <div class="space-y-8 animate-fade-in">
                <div class="inline-flex items-center gap-3 px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-brand-primary/30">
                    <i data-lucide="zap" class="w-4 h-4 text-white animate-pulse"></i>
                    <span>🎉 Lançamento Oficial — Já Online</span>
                </div>

                <h1 class="uppercase leading-[0.9] tracking-tighter text-brand-dark">
                    Onde a Arte <br>
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-amber-600">
                        Encontra o Legado
                    </span>
                </h1>

                <p class="text-gray-500 font-medium max-w-lg leading-relaxed">
                    Curadoria de excelência para leitores que exigem o extraordinário. Conheça as vozes que moldam o futuro da cultura.
                </p>

                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                    <a href="/livros" class="px-10 py-5 bg-brand-dark text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/20 flex items-center justify-center gap-3 group text-center no-underline">
                        Explorar Acervo <i data-lucide="arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="/sobre" class="px-10 py-5 bg-white border border-gray-200 text-brand-dark font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all text-center no-underline">
                        A Nossa Essência
                    </a>
                </div>

                <div class="flex flex-wrap items-center gap-6 sm:gap-12 pt-8 sm:pt-12 border-t border-gray-100">
                    <div>
                        <p class="text-3xl sm:text-4xl font-black text-brand-dark"><?php echo $stats['booksCount']; ?>+</p>
                        <p class="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-bold mt-1">Obras Publicadas</p>
                    </div>
                    <div>
                        <p class="text-3xl sm:text-4xl font-black text-brand-dark"><?php echo $stats['readersCount']; ?>+</p>
                        <p class="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-bold mt-1">Leitores</p>
                    </div>
                </div>
            </div>

            <!-- Hero Image (Dynamic) -->
            <div id="hero-reading-container" class="relative hidden lg:block animate-fade-in" style="animation-delay: 0.2s;">
                <?php if ($readingOfMonth): ?>
                    <div class="relative z-10 w-full max-w-[280px] sm:max-w-[350px] lg:max-w-[450px] mx-auto">
                        <div class="relative group cursor-pointer" onclick="window.location.href='/livro/<?php echo $readingOfMonth['slug']; ?>'">
                            <div class="absolute inset-0 bg-brand-primary rounded-2xl rotate-6 group-hover:rotate-0 transition-transform duration-500"></div>
                            <img src="<?php echo $readingOfMonth['coverUrl']; ?>"
                                alt="<?php echo $readingOfMonth['title']; ?>"
                                class="relative w-full rounded-2xl shadow-2xl transition-transform duration-500 group-hover:-translate-y-4">
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <!-- 2. LEITURA DO MÊS (Dynamic) -->
    <div id="reading-of-month-container">
        <?php if ($readingOfMonth): ?>
            <section class="py-16 sm:py-24 md:py-32 bg-white relative overflow-hidden">
                <div class="container mx-auto px-4 sm:px-6 md:px-12">
                    <div class="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
                        <div class="relative aspect-[3/4] max-w-[280px] sm:max-w-sm lg:max-w-md mx-auto">
                            <div class="absolute inset-0 bg-brand-primary/5 blur-3xl rounded-full"></div>
                            <img src="<?php echo $readingOfMonth['coverUrl']; ?>"
                                alt="<?php echo $readingOfMonth['title']; ?>"
                                class="relative z-10 w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
                            <div class="absolute -bottom-4 -right-4 sm:-bottom-10 sm:-right-10 w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-brand-primary rounded-full flex items-center justify-center text-white text-center p-3 sm:p-6 shadow-2xl z-20 rotate-12">
                                <span class="text-[9px] sm:text-xs font-black uppercase tracking-[0.2em]">Leitura do <br> Mês</span>
                            </div>
                        </div>

                        <div class="space-y-4 sm:space-y-8">
                            <span class="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px] sm:text-xs">Destaque Editorial</span>
                            <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-brand-dark uppercase tracking-tighter leading-none">
                                <?php echo $readingOfMonth['title']; ?>
                            </h2>
                            <p class="text-lg sm:text-2xl font-serif italic text-gray-500"><?php echo $readingOfMonth['author']; ?></p>
                            <p class="text-base sm:text-xl text-gray-600 leading-relaxed font-light">
                                <?php echo $readingOfMonth['description']; ?>
                            </p>
                            <div class="pt-4 sm:pt-6">
                                <a href="/livro/<?php echo $readingOfMonth['slug']; ?>" class="inline-flex items-center justify-center px-12 py-5 bg-brand-dark text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-primary transition-all shadow-xl no-underline">
                                    Mergulhar na Obra <i data-lucide="book-open" class="ml-3 w-5 h-5"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        <?php endif; ?>
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
                <!-- JS populated -->
            </div>
        </div>
    </section>

    <!-- 4. LIVROS FÍSICOS -->
    <?php if (!empty($physicalBooks)): ?>
        <section id="physical-books-section" class="py-12 sm:py-16 md:py-24 bg-gray-50 px-4 sm:px-6 md:px-12">
            <div class="container mx-auto">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-16">
                    <div>
                        <span class="text-brand-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">Coleção Técnica & Literária</span>
                        <h2 class="text-2xl sm:text-4xl md:text-5xl font-black text-brand-dark mt-2 uppercase tracking-tight">Livros Físicos</h2>
                    </div>
                    <a href="/livros?type=physical" class="text-brand-dark font-black uppercase tracking-widest text-[10px] border-b-2 border-brand-primary pb-1 hover:text-brand-primary transition-all w-fit no-underline">
                        Ver Catálogo Completo
                    </a>
                </div>
                <div id="physical-books-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
                    <?php if (!empty($physicalBooks)) foreach ($physicalBooks as $book) include __DIR__ . '/../templates/book-card.php'; ?>
                </div>
            </div>
        </section>
    <?php endif; ?>

    <!-- 5. E-BOOKS -->
    <?php if (!empty($ebooks)): ?>
        <section id="digital-books-section" class="py-12 sm:py-16 md:py-24 bg-white px-4 sm:px-6 md:px-12">
            <div class="container mx-auto">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-16">
                    <div>
                        <span class="text-brand-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">Biblioteca Digital</span>
                        <h2 class="text-2xl sm:text-4xl md:text-5xl font-black text-brand-dark mt-2 uppercase tracking-tight">E-Books</h2>
                    </div>
                    <a href="/livros?type=digital" class="text-brand-dark font-black uppercase tracking-widest text-[10px] border-b-2 border-brand-primary pb-1 hover:text-brand-primary transition-all w-fit no-underline">
                        Explorar Digitais
                    </a>
                </div>
                <div id="digital-books-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
                    <?php if (!empty($ebooks)) foreach ($ebooks as $book) include __DIR__ . '/../templates/book-card.php'; ?>
                </div>
            </div>
        </section>
    <?php endif; ?>

    <!-- 6. MAIS VISTOS -->
    <section class="py-12 sm:py-16 md:py-24 bg-gray-50 px-4 sm:px-6 md:px-12">
        <div class="container mx-auto">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-16">
                <div>
                    <span class="text-brand-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">Tendências do Acervo</span>
                    <h2 class="text-2xl sm:text-4xl md:text-5xl font-black text-brand-dark mt-2 uppercase tracking-tight">Obras Mais Vistas</h2>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 bg-white text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                    <i data-lucide="eye" class="w-3 h-3"></i>
                    <span>Curiosidade em Alta</span>
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
                <?php
                $mostViewed = array_slice($books, 0, 4);
                foreach ($mostViewed as $book) include __DIR__ . '/../templates/book-card.php';
                ?>
            </div>
        </div>
    </section>

    <!-- 7. AUTORES DE SUCESSO -->
    <section class="py-12 sm:py-16 md:py-24 bg-white px-4 sm:px-6 md:px-12">
        <div class="container mx-auto">
            <div class="text-center mb-12 sm:mb-20">
                <h2 class="text-3xl sm:text-5xl md:text-6xl font-black text-brand-dark mt-2 uppercase tracking-tighter">Autores de Sucesso</h2>
            </div>
            <div id="authors-grid" class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <?php foreach ($authors as $i => $ta): ?>
                    <div class="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition-all group relative overflow-hidden cursor-pointer animate-fade-in" style="animation-delay: <?php echo $i * 0.1; ?>s">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-[60px] rounded-full group-hover:bg-brand-primary/10 transition-colors"></div>
                        <div class="flex flex-col items-center text-center space-y-6 relative z-10">
                            <div class="w-24 h-24 bg-white rounded-3xl overflow-hidden border-4 border-white shadow-lg">
                                <img src="<?php echo $ta['img']; ?>" alt="<?php echo $ta['name']; ?>" class="w-full h-full object-cover">
                            </div>
                            <div>
                                <h3 class="text-xl font-black text-brand-dark uppercase tracking-tight"><?php echo $ta['name']; ?></h3>
                                <p class="text-brand-primary text-[10px] font-black uppercase tracking-widest mt-1"><?php echo $ta['role']; ?></p>
                            </div>
                            <div class="px-6 py-3 bg-brand-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                                <?php echo $ta['count']; ?> Obras Registadas
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- 8. LIVROS GRATUITOS -->
    <?php if (!empty($freeBooks)): ?>
        <section id="free-books-section" class="py-12 sm:py-16 md:py-24 bg-brand-dark text-white px-4 sm:px-6 md:px-12">
            <div class="container mx-auto">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-16">
                    <div>
                        <span class="text-brand-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">Cultura Aberta</span>
                        <h2 class="text-2xl sm:text-4xl md:text-5xl font-black text-white mt-2 uppercase tracking-tight">Livros Gratuitos</h2>
                    </div>
                    <a href="/livros?price=free" class="text-brand-primary font-black uppercase tracking-widest text-[10px] border-b-2 border-brand-primary pb-1 hover:text-white transition-all w-fit no-underline">
                        Ver Tudo Grátis
                    </a>
                </div>
                <div id="free-books-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
                    <?php if (!empty($freeBooks)) foreach ($freeBooks as $book) include __DIR__ . '/../templates/book-card.php'; ?>
                </div>
            </div>
        </section>
    <?php endif; ?>

    <!-- 9. EXPERIENCE SECTION -->
    <section class="py-16 sm:py-24 md:py-32 bg-brand-dark text-white px-4 sm:px-6 md:px-12 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-primary blur-[120px] rounded-full"></div>
        </div>

        <div class="container grid lg:grid-cols-2 gap-12 sm:gap-20 items-center relative z-10">
            <div>
                <span class="text-brand-primary font-bold uppercase tracking-widest text-xs sm:text-sm">Experiência</span>
                <h2 class="text-3xl sm:text-5xl md:text-6xl font-black mt-4 mb-6 leading-tight uppercase tracking-tighter">
                    Mais que uma editora, <br>um movimento.
                </h2>
                <ul class="space-y-4 sm:space-y-6">
                    <li class="flex items-center gap-4 text-base sm:text-xl font-medium text-gray-300">
                        <i data-lucide="check-circle" class="w-6 h-6 text-brand-primary shrink-0"></i>
                        Acabamentos de luxo em cada edição.
                    </li>
                    <li class="flex items-center gap-4 text-base sm:text-xl font-medium text-gray-300">
                        <i data-lucide="check-circle" class="w-6 h-6 text-brand-primary shrink-0"></i>
                        Curadoria de autores angolanos.
                    </li>
                    <li class="flex items-center gap-4 text-base sm:text-xl font-medium text-gray-300">
                        <i data-lucide="check-circle" class="w-6 h-6 text-brand-primary shrink-0"></i>
                        Eventos exclusivos para membros.
                    </li>
                </ul>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div class="bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                    <i data-lucide="star" class="w-8 h-8 sm:w-10 sm:h-10 text-brand-primary mb-4 sm:mb-6"></i>
                    <h4 class="text-xl sm:text-2xl font-black mb-2">Premium</h4>
                    <p class="text-xs sm:text-sm text-gray-400">Qualidade inegociável em cada página impressa.</p>
                </div>
                <div class="bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors sm:translate-y-8 lg:translate-y-12">
                    <i data-lucide="clock" class="w-8 h-8 sm:w-10 sm:h-10 text-brand-primary mb-4 sm:mb-6"></i>
                    <h4 class="text-xl sm:text-2xl font-black mb-2">Eterno</h4>
                    <p class="text-xs sm:text-sm text-gray-400">Obras feitas para durar gerações.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 10. NEWSLETTER -->
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
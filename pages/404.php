<?php

/**
 * Editora Graça — 404 Not Found
 */
$pageTitle = "Página Não Encontrada";
require_once __DIR__ . '/../templates/header.php';
?>

<section class="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <div class="space-y-8 animate-fade-in">
        <div class="relative inline-block">
            <h1 class="text-[12rem] font-black text-brand-dark/5 leading-none">404</h1>
            <i data-lucide="book-open" class="w-20 h-20 text-brand-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"></i>
        </div>

        <div class="space-y-4">
            <h2 class="text-3xl font-black uppercase tracking-tighter text-brand-dark">Capítulo Perdido</h2>
            <p class="text-gray-500 max-w-sm mx-auto font-medium">
                A página que procura não existe ou foi movida para uma nova edição do nosso site.
            </p>
        </div>

        <div class="pt-8">
            <a href="/" class="btn-premium px-12 py-5 bg-brand-dark shadow-xl flex items-center justify-center gap-3 mx-auto w-fit">
                <i data-lucide="home" class="w-5 h-5"></i> Voltar ao Início
            </a>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>
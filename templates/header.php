<!DOCTYPE html>
<html lang="pt-AO">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <?php require_once __DIR__ . '/seo.php'; ?>

    <!-- CSS -->
    <link rel="stylesheet" href="/public/css/main.css">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Montserrat:ital,wght@0,300;0,400;0,600;0,700;0,900;1,400&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            primary: '#B78628',
                            dark: '#0F172A',
                            light: '#FFFFFF',
                            accent: '#334155',
                        }
                    },
                    fontFamily: {
                        serif: ['Montserrat', 'serif'],
                        sans: ['Roboto', 'sans-serif'],
                        body: ['Open Sans', 'sans-serif'],
                    }
                }
            }
        }
    </script>

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>


    <!-- Firebase SDK (Global) -->
    <script type="module" src="/public/js/firebase.js"></script>
</head>

<body>
    <header class="glass-premium fixed left-0 right-0 z-50 border-b border-gray-100 shadow-sm h-16 sm:h-20 lg:h-24 flex items-center transition-all safe-area-top">
        <div class="container flex justify-between items-center h-full gap-2">
            <!-- Brand -->
            <a href="/" class="flex items-center gap-3 group" aria-label="Editora Graça - Página inicial">
                <img src="/public/img/logo.png" alt="Logo" class="h-8 sm:h-10 w-auto md:h-12 object-contain">
                <div class="flex flex-col leading-[0.85] min-w-0">
                    <span class="font-serif font-black text-brand-dark text-[10px] sm:text-[13px] uppercase tracking-tight">Editora</span>
                    <span class="font-serif font-black text-brand-primary text-base sm:text-2xl uppercase tracking-tighter">Graça</span>
                </div>
            </a>

            <!-- Navigation -->
            <nav class="hidden md:flex items-center gap-10" aria-label="Navegação principal">
                <?php
                $navLinks = [
                    ['name' => 'Início', 'path' => '/'],
                    ['name' => 'Catálogo', 'path' => '/livros'],
                    ['name' => 'Blog', 'path' => '/blog'],
                    ['name' => 'Serviços', 'path' => '/servicos'],
                    ['name' => 'Portefólio', 'path' => '/projetos'],
                    ['name' => 'Sobre Nós', 'path' => '/sobre'],
                    ['name' => 'Contactos', 'path' => '/contacto'],
                ];
                $currentPath = $_SERVER['REQUEST_URI'];
                foreach ($navLinks as $link):
                    $isActive = ($link['path'] === '/' && $currentPath === '/') || ($link['path'] !== '/' && strpos($currentPath, $link['path']) === 0);
                ?>
                    <a href="<?php echo $link['path']; ?>"
                        class="text-sm font-bold uppercase tracking-widest transition-colors relative py-2 <?php echo $isActive ? 'text-brand-primary' : 'text-brand-dark/70 hover:text-brand-dark'; ?>">
                        <?php echo $link['name']; ?>
                        <?php if ($isActive): ?>
                            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"></div>
                        <?php endif; ?>
                    </a>
                <?php endforeach; ?>
            </nav>

            <!-- Actions -->
            <div class="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
                <button class="p-2 text-brand-dark/80 hover:text-brand-primary transition-colors rounded-full hover:bg-gray-50" aria-label="Pesquisar">
                    <i data-lucide="search" class="w-5 h-5"></i>
                </button>

                <a href="/login" class="p-2 text-brand-dark/80 hover:text-brand-primary transition-colors rounded-full hover:bg-gray-50" aria-label="Minha conta">
                    <i data-lucide="user" class="w-5 h-5"></i>
                </a>

                <a href="/carrinho" class="relative p-2 text-brand-dark/80 hover:text-brand-primary transition-colors rounded-full hover:bg-gray-50" aria-label="Carrinho">
                    <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                    <span id="cart-count" class="absolute top-1 right-1 w-4 h-4 bg-brand-primary text-white text-[9px] font-black flex items-center justify-center rounded-full hidden">0</span>
                </a>

                <button class="md:hidden p-2 text-brand-dark" aria-label="Abrir menu">
                    <i data-lucide="menu" class="w-6 h-6"></i>
                </button>
            </div>
        </div>
    </header>

    <main class="pt-16 sm:pt-20 lg:pt-24">
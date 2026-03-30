<?php

/**
 * Shared Admin Header / Navigation Template
 */
$current_page = $_SERVER['REQUEST_URI'];
?>

<div class="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
    <div class="space-y-4">
        <span class="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary">
            <?php
            if (strpos($current_page, '/utilizadores') !== false) echo "Comunidade Graça";
            elseif (strpos($current_page, '/encomendas') !== false) echo "Fluxo de Vendas";
            elseif (strpos($current_page, '/livros') !== false) echo "Gestão de Acervo";
            elseif (strpos($current_page, '/blog') !== false) echo "Conteúdo Editorial";
            elseif (strpos($current_page, '/manuscritos') !== false) echo "Novos Talentos";
            elseif (strpos($current_page, '/equipa') !== false) echo "Capital Humano";
            elseif (strpos($current_page, '/configuracoes') !== false) echo "Definições Gerais";
            else echo "Gestão Central";
            ?>
        </span>
        <h1 class="text-5xl font-black uppercase tracking-tighter text-brand-dark">
            <?php echo $pageTitle ?? "Dashboard"; ?>
        </h1>
    </div>

    <!-- Admin Nav -->
    <nav class="flex gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
        <?php
        $nav_items = [
            ['url' => '/admin', 'label' => 'Visão Geral'],
            ['url' => '/admin/livros', 'label' => 'Livros'],
            ['url' => '/admin/encomendas', 'label' => 'Encomendas'],
            ['url' => '/admin/utilizadores', 'label' => 'Utilizadores'],
            ['url' => '/admin/blog', 'label' => 'Blog'],
            ['url' => '/admin/manuscritos', 'label' => 'Manuscritos'],
            ['url' => '/admin/equipa', 'label' => 'Equipa'],
            ['url' => '/admin/configuracoes', 'label' => 'Configurações'],
        ];

        foreach ($nav_items as $item) {
            $is_active = ($current_page === $item['url'] || ($item['url'] === '/admin' && $current_page === '/admin/'));
            $class = $is_active
                ? "px-6 py-3 bg-brand-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-primary/20"
                : "px-6 py-3 text-gray-400 hover:bg-gray-50 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all";
            echo "<a href='{$item['url']}' class='{$class}'>{$item['label']}</a>";
        }
        ?>
    </nav>
</div>
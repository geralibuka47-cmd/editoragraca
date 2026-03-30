<?php

/**
 * Editora Graça — PHP Entry Point & Router
 */

$request = $_SERVER['REQUEST_URI'];
$base_path = ''; // Adjust if not in root

// Simple Routing
switch ($request) {
    case '/':
    case '/index.php':
        require __DIR__ . '/pages/index.php';
        break;
    case '/livros':
        require __DIR__ . '/pages/livros.php';
        break;
    case '/blog':
        require __DIR__ . '/pages/blog.php';
        break;
    case '/servicos':
        require __DIR__ . '/pages/servicos.php';
        break;
    case '/projetos':
        require __DIR__ . '/pages/projetos.php';
        break;
    case '/sobre':
        require __DIR__ . '/pages/sobre.php';
        break;
    case '/contacto':
        require __DIR__ . '/pages/contacto.php';
        break;
    case '/login':
        require __DIR__ . '/pages/login.php';
        break;
    case '/registo':
        require __DIR__ . '/pages/registo.php';
        break;
    case '/perfil':
        require __DIR__ . '/pages/perfil.php';
        break;
    case '/carrinho':
        require __DIR__ . '/pages/carrinho.php';
        break;
    case '/recuperar-senha':
        require __DIR__ . '/pages/recuperar-senha.php';
        break;
    case '/admin':
    case '/admin/':
        require __DIR__ . '/pages/admin/index.php';
        break;
    case '/admin/livros':
        require __DIR__ . '/pages/admin/livros.php';
        break;
    case '/admin/utilizadores':
        require __DIR__ . '/pages/admin/utilizadores.php';
        break;
    case '/admin/encomendas':
        require __DIR__ . '/pages/admin/encomendas.php';
        break;
    case '/admin/blog':
        require __DIR__ . '/pages/admin/blog.php';
        break;
    case '/admin/manuscritos':
        require __DIR__ . '/pages/admin/manuscritos.php';
        break;
    case '/admin/equipa':
        require __DIR__ . '/pages/admin/equipa.php';
        break;
    case '/admin/configuracoes':
        require __DIR__ . '/pages/admin/configuracoes.php';
        break;
    default:
        // Handle dynamic routes
        if (preg_match('/^\/livro\/([a-zA-Z0-9-]+)$/', $request, $matches)) {
            $_GET['slug'] = $matches[1];
            require __DIR__ . '/pages/livro.php';
        } else if (preg_match('/^\/equipa\/([a-zA-Z0-9-]+)$/', $request, $matches)) {
            $_GET['id'] = $matches[1];
            require __DIR__ . '/pages/equipa-detalhe.php';
        } else {
            http_response_code(404);
            require __DIR__ . '/pages/404.php';
        }
        break;
}

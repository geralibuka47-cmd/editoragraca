<?php

/**
 * Editora Graça — Blog Page (PHP Version)
 */
$pageTitle = "Diário Literário";
require_once __DIR__ . '/../templates/header.php';
?>

<section id="blog-main-container" class="section-fluid py-24 bg-gray-50 min-h-[60vh]">
    <!-- JS Populated: List or Single Article -->
    <div class="container flex justify-center py-24">
        <div class="flex flex-col items-center gap-4">
            <div class="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Sincronizando Crónicas...</p>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>

<!-- Blog Logic -->
<script type="module" src="/public/js/blog.js"></script>
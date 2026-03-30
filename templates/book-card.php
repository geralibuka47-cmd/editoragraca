<?php

/**
 * @var array $book O objeto do livro
 */
?>
<div class="card-premium group cursor-pointer" onclick="window.location.href='/livro/<?php echo $book['slug'] ?? $book['id']; ?>'">
    <div class="relative aspect-[3/4] overflow-hidden rounded-2xl mb-6">
        <img src="<?php echo $book['coverUrl']; ?>"
            alt="<?php echo $book['title']; ?>"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">

        <?php if (!empty($book['isNew'])): ?>
            <div class="absolute top-4 left-4 px-3 py-1 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                Novo
            </div>
        <?php endif; ?>

        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button class="p-4 bg-white text-brand-dark rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-2xl translate-y-4 group-hover:translate-y-0 duration-300">
                <i data-lucide="eye" class="w-5 h-5"></i>
            </button>
            <button class="p-4 bg-brand-primary text-white rounded-2xl hover:bg-brand-dark transition-all shadow-2xl translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                <i data-lucide="shopping-cart" class="w-5 h-5"></i>
            </button>
        </div>
    </div>

    <div class="space-y-2">
        <h3 class="text-lg font-black text-brand-dark leading-tight uppercase line-clamp-1"><?php echo $book['title']; ?></h3>
        <p class="text-xs text-brand-gray font-bold uppercase tracking-widest"><?php echo $book['author']; ?></p>

        <div class="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
            <span class="text-xl font-black text-brand-primary">
                <?php echo $book['price'] > 0 ? number_format($book['price'], 0, ',', '.') . " Kz" : "Gratuito"; ?>
            </span>
            <div class="flex items-center gap-1 text-amber-500">
                <i data-lucide="star" class="w-3 h-3 fill-current"></i>
                <span class="text-xs font-black"><?php echo $book['stats']['averageRating'] ?? '5.0'; ?></span>
            </div>
        </div>
    </div>
</div>
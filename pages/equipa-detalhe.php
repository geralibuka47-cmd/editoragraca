<?php
$pageTitle = "Membro da Equipa";
require_once __DIR__ . '/../templates/header.php';
?>

<script>
    window.MEMBER_ID = "<?php echo $_GET['id'] ?? ''; ?>";
</script>

<div id="loading-state" class="min-h-screen flex items-center justify-center bg-white">
    <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <span class="text-xs font-black uppercase tracking-widest text-gray-400">A carregar perfil...</span>
    </div>
</div>

<div id="member-detail-container" class="hidden min-h-screen bg-white overflow-x-hidden">
    <!-- Hero Section -->
    <section class="relative h-[80vh] md:h-[90vh] overflow-hidden bg-brand-dark">
        <div class="absolute inset-0 z-0">
            <img id="member-photo" src="" alt="" class="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000 hidden">
            <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent"></div>
        </div>

        <div class="absolute inset-0 z-10 container mx-auto px-6 md:px-12 flex flex-col justify-end pb-24 md:pb-32">
            <a href="/contacto" class="group flex items-center gap-3 text-white/60 hover:text-brand-primary transition-all mb-12 w-fit bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i>
                <span class="text-[10px] font-black uppercase tracking-[0.3em]">Perfil da Equipa</span>
            </a>

            <div class="space-y-6 max-w-5xl">
                <div class="flex items-center gap-4">
                    <div class="h-px w-12 bg-brand-primary"></div>
                    <span id="member-department" class="text-brand-primary font-black uppercase tracking-[0.5em] text-[10px]">DEPARTAMENTO</span>
                </div>

                <h1 id="member-name" class="text-6xl md:text-[8rem] font-black text-white tracking-tighter leading-none uppercase">
                    CARREGANDO...
                </h1>

                <p id="member-role" class="text-2xl md:text-3xl text-gray-400 font-light italic">
                    CARGO
                </p>
            </div>
        </div>
    </section>

    <!-- Content Section -->
    <section class="py-32 bg-white relative z-10">
        <div class="container mx-auto px-6 md:px-12">
            <div class="grid lg:grid-cols-12 gap-24 items-start">
                <!-- Sidebar -->
                <div class="lg:col-span-4 space-y-20">
                    <div class="space-y-8">
                        <div class="space-y-2">
                            <span class="text-brand-primary font-black uppercase tracking-[0.4em] text-[10px]">Contactos</span>
                            <h3 class="text-3xl font-black text-brand-dark tracking-tighter uppercase leading-none">Ligação Direta</h3>
                        </div>
                        <div id="member-socials" class="flex flex-wrap gap-4">
                            <!-- Social links injected via JS -->
                        </div>
                    </div>

                    <div class="p-10 rounded-[3rem] bg-brand-dark text-white space-y-10 relative overflow-hidden">
                        <i data-lucide="quote" class="w-12 h-12 text-brand-primary opacity-40 absolute -top-2 -left-2"></i>
                        <div class="relative z-10 space-y-8">
                            <p class="text-xl font-light leading-relaxed italic opacity-90">
                                "O meu compromisso é com a verdade literária e a excelência que cada autor merece transpor para o papel."
                            </p>
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
                                    <i data-lucide="sparkles" class="w-5 h-5 text-white"></i>
                                </div>
                                <span class="text-[10px] font-black uppercase tracking-widest">Manifesto Pessoal</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bio -->
                <div class="lg:col-span-8 space-y-24">
                    <div class="space-y-12">
                        <div class="inline-flex items-center gap-4 bg-gray-100 px-6 py-2 rounded-full border border-gray-200">
                            <i data-lucide="map-pin" class="w-4 h-4 text-brand-primary"></i>
                            <span class="text-[10px] font-black uppercase tracking-widest text-brand-dark">Base em Luanda, Angola</span>
                        </div>
                        <h2 class="text-5xl md:text-7xl font-black text-brand-dark tracking-tighter uppercase leading-[0.9]">
                            Arquitectando <br />
                            <span class="text-gray-300 italic font-light lowercase">a visão</span> Editorial
                        </h2>
                        <div id="member-bio" class="text-gray-500 font-medium leading-relaxed text-xl whitespace-pre-line">
                            <!-- Bio injected via JS -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Author's Books -->
    <section id="author-books-section" class="py-24 bg-gray-50 hidden">
        <div class="container mx-auto px-6 md:px-12">
            <div class="mb-16">
                <span class="text-brand-primary font-black uppercase tracking-[0.4em] text-[10px]">Catálogo Autoral</span>
                <h2 class="text-4xl md:text-6xl font-black text-brand-dark tracking-tighter uppercase mt-2">Obras do Autor</h2>
            </div>

            <div id="author-books-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                <!-- Books injected via JS -->
            </div>
        </div>
    </section>
</div>

<!-- JS -->
<script type="module" src="/public/js/team-detail.js"></script>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>
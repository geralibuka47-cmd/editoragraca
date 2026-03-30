<?php

/**
 * Editora Graça — Contact Page (PHP Version)
 */
$pageTitle = "Contacto & Concierge";
require_once __DIR__ . '/../templates/header.php';
?>

<section class="section-fluid py-24 bg-brand-dark text-white relative overflow-hidden">
    <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-primary blur-[150px] rounded-full"></div>
    </div>

    <div class="container relative z-10 grid lg:grid-cols-2 gap-20 items-center">
        <div class="space-y-10">
            <nav class="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest text-white/40">
                <a href="/" class="hover:text-brand-primary transition-colors">Início</a>
                <i data-lucide="chevron-right" class="w-3 h-3"></i>
                <span class="text-white">Contacto</span>
            </nav>

            <h1 class="text-6xl sm:text-8xl font-black uppercase leading-[0.8] tracking-tighter">
                Fale com <br><span class="text-gradient-gold italic font-serif font-normal lowercase">a Graça</span>
            </h1>
            <p class="text-gray-400 font-medium max-w-md leading-relaxed">
                Seja para submeter um manuscrito ou solicitar informações, a nossa equipa está pronta para o atender com exclusividade.
            </p>

            <div class="space-y-8 pt-8">
                <div class="flex items-center gap-6 group">
                    <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                        <i data-lucide="mail" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-white/30">E-mail Direto</p>
                        <p class="font-bold text-lg">info@editoragraca.ao</p>
                    </div>
                </div>
                <div class="flex items-center gap-6 group">
                    <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                        <i data-lucide="phone" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-white/30">Telefone / WhatsApp</p>
                        <p class="font-bold text-lg">+244 923 000 000</p>
                    </div>
                </div>
                <div class="flex items-center gap-6 group">
                    <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                        <i data-lucide="map-pin" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-white/30">Sede Social</p>
                        <p class="font-bold text-lg">Luanda, Angola</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white p-10 rounded-[3rem] shadow-2xl relative z-10 text-brand-dark">
            <h3 class="text-xl font-black uppercase tracking-tight mb-8">Envie uma Mensagem</h3>
            <form id="contact-form" class="space-y-6">
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-brand-primary ml-2">Nome Completo</label>
                    <input type="text" required class="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none text-xs font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all">
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-brand-primary ml-2">E-mail Profissional</label>
                    <input type="email" required class="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none text-xs font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all">
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-brand-primary ml-2">Assunto</label>
                    <select class="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none text-xs font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all">
                        <option>Dúvida Geral</option>
                        <option>Submissão de Manuscrito</option>
                        <option>Parceria Institucional</option>
                        <option>Suporte ao Leitor</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-brand-primary ml-2">Mensagem</label>
                    <textarea rows="4" required class="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none text-xs font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all"></textarea>
                </div>
                <button type="submit" class="w-full py-5 bg-brand-dark text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-primary transition-all shadow-xl flex items-center justify-center gap-3">
                    Enviar Mensagem <i data-lucide="send" class="w-4 h-4"></i>
                </button>
            </form>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>
<?php

/**
 * Editora Graça — Registar (100% Parity)
 */
$pageTitle = "Criar Conta";
require_once __DIR__ . '/../templates/header.php';
?>

<div class="min-h-screen bg-[#B78628] flex items-center justify-center p-4 md:p-10 selection:bg-[#B78628] selection:text-white font-sans overflow-hidden">
    <!-- ReCAPTCHA Hidden Container -->
    <div id="recaptcha-container"></div>

    <div class="w-full max-w-[500px] bg-[#0F172A] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-visible border border-white/5 flex flex-col max-h-[90vh] animate-fade-in">

        <!-- Avatar Circle -->
        <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#1E293B] rounded-full flex items-center justify-center shadow-lg border-4 border-[#0F172A] z-10">
            <div class="relative">
                <i data-lucide="user" class="w-12 h-12 text-gray-400"></i>
                <div class="absolute bottom-0 right-0 w-6 h-6 bg-[#B78628] rounded-full border-2 border-[#0F172A] flex items-center justify-center">
                    <span class="text-[10px] text-white font-bold">+</span>
                </div>
            </div>
        </div>

        <!-- Inner Scrollable Container -->
        <div class="flex-1 overflow-y-auto p-8 md:p-12 pt-16 custom-scrollbar">

            <!-- Tabs -->
            <div class="flex gap-12 justify-center mb-10">
                <a href="/login" class="relative pb-2 font-black text-lg uppercase tracking-widest text-gray-500 hover:text-gray-400 transition-all no-underline">
                    Entrar
                </a>
                <button class="relative pb-2 font-black text-lg uppercase tracking-widest text-white transition-all active-tab">
                    Registar
                    <div class="tab-underline absolute bottom-0 left-0 w-full h-1 bg-[#B78628] rounded-full"></div>
                </button>
            </div>

            <div id="reg-success" class="hidden p-8 bg-green-500/10 border border-green-500/20 rounded-3xl text-center space-y-6 animate-scale-up">
                <div class="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <i data-lucide="check" class="w-8 h-8"></i>
                </div>
                <p class="text-green-400 font-black text-lg uppercase tracking-tighter">Conta Criada!</p>
                <p class="text-green-500/70 text-xs font-medium">A redirecionar para o login...</p>
                <a href="/login" class="block w-full bg-[#B78628] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest no-underline">Ir para Login</a>
            </div>

            <div id="reg-form-container">
                <!-- Role Selector -->
                <div class="grid grid-cols-2 gap-4 mb-8">
                    <button type="button" onclick="setRegRole('leitor')" id="role-leitor" class="role-btn py-5 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest border-2 bg-[#B78628] border-[#B78628] text-white shadow-lg">
                        <i data-lucide="book-open" class="w-6 h-6 mb-1"></i>
                        Leitor
                    </button>
                    <button type="button" onclick="setRegRole('autor')" id="role-autor" class="role-btn py-5 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest border-2 bg-[#1E293B] border-transparent text-gray-500 hover:text-gray-400">
                        <i data-lucide="sparkles" class="w-6 h-6 mb-1"></i>
                        Autor
                    </button>
                </div>

                <!-- Error Messages -->
                <div id="reg-error" class="hidden mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center"></div>

                <!-- EMAIL FORM -->
                <div id="reg-method-email" class="reg-section block animate-fade-in">
                    <form id="reg-form-email" class="space-y-8">
                        <div class="space-y-3">
                            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Nome Completo</label>
                            <div class="relative group">
                                <div class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"><i data-lucide="user" class="w-5 h-5"></i></div>
                                <input type="text" id="reg-name" required placeholder="Seu nome" class="w-full bg-[#1E293B] border-none rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#B78628] transition-all outline-none">
                            </div>
                        </div>
                        <div class="space-y-3">
                            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email</label>
                            <div class="relative group">
                                <div class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"><i data-lucide="mail" class="w-5 h-5"></i></div>
                                <input type="email" id="reg-email" required placeholder="seu@email.com" class="w-full bg-[#1E293B] border-none rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#B78628] transition-all outline-none">
                            </div>
                        </div>
                        <div class="space-y-3">
                            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Palavra-passe</label>
                            <div class="relative group">
                                <div class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"><i data-lucide="lock" class="w-5 h-5"></i></div>
                                <input type="password" id="reg-password" required placeholder="••••••••" class="w-full bg-[#1E293B] border-none rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#B78628] transition-all outline-none">
                            </div>
                        </div>
                        <button type="submit" id="btn-submit-reg" class="w-full py-5 rounded-2xl bg-[#B78628] hover:bg-[#A37824] text-white text-sm font-black uppercase tracking-[0.3em] shadow-lg shadow-[#B78628]/20 transition-all active:scale-[0.98]">
                            Confirmar Registo
                        </button>
                    </form>
                </div>

                <!-- PHONE FORM -->
                <div id="reg-method-phone" class="reg-section hidden animate-fade-in">
                    <!-- Similar to Login but with Name -->
                    <div id="p-step-1" class="space-y-8">
                        <div class="space-y-3">
                            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Nome Completo</label>
                            <div class="relative">
                                <div class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"><i data-lucide="user" class="w-5 h-5"></i></div>
                                <input type="text" id="reg-phone-name" placeholder="Seu nome" class="w-full bg-[#1E293B] border-none rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold focus:ring-2 focus:ring-[#B78628] outline-none">
                            </div>
                        </div>
                        <div class="space-y-3">
                            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Número de Telemóvel</label>
                            <div class="flex gap-3">
                                <div class="flex items-center gap-2 px-4 py-4 bg-[#1E293B] rounded-2xl text-xs font-black text-white shrink-0">🇦🇴 +244</div>
                                <input type="tel" id="reg-phone" placeholder="912 345 678" class="flex-1 px-5 py-4 bg-[#1E293B] border-none rounded-2xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-[#B78628]">
                            </div>
                        </div>
                        <button onclick="sendRegOTP()" id="btn-reg-send-otp" class="w-full py-5 rounded-2xl bg-[#B78628] hover:bg-[#A37824] text-white text-sm font-black uppercase tracking-[0.3em] shadow-lg shadow-[#B78628]/20">Enviar SMS</button>
                    </div>

                    <div id="p-step-2" class="space-y-8 hidden text-center">
                        <div class="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                            <p class="text-[10px] font-black text-white uppercase tracking-widest">Código Enviado!</p>
                            <p id="disp-reg-phone" class="text-[10px] text-gray-500 font-medium"></p>
                        </div>
                        <input type="number" id="reg-otp" placeholder="000000" class="w-full bg-[#1E293B] border-none rounded-2xl py-6 text-3xl font-black text-white text-center tracking-[0.5em] outline-none focus:ring-2 focus:ring-[#B78628]">
                        <button onclick="confirmRegOTP()" id="btn-reg-confirm-otp" class="w-full py-5 rounded-2xl bg-[#B78628] hover:bg-[#A37824] text-white text-sm font-black uppercase tracking-[0.3em]">Confirmar e Entrar</button>
                    </div>
                </div>

                <!-- Footer Toggle -->
                <div class="mt-10 pt-8 border-t border-white/5 text-center space-y-6">
                    <button id="toggle-reg-method" onclick="toggleRegMethod()" class="text-[10px] font-black uppercase tracking-[0.2em] text-[#B78628] hover:text-white transition-colors">
                        Registar via Telemóvel
                    </button>
                    <div class="pt-2">
                        <a href="/" class="inline-flex px-6 py-3 bg-[#1E293B] hover:bg-[#2D3748] text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all border border-white/10 shadow-lg no-underline">
                            Voltar ao Início
                        </a>
                    </div>
                    <p class="text-[9px] text-gray-600 uppercase tracking-widest leading-relaxed">
                        Ao registar-se, aceita os nossos protocolos<br />de privacidade e termos de uso.
                    </p>
                </div>
            </div>

        </div>
    </div>
</div>

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(183, 134, 40, 0.2);
        border-radius: 10px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(183, 134, 40, 0.5);
    }

    .active-tab .tab-underline {
        display: block;
    }

    .reg-section.hidden {
        display: none;
    }
</style>

<script type="module" src="/public/js/register.js"></script>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>
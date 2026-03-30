<?php

/**
 * Editora Graça — Entrar (100% Parity)
 */
$pageTitle = "Entrar";
require_once __DIR__ . '/../templates/header.php';
?>

<div class="min-h-screen bg-[#B78628] flex items-center justify-center p-4 md:p-10 selection:bg-[#B78628] selection:text-white font-sans overflow-hidden">
    <!-- ReCAPTCHA Hidden Container -->
    <div id="recaptcha-container-login"></div>

    <div class="w-full max-w-[480px] bg-[#0F172A] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-visible border border-white/5 flex flex-col max-h-[90vh] animate-fade-in">

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
            <div class="flex gap-12 justify-center mb-12 mt-8">
                <button onclick="switchAuthMethod('email')" id="tab-btn-email" class="relative pb-2 font-black text-lg uppercase tracking-widest transition-all text-white active-tab">
                    Entrar
                    <div class="tab-underline absolute bottom-0 left-0 w-full h-1 bg-[#B78628] rounded-full"></div>
                </button>
                <a href="/registo" class="relative pb-2 font-black text-lg uppercase tracking-widest text-gray-500 hover:text-gray-400 transition-all no-underline">
                    Registar
                </a>
            </div>

            <!-- Error Messages -->
            <div id="auth-error" class="hidden mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center animate-shake"></div>

            <!-- EMAIL FORM -->
            <div id="auth-method-email" class="auth-section block animate-fade-in">
                <form id="login-form-email" class="space-y-8">
                    <div class="space-y-3">
                        <label class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email</label>
                        <div class="relative group">
                            <div class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                                <i data-lucide="mail" class="w-5 h-5"></i>
                            </div>
                            <input type="email" id="login-email" required placeholder="seu@email.com" class="w-full bg-[#1E293B] border-none rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#B78628] transition-all outline-none">
                        </div>
                    </div>

                    <div class="space-y-3">
                        <label class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Palavra-passe</label>
                        <div class="relative group">
                            <div class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                                <i data-lucide="lock" class="w-5 h-5"></i>
                            </div>
                            <input type="password" id="login-password" required placeholder="••••••••" class="w-full bg-[#1E293B] border-none rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#B78628] transition-all outline-none">
                        </div>
                    </div>

                    <button type="submit" id="btn-submit-email" class="w-full py-5 rounded-2xl bg-[#B78628] hover:bg-[#A37824] text-white text-sm font-black uppercase tracking-[0.3em] shadow-lg shadow-[#B78628]/20 transition-all active:scale-[0.98]">
                        Confirmar
                    </button>

                    <div class="text-center pt-4">
                        <a href="/recuperar-senha" class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors border-b border-gray-500/30 pb-1 no-underline">
                            Esqueceu a sua palavra-passe?
                        </a>
                    </div>
                </form>
            </div>

            <!-- PHONE FORM -->
            <div id="auth-method-phone" class="auth-section hidden animate-fade-in">
                <div id="phone-step-1" class="space-y-8">
                    <div class="space-y-3">
                        <label class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Número de Telemóvel</label>
                        <div class="flex gap-3">
                            <div class="flex items-center gap-2 px-4 py-4 bg-[#1E293B] rounded-2xl text-xs font-black text-white shrink-0">
                                🇦🇴 +244
                            </div>
                            <input type="tel" id="login-phone" placeholder="912 345 678" class="flex-1 px-5 py-4 bg-[#1E293B] border-none rounded-2xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-[#B78628] transition-all">
                        </div>
                    </div>
                    <button onclick="sendOTP()" id="btn-send-otp" class="w-full py-5 rounded-2xl bg-[#B78628] hover:bg-[#A37824] text-white text-sm font-black uppercase tracking-[0.3em] shadow-lg shadow-[#B78628]/20 transition-all">
                        Enviar SMS
                    </button>
                </div>

                <div id="phone-step-2" class="space-y-8 hidden text-center">
                    <div class="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                        <p class="text-[10px] font-black text-white uppercase tracking-widest">Código Enviado!</p>
                        <p id="display-phone" class="text-[10px] text-gray-500 font-medium"></p>
                    </div>
                    <input type="number" id="login-otp" placeholder="000000" class="w-full bg-[#1E293B] border-none rounded-2xl py-6 text-3xl font-black text-white text-center tracking-[0.5em] outline-none focus:ring-2 focus:ring-[#B78628]">
                    <button onclick="confirmOTP()" id="btn-confirm-otp" class="w-full py-5 rounded-2xl bg-[#B78628] hover:bg-[#A37824] text-white text-sm font-black uppercase tracking-[0.3em]">
                        Entrar
                    </button>
                    <button onclick="resetPhoneStep()" class="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white mt-4">Alterar Número</button>
                </div>
            </div>

            <!-- Divider & Socials -->
            <div class="mt-8 pt-8 border-t border-white/5 space-y-6">
                <button onclick="loginWithGoogle()" class="w-full py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all border border-white/5">
                    <svg class="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.896 4.14-1.236 1.236-3.156 2.508-6.192 2.508-4.8 0-8.52-3.888-8.52-8.688S7.44 3.48 12.24 3.48c2.604 0 4.512 1.02 5.904 2.34l2.304-2.304C18.18 1.488 15.528 0 12.24 0 5.484 0 0 5.484 0 12.24s5.484 12.24 12.24 12.24c3.636 0 6.384-1.2 8.64-3.564 2.256-2.256 2.964-5.412 2.964-7.848 0-.768-.06-1.5-.18-2.16h-11.412z" />
                    </svg>
                    Autenticação com Google
                </button>

                <div class="text-center">
                    <button id="toggle-method-btn" onclick="toggleAuthMethod()" class="text-[10px] font-black uppercase tracking-[0.2em] text-[#B78628] hover:text-white transition-colors">
                        Aceder via Telemóvel
                    </button>
                </div>

                <div class="text-center">
                    <a href="/" class="inline-flex px-6 py-3 bg-[#1E293B] hover:bg-[#2D3748] text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all border border-white/10 shadow-lg no-underline">
                        Voltar ao Início
                    </a>
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

    @keyframes shake {

        0%,
        100% {
            transform: translateX(0);
        }

        25% {
            transform: translateX(-5px);
        }

        75% {
            transform: translateX(5px);
        }
    }

    .animate-shake {
        animation: shake 0.4s ease-in-out;
    }
</style>

<script type="module" src="/public/js/login.js"></script>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>
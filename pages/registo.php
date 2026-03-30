<?php

/**
 * Editora Graça — Register Page (PHP Version)
 */
$pageTitle = "Criar Conta";
require_once __DIR__ . '/../templates/header.php';
?>

<section class="min-h-[80vh] flex items-center justify-center py-20 px-4 bg-gray-50">
    <div class="w-full max-w-md space-y-8 animate-fade-in">
        <div class="text-center">
            <h1 class="text-4xl font-black uppercase tracking-tighter text-brand-dark">Junte-se a Nós</h1>
            <p class="text-gray-400 font-medium text-sm mt-2 uppercase tracking-widest">Faça parte da nova era literária angolana</p>
        </div>

        <div class="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-brand-dark/5">
            <form id="register-form" class="space-y-6">
                <div class="space-y-1.5">
                    <label for="name" class="text-[10px] font-black uppercase tracking-widest text-brand-primary ml-2">Nome Completo</label>
                    <div class="relative">
                        <i data-lucide="user" class="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                        <input type="text" id="name" required placeholder="Como deseja ser chamado"
                            class="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-none text-xs font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all">
                    </div>
                </div>

                <div class="space-y-1.5">
                    <label for="email" class="text-[10px] font-black uppercase tracking-widest text-brand-primary ml-2">E-mail</label>
                    <div class="relative">
                        <i data-lucide="mail" class="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                        <input type="email" id="email" required placeholder="seu@email.com"
                            class="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-none text-xs font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all">
                    </div>
                </div>

                <div class="space-y-1.5">
                    <label for="password" class="text-[10px] font-black uppercase tracking-widest text-brand-primary ml-2">Senha</label>
                    <div class="relative">
                        <i data-lucide="lock" class="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                        <input type="password" id="password" required placeholder="Mínimo 6 caracteres"
                            class="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-none text-xs font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all">
                    </div>
                </div>

                <div id="error-message" class="hidden p-4 bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center"></div>

                <button type="submit" id="btn-submit" class="w-full py-5 bg-brand-dark text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/10 flex items-center justify-center gap-3">
                    <span>Criar Minha Conta</span>
                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                </button>
            </form>

            <div class="relative my-8">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-100"></div>
                </div>
                <div class="relative flex justify-center text-[9px] font-black uppercase tracking-widest"><span class="bg-white px-4 text-gray-300">ou registe-se com</span></div>
            </div>

            <button id="btn-google" class="w-full py-4 bg-white border border-gray-100 text-brand-dark font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" class="w-4 h-4" alt="Google">
                Google Account
            </button>
        </div>

        <p class="text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
            Já tem uma conta? <a href="/login" class="text-brand-primary hover:underline">Iniciar Sessão</a>
        </p>
    </div>
</section>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>

<!-- Register Logic -->
<script type="module">
    import {
        register
    } from '/public/js/auth.js';

    const registerForm = document.getElementById('register-form');
    const submitBtn = document.getElementById('btn-submit');
    const errorMsg = document.getElementById('error-message');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        errorMsg.classList.add('hidden');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Registando...';
        lucide.createIcons();

        try {
            await register(email, password, name);
            window.location.href = '/perfil';
        } catch (err) {
            errorMsg.textContent = err;
            errorMsg.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Criar Minha Conta</span> <i data-lucide="sparkles" class="w-4 h-4"></i>';
            lucide.createIcons();
        }
    });

    // Google Login Placeholder
    document.getElementById('btn-google').addEventListener('click', () => {
        alert('O login com Google será ativado na próxima fase.');
    });
</script>
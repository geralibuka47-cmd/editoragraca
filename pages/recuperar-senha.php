<?php
$pageTitle = "Recuperar Senha";
require_once __DIR__ . '/../templates/header.php';
?>

<div class="min-h-screen bg-white flex items-center justify-center py-20 px-6">
    <div class="w-full max-w-md space-y-12 animate-fade-in">
        <div class="text-center space-y-4">
            <span class="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px]">Segurança</span>
            <h1 class="text-5xl font-black text-brand-dark uppercase tracking-tighter leading-none">
                Recuperar <br /> <span class="text-brand-primary">Senha</span>
            </h1>
            <p class="text-gray-400 font-medium text-sm">Insira o seu e-mail para receber um link de redefinição.</p>
        </div>

        <form id="recover-form" class="space-y-6">
            <div class="space-y-2">
                <label for="email" class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Endereço de E-mail</label>
                <input
                    type="email"
                    id="email"
                    required
                    class="w-full px-8 py-6 bg-gray-50 border-none rounded-[2rem] text-lg font-black outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                    placeholder="email@exemplo.com">
            </div>

            <div id="error-message" class="hidden p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold text-center animate-shake"></div>
            <div id="success-message" class="hidden p-6 bg-green-50 text-green-600 rounded-[2rem] text-sm font-bold text-center border-2 border-green-100">
                <i data-lucide="check-circle" class="w-8 h-8 mx-auto mb-2 text-green-500"></i>
                Link enviado! Verifique a sua caixa de entrada.
            </div>

            <button
                type="submit"
                id="submit-btn"
                class="w-full py-6 bg-brand-dark text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-primary transition-all shadow-2xl shadow-brand-dark/20 flex items-center justify-center gap-3">
                <i data-lucide="send" class="w-4 h-4"></i>
                ENVIAR LINK
            </button>
        </form>

        <div class="text-center pt-8">
            <a href="/login" class="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-primary transition-all">
                Voltar para o Login
            </a>
        </div>
    </div>
</div>

<script type="module">
    import {
        forgotPassword
    } from '/public/js/auth.js';

    const form = document.getElementById('recover-form');
    const submitBtn = document.getElementById('submit-btn');
    const errorMsg = document.getElementById('error-message');
    const successMsg = document.getElementById('success-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;

        errorMsg.classList.add('hidden');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>';

        try {
            await forgotPassword(email);
            form.querySelector('.space-y-2').classList.add('hidden');
            submitBtn.classList.add('hidden');
            successMsg.classList.remove('hidden');
        } catch (error) {
            errorMsg.textContent = error;
            errorMsg.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i data-lucide="send" class="w-4 h-4"></i> ENVIAR LINK';
            if (window.lucide) window.lucide.createIcons();
        }
    });

    if (window.lucide) window.lucide.createIcons();
</script>

<?php require_once __DIR__ . '/../templates/footer.php'; ?>
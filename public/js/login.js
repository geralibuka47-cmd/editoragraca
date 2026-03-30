/**
 * Editora Graça — Login Controller (100% Parity)
 */
import { auth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from './firebase-config.js';
import { onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

let confirmationResult = null;
let currentMethod = 'email';

document.addEventListener('DOMContentLoaded', () => {
    initRecaptcha();
    bindEvents();
});

function initRecaptcha() {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container-login', {
        'size': 'invisible',
        'callback': (response) => { }
    }, auth);
}

function bindEvents() {
    const emailForm = document.getElementById('login-form-email');
    emailForm?.addEventListener('submit', handleEmailLogin);
}

window.switchAuthMethod = (method) => {
    currentMethod = method;
    document.querySelectorAll('.auth-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`auth-method-${method}`).classList.remove('hidden');

    const emailTab = document.getElementById('tab-btn-email');
    const toggleBtn = document.getElementById('toggle-method-btn');

    if (method === 'email') {
        emailTab.classList.add('text-white');
        emailTab.classList.remove('text-gray-500');
        emailTab.querySelector('.tab-underline').classList.remove('hidden');
        if (toggleBtn) toggleBtn.textContent = 'Aceder via Telemóvel';
    } else {
        emailTab.classList.remove('text-white');
        emailTab.classList.add('text-gray-500');
        emailTab.querySelector('.tab-underline').classList.add('hidden');
        if (toggleBtn) toggleBtn.textContent = 'Aceder via Email';
    }
};

window.toggleAuthMethod = () => {
    switchAuthMethod(currentMethod === 'email' ? 'phone' : 'email');
};

async function handleEmailLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('auth-error');
    const btn = document.getElementById('btn-submit-email');

    errorDiv.classList.add('hidden');
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin mx-auto text-white"></i>';
    if (window.lucide) window.lucide.createIcons();

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = '/';
    } catch (error) {
        console.error("Login error:", error);
        errorDiv.textContent = "Acesso recusado. Verifique as suas credenciais.";
        errorDiv.classList.remove('hidden');
        btn.disabled = false;
        btn.textContent = "Confirmar";
    }
}

window.sendOTP = async () => {
    const phone = document.getElementById('login-phone').value;
    const errorDiv = document.getElementById('auth-error');
    const btn = document.getElementById('btn-send-otp');

    if (phone.length < 9) {
        alert("Número inválido.");
        return;
    }

    btn.disabled = true;
    try {
        const fullNumber = '+244' + phone.replace(/\D/g, '');
        confirmationResult = await signInWithPhoneNumber(auth, fullNumber, window.recaptchaVerifier);

        document.getElementById('display-phone').textContent = `+244 ${phone}`;
        document.getElementById('phone-step-1').classList.add('hidden');
        document.getElementById('phone-step-2').classList.remove('hidden');
    } catch (error) {
        console.error("OTP Error:", error);
        alert("Erro ao enviar SMS. Verifique o número.");
        btn.disabled = false;
    }
};

window.confirmOTP = async () => {
    const code = document.getElementById('login-otp').value;
    const btn = document.getElementById('btn-confirm-otp');

    if (code.length < 6) return;

    btn.disabled = true;
    try {
        await confirmationResult.confirm(code);
        window.location.href = '/';
    } catch (error) {
        console.error("OTP Confirm Error:", error);
        alert("Código inválido.");
        btn.disabled = false;
    }
};

window.resetPhoneStep = () => {
    document.getElementById('phone-step-2').classList.add('hidden');
    document.getElementById('phone-step-1').classList.remove('hidden');
    document.getElementById('btn-send-otp').disabled = false;
};

window.loginWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        window.location.href = '/';
    } catch (error) {
        console.error("Google Login Error:", error);
        alert("Erro ao entrar com Google.");
    }
};

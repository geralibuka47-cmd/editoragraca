/**
 * Editora Graça — Register Controller (100% Parity)
 */
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from './firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { db } from './firebase-config.js';

let currentRole = 'leitor';
let currentMethod = 'email';
let confirmationResult = null;

document.addEventListener('DOMContentLoaded', () => {
    initRecaptcha();
    bindEvents();
});

function initRecaptcha() {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible'
    }, auth);
}

function bindEvents() {
    const emailForm = document.getElementById('reg-form-email');
    emailForm?.addEventListener('submit', handleEmailRegister);
}

window.setRegRole = (role) => {
    currentRole = role;
    document.querySelectorAll('.role-btn').forEach(btn => {
        const isActive = btn.id === `role-${role}`;
        if (isActive) {
            btn.classList.add('bg-[#B78628]', 'border-[#B78628]', 'text-white', 'shadow-lg');
            btn.classList.remove('bg-[#1E293B]', 'border-transparent', 'text-gray-500');
        } else {
            btn.classList.remove('bg-[#B78628]', 'border-[#B78628]', 'text-white', 'shadow-lg');
            btn.classList.add('bg-[#1E293B]', 'border-transparent', 'text-gray-500');
        }
    });
};

window.toggleRegMethod = () => {
    currentMethod = (currentMethod === 'email' ? 'phone' : 'email');
    document.querySelectorAll('.reg-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`reg-method-${currentMethod}`).classList.remove('hidden');
    document.getElementById('toggle-reg-method').textContent = (currentMethod === 'email' ? 'Registar via Telemóvel' : 'Registar via Email');
};

async function handleEmailRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const errorDiv = document.getElementById('reg-error');
    const btn = document.getElementById('btn-submit-reg');

    errorDiv.classList.add('hidden');
    btn.disabled = true;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Auth Profile
        await updateProfile(user, { displayName: name });

        // Create Firestore Doc
        await setDoc(doc(db, 'users', user.uid), {
            name,
            email,
            role: currentRole,
            createdAt: new Date().toISOString()
        });

        document.getElementById('reg-form-container').classList.add('hidden');
        document.getElementById('reg-success').classList.remove('hidden');
    } catch (error) {
        console.error("Register Error:", error);
        errorDiv.textContent = "Erro ao criar conta. O email já pode estar em uso.";
        errorDiv.classList.remove('hidden');
        btn.disabled = false;
    }
}

window.sendRegOTP = async () => {
    const name = document.getElementById('reg-phone-name').value;
    const phone = document.getElementById('reg-phone').value;
    const btn = document.getElementById('btn-reg-send-otp');

    if (!name || phone.length < 9) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    btn.disabled = true;
    try {
        const fullNumber = '+244' + phone.replace(/\D/g, '');
        confirmationResult = await signInWithPhoneNumber(auth, fullNumber, window.recaptchaVerifier);

        document.getElementById('disp-reg-phone').textContent = `+244 ${phone}`;
        document.getElementById('p-step-1').classList.add('hidden');
        document.getElementById('p-step-2').classList.remove('hidden');
    } catch (error) {
        console.error("Phone Reg Error:", error);
        alert("Erro ao enviar SMS.");
        btn.disabled = false;
    }
};

window.confirmRegOTP = async () => {
    const code = document.getElementById('reg-otp').value;
    const btn = document.getElementById('btn-reg-confirm-otp');
    const name = document.getElementById('reg-phone-name').value;

    if (code.length < 6) return;

    btn.disabled = true;
    try {
        const result = await confirmationResult.confirm(code);
        const user = result.user;

        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, 'users', user.uid), {
            name,
            phone: user.phoneNumber,
            role: currentRole,
            createdAt: new Date().toISOString()
        });

        window.location.href = '/';
    } catch (error) {
        console.error("OTP Error:", error);
        alert("Código inválido.");
        btn.disabled = false;
    }
};

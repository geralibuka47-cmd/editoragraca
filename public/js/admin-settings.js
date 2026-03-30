/**
 * Editora Graça — Admin Settings Controller (Vanila JS)
 */
import {
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { reinitIcons } from './utils.js';

let currentSettings = {};
let activeTab = 'geral';

document.addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('settings-app');
    if (!app) return;

    await loadSettings();
    initTabButtons();
    renderActiveTab();
    setupSaveAction();
});

async function loadSettings() {
    try {
        const db = window.db;
        const configRef = doc(db, "site_content", "config");
        const snap = await getDoc(configRef);

        if (snap.exists()) {
            currentSettings = snap.data();
        } else {
            // Default settings
            currentSettings = {
                general: { companyName: 'Editora Graça', email: 'geraleditoragraca@gmail.com' },
                institutional: { homeHeroTitle: 'Arquitetos do Renascimento', homeHeroSubtitle: 'Redefinindo o cânone literário angolano.' },
                social: { facebook: '', instagram: '', linkedin: '' }
            };
        }
    } catch (e) {
        console.error("Error loading settings:", e);
    }
}

function initTabButtons() {
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => {
        btn.onclick = () => {
            btns.forEach(b => {
                b.classList.remove('bg-brand-dark', 'text-white', 'shadow-lg');
                b.classList.add('text-gray-400', 'hover:bg-gray-50', 'hover:text-brand-dark');
            });
            btn.classList.remove('text-gray-400', 'hover:bg-gray-50', 'hover:text-brand-dark');
            btn.classList.add('bg-brand-dark', 'text-white', 'shadow-lg');

            activeTab = btn.dataset.tab;
            renderActiveTab();
        };
    });
}

function renderActiveTab() {
    const container = document.getElementById('tab-content');
    if (!container) return;

    let html = '';

    if (activeTab === 'geral') {
        const g = currentSettings.general || {};
        html = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nome da Editora</label>
                    <input type="text" value="${g.companyName || ''}" onchange="updateSetting('general.companyName', this.value)" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark outline-none">
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email de Contacto</label>
                    <input type="email" value="${g.email || ''}" onchange="updateSetting('general.email', this.value)" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark outline-none">
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Telefone Principal</label>
                    <input type="text" value="${g.phone || ''}" onchange="updateSetting('general.phone', this.value)" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark outline-none">
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Morada Sede</label>
                    <input type="text" value="${g.address || ''}" onchange="updateSetting('general.address', this.value)" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark outline-none">
                </div>
            </div>
        `;
    } else if (activeTab === 'institucional') {
        const i = currentSettings.institutional || {};
        html = `
            <div class="space-y-10">
                <div class="p-8 bg-gray-50 rounded-3xl space-y-6">
                    <h4 class="text-xs font-black uppercase tracking-widest text-brand-primary">Página Inicial (Hero)</h4>
                    <div class="space-y-6">
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Headline Principal</label>
                            <input type="text" value="${i.homeHeroTitle || ''}" onchange="updateSetting('institutional.homeHeroTitle', this.value)" class="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold text-brand-dark outline-none">
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Subtítulo do Hero</label>
                            <textarea onchange="updateSetting('institutional.homeHeroSubtitle', this.value)" class="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold text-brand-dark outline-none resize-none h-32">${i.homeHeroSubtitle || ''}</textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (activeTab === 'social') {
        const s = currentSettings.social || {};
        html = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Facebook</label>
                    <input type="text" value="${s.facebook || ''}" onchange="updateSetting('social.facebook', this.value)" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark outline-none">
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Instagram</label>
                    <input type="text" value="${s.instagram || ''}" onchange="updateSetting('social.instagram', this.value)" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark outline-none">
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">LinkedIn</label>
                    <input type="text" value="${s.linkedin || ''}" onchange="updateSetting('social.linkedin', this.value)" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark outline-none">
                </div>
            </div>
        `;
    } else if (activeTab === 'servicos') {
        html = `
            <div class="text-center py-20">
                <p class="text-gray-400 font-black uppercase tracking-widest text-[10px]">Gestão de serviços em sincronização...</p>
            </div>
        `;
    } else {
        html = `
            <div class="p-10 bg-gray-50 rounded-[3rem] space-y-6">
                <h4 class="text-xs font-black uppercase tracking-widest text-brand-primary">Backup & Logs</h4>
                <p class="text-xs text-gray-500 leading-relaxed font-medium">Exportações manuais e monitoria de segurança.</p>
                <button class="px-8 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Gerar Exportação JSON</button>
            </div>
        `;
    }

    container.innerHTML = html;
    reinitIcons(container);
}

// Global scope update function
window.updateSetting = (path, value) => {
    const parts = path.split('.');
    if (!currentSettings[parts[0]]) currentSettings[parts[0]] = {};
    currentSettings[parts[0]][parts[1]] = value;
};

async function setupSaveAction() {
    const btn = document.getElementById('save-settings');
    if (!btn) return;

    btn.onclick = async () => {
        btn.disabled = true;
        btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Guardando...`;
        reinitIcons(btn);

        try {
            const db = window.db;
            await setDoc(doc(db, "site_content", "config"), currentSettings);
            alert("Configurações guardadas com sucesso!");
        } catch (e) {
            console.error(e);
            alert("Erro ao guardar definições.");
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<i data-lucide="save" class="w-4 h-4"></i> Guardar Alterações`;
            reinitIcons(btn);
        }
    };
}

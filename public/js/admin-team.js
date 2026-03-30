/**
 * Editora Graça — Admin: Team Controller
 */
import { db } from './firebase-config.js';
import { collection, query, getDocs, orderBy, addDoc, setDoc, deleteDoc, doc, Timestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let allMembers = [];

document.addEventListener('DOMContentLoaded', async () => {
    loadTeamMembers();

    const form = document.getElementById('team-form');
    form?.addEventListener('submit', handleTeamSubmit);
});

async function loadTeamMembers() {
    const list = document.getElementById('team-list');
    try {
        const q = query(collection(db, 'team'), orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        allMembers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderTeam();
    } catch (error) {
        console.error("Error loading team members:", error);
        if (list) list.innerHTML = '<p class="text-xs text-red-500 font-bold uppercase tracking-widest text-center py-20 col-span-full">Erro ao carregar dados.</p>';
    }
}

function renderTeam() {
    const list = document.getElementById('team-list');
    if (!list) return;

    if (allMembers.length === 0) {
        list.innerHTML = '<div class="col-span-full py-20 text-center"><p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhum membro registado</p></div>';
        return;
    }

    list.innerHTML = '';
    allMembers.forEach((member, i) => {
        const html = `
            <div class="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 animate-fade-in" style="animation-delay: ${i * 0.1}s">
                <div class="flex flex-col items-center text-center space-y-4">
                    <div class="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden border-2 border-white shadow-lg relative group-hover:scale-110 transition-transform">
                        <img src="${member.img}" alt="${member.name}" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <button onclick="deleteMember('${member.id}')" class="p-2 bg-red-500 text-white rounded-lg hover:bg-brand-dark shadow-lg">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-black text-brand-dark uppercase tracking-tight">${member.name}</h3>
                        <p class="text-brand-primary text-[9px] font-black uppercase tracking-widest mt-1">${member.role}</p>
                        <p class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">${member.department || 'Geral'}</p>
                    </div>
                </div>
            </div>
        `;
        list.insertAdjacentHTML('beforeend', html);
    });

    if (window.lucide) window.lucide.createIcons();
}

window.openTeamModal = () => {
    document.getElementById('team-modal').classList.remove('hidden');
    document.getElementById('team-form').reset();
    document.getElementById('member-id').value = '';
};

window.closeTeamModal = () => {
    document.getElementById('team-modal').classList.add('hidden');
};

async function handleTeamSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('member-id').value;
    const name = document.getElementById('member-name').value;
    const role = document.getElementById('member-role').value;
    const department = document.getElementById('member-dept').value;
    const img = document.getElementById('member-image').value;
    const bio = document.getElementById('member-bio').value;

    try {
        const payload = { name, role, department, img, bio, updatedAt: Timestamp.now() };

        if (id) {
            await setDoc(doc(db, 'team', id), payload, { merge: true });
        } else {
            await addDoc(collection(db, 'team'), payload);
        }

        alert("Membro guardado com sucesso!");
        closeTeamModal();
        loadTeamMembers();
    } catch (error) {
        console.error("Error saving team member:", error);
        alert("Erro ao guardar membro da equipa.");
    }
}

window.deleteMember = async (id) => {
    if (!confirm("Remover este membro permanentemente?")) return;
    try {
        await deleteDoc(doc(db, 'team', id));
        loadTeamMembers();
    } catch (error) {
        console.error("Error deleting member:", error);
        alert("Erro ao eliminar membro.");
    }
}

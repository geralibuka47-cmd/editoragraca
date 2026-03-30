/**
 * Editora Graça — Admin Orders Logic (Vanila JS)
 */
import { onAuth } from './auth.js';
import { reinitIcons } from './utils.js';
import { db } from './firebase-config.js';
import { collection, getDocs, orderBy, query, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const loadingOverlay = document.getElementById('admin-loading');
const mainContainer = document.getElementById('admin-main');
const ordersList = document.getElementById('admin-orders-list');

document.addEventListener('DOMContentLoaded', () => {
    onAuth((user) => {
        if (!user || user.role !== 'adm') {
            window.location.href = '/login';
            return;
        }

        loadOrders();

        loadingOverlay.classList.add('hidden');
        mainContainer.classList.remove('hidden');
        reinitIcons(mainContainer);
    });
});

async function loadOrders() {
    try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const orders = [];
        querySnapshot.forEach((doc) => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        renderOrders(orders);
    } catch (err) {
        console.error('Error loading orders:', err);
        renderOrders([]);
    }
}

function renderOrders(orders) {
    if (orders.length === 0) {
        ordersList.innerHTML = '<tr><td colspan="5" class="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">Nenhuma encomenda encontrada.</td></tr>';
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <tr class="hover:bg-gray-50/50 transition-all group">
            <td class="px-8 py-6">
                <div class="flex flex-col">
                    <span class="font-black text-brand-dark uppercase text-[11px]">${order.id}</span>
                    <span class="text-[9px] text-gray-400 font-bold tracking-widest">${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
            </td>
            <td class="px-8 py-6">
                 <span class="text-[10px] font-black uppercase text-gray-400">${order.customerName || 'Cliente Externo'}</span>
            </td>
            <td class="px-8 py-6">
                <span class="text-[10px] font-black uppercase text-brand-primary">${new Intl.NumberFormat('pt-AO').format(order.total || 0)} Kz</span>
            </td>
            <td class="px-8 py-6">
                <span class="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[8px] font-black uppercase tracking-widest">${order.status || 'Pendente'}</span>
            </td>
            <td class="px-8 py-6 text-right space-x-2">
                <button class="view-order-btn p-3 hover:bg-brand-primary/10 text-brand-primary rounded-xl transition-all" data-id="${order.id}">
                    <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
                <button class="approve-order-btn p-3 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all" data-id="${order.id}">
                    <i data-lucide="check" class="w-4 h-4"></i>
                </button>
            </td>
        </tr>
    `).join('');

    reinitIcons(ordersList);
}

// Event Delegation for Actions
ordersList.onclick = async (e) => {
    const approveBtn = e.target.closest('.approve-order-btn');
    if (approveBtn) {
        const id = approveBtn.dataset.id;
        if (confirm(`Marcar encomenda ${id} como Paga?`)) {
            try {
                await updateDoc(doc(db, "orders", id), { status: 'Pago' });
                loadOrders();
            } catch (err) {
                console.error("Error updating order:", err);
            }
        }
    }

    const viewBtn = e.target.closest('.view-order-btn');
    if (viewBtn) {
        // Logic for viewing order details could go here
        alert(`Detalhes da encomenda: ${viewBtn.dataset.id}`);
    }
};

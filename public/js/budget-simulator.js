/**
 * Editora Graça — Budget Simulator Logic (Vanila JS)
 */
import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

class BudgetSimulator {
    constructor() {
        this.step = 1;
        this.formData = {
            serviceType: 'revisao',
            pages: 0,
            wordCount: 0,
            genre: '',
            extras: [],
            name: '',
            email: '',
            phone: ''
        };
        this.prices = {
            min: 0,
            max: 0
        };

        this.init();
    }

    async init() {
        await this.loadRates();
        this.cacheElements();
        this.bindEvents();
        this.updateUI();
    }

    async loadRates() {
        try {
            const configRef = doc(db, "site_content", "config");
            const snap = await getDoc(configRef);
            if (snap.exists()) {
                const data = snap.data();
                this.rates = data.pricing || {
                    pageLow: 250,
                    pageHigh: 200,
                    baseCover: 10000,
                    isbn: 6000,
                    deposito: 6000
                };
            }
        } catch (e) {
            console.error("Error loading rates:", e);
            this.rates = { pageLow: 250, pageHigh: 200, baseCover: 10000, isbn: 6000, deposito: 6000 };
        }
    }

    cacheElements() {
        this.container = document.getElementById('budget-simulator');
        if (!this.container) return;

        this.steps = this.container.querySelectorAll('.step-content');
        this.indicators = this.container.querySelectorAll('.step-indicator');
        this.nextBtn = this.container.querySelector('#next-step');
        this.backBtn = this.container.querySelector('#back-step');
        this.submitBtn = this.container.querySelector('#submit-budget');
        this.priceDisplay = this.container.querySelector('#price-estimate');
    }

    bindEvents() {
        if (!this.container) return;

        // Service Selection
        this.container.querySelectorAll('.service-opt').forEach(btn => {
            btn.onclick = () => {
                this.formData.serviceType = btn.dataset.service;
                this.updateUI();
            };
        });

        // Inputs
        this.container.querySelectorAll('input, select').forEach(input => {
            input.onchange = (e) => {
                const { name, value, type, checked } = e.target;
                if (type === 'checkbox') {
                    if (checked) this.formData.extras.push(value);
                    else this.formData.extras = this.formData.extras.filter(ex => ex !== value);
                } else {
                    this.formData[name] = type === 'number' ? parseInt(value) : value;
                }
                this.calculate();
            };
        });

        this.nextBtn.onclick = () => this.nextStep();
        this.backBtn.onclick = () => this.prevStep();
        this.submitBtn.onclick = (e) => this.handleSubmit(e);
    }

    calculate() {
        let min = 0;
        let max = 0;

        const pages = this.formData.pages || (this.formData.wordCount ? Math.ceil(this.formData.wordCount / 250) : 0);
        const rate = pages > 250 ? this.rates.pageHigh : this.rates.pageLow;

        if (this.formData.serviceType === 'revisao' || this.formData.serviceType === 'diagramacao') {
            const base = pages * rate;
            min += base;
            max += base * 1.1;
        } else if (this.formData.serviceType === 'completo') {
            const editorial = (pages * rate) * 2;
            const fixed = this.rates.baseCover + this.rates.isbn + this.rates.deposito;
            min += editorial + fixed;
            max += (editorial + fixed) * 1.15;
        }

        // Extras
        if (this.formData.extras.includes('capa')) { min += this.rates.baseCover; max += this.rates.baseCover * 1.5; }
        if (this.formData.extras.includes('isbn')) { min += this.rates.isbn; max += this.rates.isbn; }
        if (this.formData.extras.includes('deposito')) { min += this.rates.deposito; max += this.rates.deposito; }

        this.prices = { min, max };
        this.updatePriceDisplay();
    }

    updatePriceDisplay() {
        if (!this.priceDisplay) return;
        const fmt = new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' });
        this.priceDisplay.textContent = `${fmt.format(this.prices.min)} - ${fmt.format(this.prices.max)}`;
    }

    nextStep() {
        if (this.step < 4) {
            this.step++;
            this.updateUI();
        }
    }

    prevStep() {
        if (this.step > 1) {
            this.step--;
            this.updateUI();
        }
    }

    updateUI() {
        this.steps.forEach((s, i) => {
            s.classList.toggle('hidden', i + 1 !== this.step);
        });

        this.indicators.forEach((ind, i) => {
            const circle = ind.querySelector('.step-circle');
            if (i + 1 <= this.step) {
                circle.classList.add('bg-brand-primary', 'text-white');
                circle.classList.remove('bg-white', 'text-gray-300');
            } else {
                circle.classList.remove('bg-brand-primary', 'text-white');
                circle.classList.add('bg-white', 'text-gray-300');
            }
        });

        this.backBtn.classList.toggle('hidden', this.step === 1);
        this.nextBtn.classList.toggle('hidden', this.step === 4);
        this.submitBtn.classList.toggle('hidden', this.step !== 4);

        // Update selected service style
        this.container.querySelectorAll('.service-opt').forEach(btn => {
            const isActive = btn.dataset.service === this.formData.serviceType;
            btn.classList.toggle('border-brand-primary', isActive);
            btn.classList.toggle('bg-brand-primary/5', isActive);
            btn.classList.toggle('ring-1', isActive);
            btn.classList.toggle('ring-brand-primary', isActive);
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> A ENVIAR...';
        lucide.createIcons();

        try {
            await addDoc(collection(db, "manuscripts"), {
                title: `Orçamento: ${this.formData.serviceType.toUpperCase()}`,
                authorName: this.formData.name,
                email: this.formData.email,
                phone: this.formData.phone,
                genre: this.formData.genre,
                description: `Serviço: ${this.formData.serviceType}, Páginas: ${this.formData.pages}, Palavras: ${this.formData.wordCount}, Extras: ${this.formData.extras.join(', ')}. Est: ${this.prices.min}-${this.prices.max}`,
                submittedDate: new Date().toISOString(),
                status: 'pending'
            });

            alert("Pedido de orçamento enviado com sucesso!");
            window.location.reload();
        } catch (err) {
            console.error("Error submitting budget:", err);
            alert("Erro ao enviar pedido. Tente novamente.");
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = 'RECEBER PROPOSTA FORMAL';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BudgetSimulator();
});

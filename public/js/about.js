/**
 * Editora Graça — About Page Logic
 */
import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { reinitIcons } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    loadAboutContent();
});

async function loadAboutContent() {
    try {
        const aboutRef = doc(db, "site_content", "about");
        const snap = await getDoc(aboutRef);

        if (snap.exists()) {
            const data = snap.data();

            // 1. Text Content
            updateText('about-intro-text', data.intro);
            updateText('about-essence-text', data.essence);
            updateText('about-stats-books', data.stats?.books);
            updateText('about-stats-talent', data.stats?.talent);

            // 2. Values Grid
            if (data.values && data.values.length > 0) {
                const grid = document.getElementById('about-values-grid');
                if (grid) {
                    grid.innerHTML = data.values.map(v => `
                        <div class="p-10 sm:p-12 bg-white/5 rounded-[3rem] sm:rounded-[4rem] border border-white/10 hover:bg-brand-primary/10 transition-all group">
                            <i data-lucide="${v.icon || 'star'}" class="w-10 h-10 sm:w-12 sm:h-12 text-brand-primary mb-8 sm:mb-10 group-hover:scale-110 transition-transform"></i>
                            <h3 class="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4">${v.title}</h3>
                            <p class="text-gray-400 font-medium leading-relaxed">${v.description}</p>
                        </div>
                    `).join('');
                    reinitIcons(grid);
                }
            }

            // 3. Timeline
            if (data.timeline && data.timeline.length > 0) {
                const timeline = document.getElementById('about-timeline-container');
                if (timeline) {
                    timeline.innerHTML = '<div class="absolute left-6 sm:left-10 md:left-1/2 top-0 bottom-0 w-px bg-gray-100"></div>' +
                        data.timeline.map((item, i) => {
                            const isOdd = i % 2 === 0;
                            const flexDir = isOdd ? 'md:flex-row' : 'md:flex-row-reverse';
                            const textAlign = isOdd ? 'md:text-right' : 'md:text-left';
                            const marginClass = isOdd ? 'md:mr-0' : 'md:ml-0';

                            return `
                                <div class="relative flex flex-col ${flexDir} gap-8 sm:gap-12 items-start md:items-center">
                                    <div class="flex-1 ${textAlign} pl-16 md:pl-0">
                                        <p class="text-5xl sm:text-7xl font-black text-gray-100 italic font-serif leading-none">${item.year}</p>
                                        <h4 class="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tight mt-2 mb-4">${item.title}</h4>
                                        <p class="text-gray-500 font-medium leading-relaxed max-w-sm mx-auto ${marginClass}">${item.description}</p>
                                    </div>
                                    <div class="absolute left-4 sm:left-[34px] md:static w-4 h-4 sm:w-6 sm:h-6 bg-brand-dark border-4 border-brand-primary rounded-full z-10 shadow-xl"></div>
                                    <div class="flex-1 hidden md:block"></div>
                                </div>
                            `;
                        }).join('');
                }
            }

            // 4. Founder
            if (data.founder) {
                const founder = document.getElementById('about-founder-container');
                if (founder) {
                    founder.innerHTML = `
                        <div class="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-brand-primary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div class="grid lg:grid-cols-2 gap-12 sm:gap-24 items-center">
                            <div class="order-2 lg:order-1 space-y-8 sm:space-y-12">
                                <div class="space-y-4">
                                    <span class="text-brand-primary font-black text-[10px] sm:text-xs uppercase tracking-[0.5em]">${data.founder.tag || 'O Visionário'}</span>
                                    <h2 class="text-4xl sm:text-7xl md:text-8xl font-black text-brand-dark uppercase tracking-tighter leading-none">
                                        ${data.founder.name.split(' ').join(' <br>')}
                                    </h2>
                                </div>
                                <p class="text-xl sm:text-2xl font-serif italic text-gray-500 leading-relaxed">
                                    "${data.founder.quote}"
                                </p>
                                <div class="space-y-2">
                                    <p class="text-brand-dark font-black uppercase text-[10px] sm:text-xs tracking-widest">${data.founder.role}</p>
                                    <div class="w-16 sm:w-20 h-1 bg-brand-primary"></div>
                                </div>
                            </div>
                            <div class="order-1 lg:order-2">
                                <div class="aspect-[4/5] bg-gray-100 rounded-[3rem] sm:rounded-[4rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-xl max-w-sm mx-auto">
                                    <img src="${data.founder.image}" alt="${data.founder.name}" class="w-full h-full object-cover">
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
        }
    } catch (e) {
        console.error("Error loading about content:", e);
    }
}

function updateText(id, value) {
    if (!value) return;
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

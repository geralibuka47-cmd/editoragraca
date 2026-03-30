/**
 * Editora Graça — Projects & Initiatives Logic (100% Dynamic)
 */
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let DEFAULT_RSS_URL = 'https://anchor.fm/s/10838fbcc/podcast/rss';
window.podcastsLoaded = false;

async function getRssUrl() {
    try {
        const db = window.db;
        const configRef = doc(db, "site_content", "config");
        const snap = await getDoc(configRef);
        if (snap.exists()) {
            return snap.data().podcastRss || DEFAULT_RSS_URL;
        }
    } catch (e) {
        console.error("Error fetching RSS URL:", e);
    }
    return DEFAULT_RSS_URL;
}

window.switchProjectTab = function (tabId) {
    // 1. Update Buttons
    document.querySelectorAll('.project-tab-btn').forEach(btn => {
        const isActive = btn.dataset.tab === tabId;
        if (isActive) {
            btn.classList.add('bg-brand-dark', 'text-white', 'shadow-2xl', 'shadow-brand-dark/20', 'scale-105', 'active');
            btn.classList.remove('bg-gray-50', 'text-gray-400');
            const icon = btn.querySelector('i');
            if (icon) icon.classList.add('text-brand-primary');
        } else {
            btn.classList.remove('bg-brand-dark', 'text-white', 'shadow-2xl', 'shadow-brand-dark/20', 'scale-105', 'active');
            btn.classList.add('bg-gray-50', 'text-gray-400');
            const icon = btn.querySelector('i');
            if (icon) icon.classList.remove('text-brand-primary');
        }
    });

    // 2. Update Content
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === `tab-content-${tabId}`) {
            content.classList.remove('hidden');
            content.classList.add('block');
        } else {
            content.classList.add('hidden');
            content.classList.remove('block');
        }
    });

    // 3. Load Podcasts if Play tab activated
    if (tabId === 'play' && !window.podcastsLoaded) {
        loadPodcasts();
    }
};

async function loadPodcasts() {
    const list = document.getElementById('podcast-episodes-grid');
    if (!list) return;

    try {
        const url = await getRssUrl();
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.status === 'ok') {
            renderEpisodes(data.items.slice(0, 6));
            window.podcastsLoaded = true;
        } else {
            throw new Error('RSS Error');
        }
    } catch (err) {
        console.error("Podcast fetch error:", err);
        list.innerHTML = '<p class="text-xs text-gray-400 italic text-center py-10">O arquivo de áudio está temporariamente indisponível.</p>';
    }
}

function renderEpisodes(items) {
    const list = document.getElementById('podcast-episodes-grid');
    if (!list) return;

    list.innerHTML = '';
    items.forEach((item, i) => {
        const html = `
            <a href="${item.link}" target="_blank" rel="noopener" 
               class="group block p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-brand-primary/10 hover:border-brand-primary/30 transition-all animate-fade-in"
               style="animation-delay: ${i * 0.1}s">
                <div class="flex justify-between items-start gap-6">
                    <div class="space-y-3">
                        <p class="text-[10px] font-black uppercase tracking-widest text-brand-primary">${item.itunes_duration || 'Podcast'} • Podcast</p>
                        <h4 class="text-xl font-black uppercase tracking-tight group-hover:text-brand-primary transition-colors">${item.title}</h4>
                        <p class="text-sm text-gray-500 line-clamp-2 italic">${item.description.replace(/<[^>]*>?/gm, '')}</p>
                    </div>
                    <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-primary transition-colors">
                        <i data-lucide="arrow-up-right" class="w-6 h-6"></i>
                    </div>
                </div>
            </a>
        `;
        list.insertAdjacentHTML('beforeend', html);
    });

    if (window.lucide) {
        window.lucide.createIcons({
            attrs: { "stroke-width": 2.5 },
            nameAttr: "data-lucide",
            container: list
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();
});

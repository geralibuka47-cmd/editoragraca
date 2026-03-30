/**
 * Editora Graça — Projects & Initiatives Logic
 */

class ProjectsPortal {
    constructor() {
        this.activeTab = 'academia';
        this.RSS_URL = 'https://anchor.fm/s/10838fbcc/podcast/rss';
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadPodcastIfActive();
    }

    cacheElements() {
        this.container = document.getElementById('projects-portal');
        if (!this.container) return;

        this.tabs = this.container.querySelectorAll('[data-target]');
        this.sections = this.container.querySelectorAll('.project-section');
        this.podcastList = document.getElementById('podcast-episodes');
    }

    bindEvents() {
        if (!this.container) return;

        this.tabs.forEach(tab => {
            tab.onclick = () => {
                this.switchTab(tab.dataset.target);
            };
        });
    }

    switchTab(tabId) {
        this.activeTab = tabId;

        this.sections.forEach(sec => {
            sec.classList.toggle('hidden', sec.id !== tabId);
        });

        this.tabs.forEach(tab => {
            const isActive = tab.dataset.target === tabId;
            if (isActive) {
                tab.classList.add('bg-brand-dark', 'text-white', 'shadow-2xl');
                tab.classList.remove('bg-gray-50', 'text-gray-400');
            } else {
                tab.classList.remove('bg-brand-dark', 'text-white', 'shadow-2xl');
                tab.classList.add('bg-gray-50', 'text-gray-400');
            }
        });

        this.loadPodcastIfActive();
    }

    async loadPodcastIfActive() {
        if (this.activeTab === 'play' && this.podcastList && this.podcastList.children.length === 0) {
            this.podcastList.innerHTML = '<div class="flex justify-center py-10"><i data-lucide="loader-2" class="w-8 h-8 animate-spin text-brand-primary"></i></div>';
            lucide.createIcons();

            try {
                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(this.RSS_URL)}`);
                const data = await response.json();

                if (data.status === 'ok') {
                    this.renderEpisodes(data.items.slice(0, 5));
                } else {
                    throw new Error('RSS Error');
                }
            } catch (err) {
                console.error("Podcast fetch error:", err);
                this.podcastList.innerHTML = '<p class="text-xs text-gray-500 italic">O arquivo de áudio está temporariamente indisponível.</p>';
            }
        }
    }

    renderEpisodes(items) {
        this.podcastList.innerHTML = '';
        items.forEach(item => {
            const div = document.createElement('a');
            div.href = item.link;
            div.target = '_blank';
            div.className = 'group block p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-brand-primary/10 hover:border-brand-primary/30 transition-all';

            div.innerHTML = `
                <div class="flex justify-between items-start gap-4">
                    <div class="space-y-2">
                        <p class="text-[9px] font-black uppercase tracking-widest text-brand-primary">${item.itunes_duration || 'Podcast'}</p>
                        <h4 class="text-sm font-black uppercase tracking-tight text-white group-hover:text-brand-primary transition-colors">${item.title}</h4>
                    </div>
                    <i data-lucide="arrow-up-right" class="w-4 h-4 text-white/40 group-hover:text-brand-primary transition-colors"></i>
                </div>
            `;
            this.podcastList.appendChild(div);
        });
        lucide.createIcons();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProjectsPortal();
});

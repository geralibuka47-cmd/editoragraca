/**
 * Editora Graça — About Page Logic (Vanila JS)
 */
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const db = window.db;
        const configRef = doc(db, "site_content", "config");
        const snap = await getDoc(configRef);

        if (snap.exists()) {
            const data = snap.data();
            const inst = data.institutional;

            if (inst && inst.aboutHeroSubtitle) {
                const subtitle = document.querySelector('p.text-gray-400.font-medium.max-w-2xl');
                if (subtitle) {
                    subtitle.textContent = inst.aboutHeroSubtitle;
                }
            }
        }
    } catch (e) {
        console.error("Error loading institutional content for About page:", e);
    }

    // Ensure Lucide icons are initialized
    if (window.lucide) window.lucide.createIcons();
});

import { getTeamMemberById } from './team.js';
import { getBooks } from './books.js';
import { renderBookCard, reinitIcons } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Priority to server-injected ID, then fallback to URL path
    const memberId = window.MEMBER_ID || window.location.pathname.split('/').pop();

    if (!memberId || memberId === 'equipa-detalhe.php') {
        // window.location.href = '/contacto'; // Fallback to team list
        return;
    }

    const container = document.getElementById('member-detail-container');
    const booksGrid = document.getElementById('author-books-grid');
    const loading = document.getElementById('loading-state');

    try {
        // 1. Fetch data with full catalog visibility for authors
        const [member, allBooks] = await Promise.all([
            getTeamMemberById(memberId),
            getBooks({ includeFuture: true })
        ]);

        if (!member) {
            console.error("Member not found");
            return;
        }

        // 2. Update UI metadata
        document.title = `${member.name} | Editora Graça`;

        // 3. Populate Member Info
        document.getElementById('member-name').textContent = member.name;
        document.getElementById('member-role').textContent = member.role;
        document.getElementById('member-department').textContent = member.department || 'Direção Editorial';
        document.getElementById('member-bio').textContent = member.bio || 'Membro dedicado à excelência literária da Editora Graça.';

        const photo = document.getElementById('member-photo');
        if (member.photoUrl) {
            photo.src = member.photoUrl;
            photo.classList.remove('hidden');
        }

        // 4. Social Links
        const socialsContainer = document.getElementById('member-socials');
        socialsContainer.innerHTML = '';
        if (member.socials) {
            if (member.socials.instagram) {
                socialsContainer.innerHTML += `
                    <a href="${member.socials.instagram}" target="_blank" class="p-4 bg-gray-50 rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-sm">
                        <i data-lucide="instagram" class="w-6 h-6"></i>
                    </a>
                `;
            }
            if (member.socials.linkedin) {
                socialsContainer.innerHTML += `
                    <a href="${member.socials.linkedin}" target="_blank" class="p-4 bg-gray-50 rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-sm">
                        <i data-lucide="linkedin" class="w-6 h-6"></i>
                    </a>
                `;
            }
        }

        // 5. Filter Author Books (Support for legacy "author" name strings and new "authorIds" arrays)
        const authorBooks = allBooks.filter(book => {
            const hasId = book.authorId === memberId || (book.authorIds && book.authorIds.includes(memberId));
            const hasName = book.author && book.author.toLowerCase().includes(member.name.toLowerCase());
            const hasMultiName = book.authors && book.authors.some(a => a.id === memberId || a.name?.toLowerCase().includes(member.name.toLowerCase()));
            return hasId || hasName || hasMultiName;
        });

        if (authorBooks.length > 0) {
            document.getElementById('author-books-section').classList.remove('hidden');
            booksGrid.innerHTML = authorBooks.map(book => renderBookCard(book)).join('');
            reinitIcons(booksGrid);
        }

        // 6. Reveal content
        if (loading) loading.classList.add('hidden');
        if (container) {
            container.classList.remove('hidden');
            container.classList.add('animate-fade-in');
        }

        // Final Lucide Sweep
        if (window.lucide) window.lucide.createIcons();

    } catch (error) {
        console.error("Error loading member detail:", error);
    }
});

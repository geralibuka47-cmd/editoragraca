import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BOOKS_SEED = [
    {
        title: "O Vendedor de Passados",
        author: "José Eduardo Agualusa",
        price: 4500,
        stock: 20,
        category: "Ficção Literária",
        isbn: "978-972-21-1721-0",
        cover_url: "https://m.media-amazon.com/images/I/51w6c0s8iSL.jpg",
        is_bestseller: true,
        description: "Uma sátira brilhante sobre a construção da memória e identidade na Angola pós-guerra.",
        author_id: "author_agualusa",
        format: "físico",
        pages: 250
    },
    {
        title: "Terra Sonâmbula",
        author: "Mia Couto",
        price: 5200,
        stock: 15,
        category: "Ficção Literária",
        isbn: "978-972-21-0210-0",
        cover_url: "https://m.media-amazon.com/images/I/51GgW64kHcL.jpg",
        is_bestseller: true,
        description: "Um clássico moderno que entrelaça a dura realidade da guerra com o realismo mágico.",
        author_id: "author_miacouto",
        format: "físico",
        pages: 300
    },
    {
        title: "Mayombe",
        author: "Pepetela",
        price: 4000,
        stock: 30,
        category: "História e Biografia",
        isbn: "978-972-21-0100-0",
        cover_url: "https://m.media-amazon.com/images/I/51XqWd+K3JL._SY445_SX342_.jpg",
        description: "Uma narrativa crua sobre a guerrilha e as complexidades tribais e ideológicas.",
        author_id: "author_pepetela",
        format: "físico",
        pages: 280
    }
];

const BLOG_SEED = [
    {
        title: "A Revolução do Livro em Malanje",
        content: "Malanje tem se tornado um polo vibrante de novos escritores e leitores apaixonados. A Editora Graça orgulha-se de fazer parte desta jornada transformadora.",
        image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80",
        author: "António Graça",
        date: new Date().toISOString()
    }
];

const TEAM_SEED = [
    {
        name: "António Graça",
        role: "Director Geral & Editor-Chefe",
        department: "Liderança",
        bio: "Visionário literário com mais de 20 anos de experiência no mercado angolano.",
        photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=500",
        display_order: 1
    }
];

const SERVICES_SEED = [
    {
        title: 'Revisão e Edição de Texto',
        price: 'Desde 15.000 Kz',
        details: ['Correção ortográfica', 'Adequação estilística', 'Parecer editorial'],
        display_order: 1
    }
];

async function seed() {
    console.log('🌱 Starting Supabase Seeding...');

    try {
        // Books
        console.log('📦 Seeding Books...');
        const { data: existingBooks } = await supabase.from('books').select('title');
        const booksToInsert = BOOKS_SEED.filter(b => !existingBooks?.some(eb => eb.title === b.title));
        if (booksToInsert.length > 0) {
            const { error: bookError } = await supabase.from('books').insert(booksToInsert);
            if (bookError) console.error('Error seeding books:', bookError);
            else console.log(`✅ Added ${booksToInsert.length} books.`);
        } else {
            console.log('ℹ️ No new books to add.');
        }

        // Blog
        console.log('📝 Seeding Blog Posts...');
        const { data: existingBlog } = await supabase.from('blog_posts').select('title');
        const blogToInsert = BLOG_SEED.filter(b => !existingBlog?.some(eb => eb.title === b.title));
        if (blogToInsert.length > 0) {
            const { error: blogError } = await supabase.from('blog_posts').insert(blogToInsert);
            if (blogError) console.error('Error seeding blog:', blogError);
            else console.log(`✅ Added ${blogToInsert.length} blog posts.`);
        } else {
            console.log('ℹ️ No new blog posts to add.');
        }

        // Team
        console.log('👥 Seeding Team Members...');
        const { data: existingTeam } = await supabase.from('team_members').select('name');
        const teamToInsert = TEAM_SEED.filter(b => !existingTeam?.some(eb => eb.name === b.name));
        if (teamToInsert.length > 0) {
            const { error: teamError } = await supabase.from('team_members').insert(teamToInsert);
            if (teamError) console.error('Error seeding team:', teamError);
            else console.log(`✅ Added ${teamToInsert.length} team members.`);
        } else {
            console.log('ℹ️ No new team members to add.');
        }

        // Services
        console.log('🛠️ Seeding Services...');
        const { data: existingServices } = await supabase.from('editorial_services').select('title');
        const servicesToInsert = SERVICES_SEED.filter(b => !existingServices?.some(eb => eb.title === b.title));
        if (servicesToInsert.length > 0) {
            const { error: serviceError } = await supabase.from('editorial_services').insert(servicesToInsert);
            if (serviceError) console.error('Error seeding services:', serviceError);
            else console.log(`✅ Added ${servicesToInsert.length} services.`);
        } else {
            console.log('ℹ️ No new services to add.');
        }

        console.log('✨ Seeding Completed!');
    } catch (e) {
        console.error('Critical seeding error:', e);
    }
}

seed();


import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const {
    VITE_APPWRITE_ENDPOINT,
    VITE_APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY,
    VITE_APPWRITE_DATABASE_ID = 'main'
} = process.env;

if (!VITE_APPWRITE_ENDPOINT || !VITE_APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    console.error('❌ Missing environment variables. Please check .env file.');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(VITE_APPWRITE_ENDPOINT)
    .setProject(VITE_APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

// Initial Data to Seed
const BOOKS_SEED = [
    {
        title: "O Vendedor de Passados",
        author: "José Eduardo Agualusa",
        price: 4500,
        stock: 20,
        category: "Ficção Literária",
        isbn: "978-972-21-1721-0",
        coverUrl: "https://m.media-amazon.com/images/I/51w6c0s8iSL.jpg",
        isBestseller: true,
        description: "Uma sátira brilhante sobre a construção da memória e identidade na Angola pós-guerra.",
        authorId: "author_agualusa",
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
        coverUrl: "https://m.media-amazon.com/images/I/51GgW64kHcL.jpg",
        isBestseller: true,
        description: "Um clássico moderno que entrelaça a dura realidade da guerra com o realismo mágico.",
        authorId: "author_miacouto",
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
        coverUrl: "https://m.media-amazon.com/images/I/51XqWd+K3JL._SY445_SX342_.jpg",
        description: "Uma narrativa crua sobre a guerrilha e as complexidades tribais e ideológicas.",
        authorId: "author_pepetela",
        format: "físico",
        pages: 280
    }
];

const BLOG_SEED = [
    {
        title: "A Revolução do Livro em Malanje",
        content: "Malanje tem se tornado um polo vibrante de novos escritores...",
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80",
        date: new Date().toISOString(),
        author: "António Graça"
    }
];

const TEAM_SEED = [
    {
        name: "António Graça",
        role: "Director Geral & Editor-Chefe",
        department: "Liderança",
        bio: "Visionário literário com mais de 20 anos de experiência...",
        photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=500",
        order: 1
    }
];

const SERVICES_SEED = [
    {
        title: 'Revisão e Edição de Texto',
        price: 'Desde 15.000 Kz',
        details: [
            'Correção ortográfica e gramatical',
            'Adequação ao acordo ortográfico',
            'Sugestões de melhoria estilística'
        ],
        order: 1
    },
    {
        title: 'Design de Capa',
        price: 'Desde 25.000 Kz',
        details: [
            'Design exclusivo e original',
            'Até 3 propostas de capa',
            'Revisões ilimitadas'
        ],
        order: 2
    }
];


const COLLECTIONS = [
    {
        id: 'books',
        name: 'Books',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'author', type: 'string', size: 255, required: true },
            { key: 'price', type: 'double', required: true },
            { key: 'stock', type: 'integer', required: false, default: 0 },
            { key: 'category', type: 'string', size: 100, required: false },
            { key: 'isbn', type: 'string', size: 50, required: false },
            { key: 'coverUrl', type: 'string', size: 2000, required: false },
            { key: 'description', type: 'string', size: 5000, required: false },
            { key: 'isBestseller', type: 'boolean', required: false, default: false },
            { key: 'isNew', type: 'boolean', required: false, default: false },
            { key: 'authorId', type: 'string', size: 50, required: false },
            { key: 'format', type: 'string', size: 50, required: false }, // 'físico', 'digital'
            { key: 'pages', type: 'integer', required: false },
            { key: 'digitalFileUrl', type: 'string', size: 2000, required: false }
        ],
        seed: BOOKS_SEED
    },
    {
        id: 'users',
        name: 'Users',
        attributes: [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'email', type: 'string', size: 255, required: true },
            { key: 'role', type: 'string', size: 50, required: true, default: 'reader' }, // 'admin', 'author', 'reader'
            { key: 'whatsappNumber', type: 'string', size: 50, required: false },
            { key: 'address', type: 'string', size: 500, required: false },
            { key: 'bio', type: 'string', size: 5000, required: false },
            { key: 'photoUrl', type: 'string', size: 2000, required: false }
        ],
        seed: [] // Users are created via Auth usually
    },
    {
        id: 'orders',
        name: 'Orders',
        attributes: [
            { key: 'customerId', type: 'string', size: 50, required: true },
            { key: 'customerName', type: 'string', size: 255, required: true },
            { key: 'customerEmail', type: 'string', size: 255, required: true },
            { key: 'items', type: 'string', size: 10000, required: true }, // JSON string of cart items
            { key: 'total', type: 'double', required: true },
            { key: 'status', type: 'string', size: 50, required: true, default: 'Pendente' },
            { key: 'date', type: 'datetime', required: true },
            { key: 'paymentMethod', type: 'string', size: 50, required: false }
        ],
        seed: []
    },
    {
        id: 'blog_posts',
        name: 'Blog Posts',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'content', type: 'string', size: 10000, required: true },
            { key: 'imageUrl', type: 'string', size: 2000, required: false },
            { key: 'author', type: 'string', size: 255, required: false },
            { key: 'date', type: 'datetime', required: true }
        ],
        seed: BLOG_SEED
    },
    {
        id: 'team_members',
        name: 'Team Members',
        attributes: [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'role', type: 'string', size: 255, required: true },
            { key: 'department', type: 'string', size: 255, required: false },
            { key: 'bio', type: 'string', size: 5000, required: false },
            { key: 'photoUrl', type: 'string', size: 2000, required: false },
            { key: 'order', type: 'integer', required: true, default: 0 }
        ],
        seed: TEAM_SEED
    },
    {
        id: 'editorial_services',
        name: 'Editorial Services',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'price', type: 'string', size: 255, required: true }, // Using string to allow "Desde..."
            { key: 'details', type: 'string', size: 5000, required: true, array: true }, // Array of strings
            { key: 'order', type: 'integer', required: true, default: 0 }
        ],
        seed: SERVICES_SEED
    },
    {
        id: 'payment_notifications',
        name: 'Payment Notifications',
        attributes: [
            { key: 'orderId', type: 'string', size: 50, required: false },
            { key: 'readerId', type: 'string', size: 50, required: true },
            { key: 'readerName', type: 'string', size: 255, required: true },
            { key: 'readerEmail', type: 'string', size: 255, required: true },
            { key: 'totalAmount', type: 'double', required: true },
            { key: 'items', type: 'string', size: 10000, required: false }, // JSON
            { key: 'status', type: 'string', size: 50, required: true, default: 'pending' }, // pending, proof_uploaded, confirmed, rejected
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: false }
        ],
        seed: []
    },
    {
        id: 'payment_proofs',
        name: 'Payment Proofs',
        attributes: [
            { key: 'paymentNotificationId', type: 'string', size: 50, required: true },
            { key: 'readerId', type: 'string', size: 50, required: true },
            { key: 'fileUrl', type: 'string', size: 2000, required: true },
            { key: 'uploadedAt', type: 'datetime', required: true },
            { key: 'confirmedBy', type: 'string', size: 50, required: false },
            { key: 'confirmedAt', type: 'datetime', required: false },
            { key: 'notes', type: 'string', size: 1000, required: false }
        ],
        seed: []
    },
    {
        id: 'manuscripts',
        name: 'Manuscripts',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'authorId', type: 'string', size: 50, required: true },
            { key: 'authorName', type: 'string', size: 255, required: true },
            { key: 'genre', type: 'string', size: 100, required: false },
            { key: 'description', type: 'string', size: 5000, required: false },
            { key: 'fileUrl', type: 'string', size: 2000, required: true },
            { key: 'status', type: 'string', size: 50, required: true, default: 'pending' }, // pending, approved, rejected
            { key: 'submittedDate', type: 'datetime', required: true },
            { key: 'reviewedDate', type: 'datetime', required: false },
            { key: 'feedback', type: 'string', size: 5000, required: false }
        ],
        seed: []
    },
    {
        id: 'reviews',
        name: 'Reviews',
        attributes: [
            { key: 'bookId', type: 'string', size: 50, required: true },
            { key: 'userId', type: 'string', size: 50, required: true },
            { key: 'userName', type: 'string', size: 255, required: true },
            { key: 'rating', type: 'integer', required: true },
            { key: 'comment', type: 'string', size: 2000, required: false },
            { key: 'date', type: 'datetime', required: true }
        ],
        seed: []
    }
];

async function setupDatabase() {
    try {
        console.log('🚀 Starting Database Setup...');

        // 1. Check/Create Database
        try {
            await databases.get(VITE_APPWRITE_DATABASE_ID);
            console.log(`✅ Database '${VITE_APPWRITE_DATABASE_ID}' exists.`);
        } catch (e) {
            console.log(`Creating database '${VITE_APPWRITE_DATABASE_ID}'...`);
            await databases.create(VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_DATABASE_ID, true);
            console.log(`✅ Database created.`);
        }

        // 2. Collections & Attributes
        for (const col of COLLECTIONS) {
            console.log(`\n📦 Processing collection: ${col.name} (${col.id})...`);

            // Create Collection if not exists
            try {
                await databases.getCollection(VITE_APPWRITE_DATABASE_ID, col.id);
                console.log(`   Collection exists.`);
            } catch (e) {
                console.log(`   Creating collection...`);
                await databases.createCollection(VITE_APPWRITE_DATABASE_ID, col.id, col.name);
                console.log(`   ✅ Created collection.`);
            }

            // Update Permissions (Critical: Allow public read)
            try {
                const publicCollections = ['books', 'blog_posts', 'team_members', 'editorial_services', 'reviews'];
                const permissions = publicCollections.includes(col.id)
                    ? ["read(\"any\")"] // Public can read
                    : []; // Private by default (orders, payments, users, manuscripts)

                if (col.id === 'reviews') {
                    permissions.push("create(\"users\")"); // Authenticated users can write reviews
                }

                // For manuscripts, orders, etc, we might want "create("users")" too, but let's focus on public data first.
                if (['orders', 'payment_notifications', 'payment_proofs', 'manuscripts'].includes(col.id)) {
                    permissions.push("create(\"any\")"); // Or create("users") if we enforce login. Let's assume create("any") for now to ensure flow works, or maybe restrictive.
                    // Actually, let's keep restricted to 'users' or 'any' based on auth state? 
                    // To be safe for the "Not Loading" issue, let's just fix the Public Read ones.
                }

                if (permissions.length > 0) {
                    await databases.updateCollection(VITE_APPWRITE_DATABASE_ID, col.id, col.name, permissions, true); // enabled=true
                    console.log(`      + Updated permissions: ${JSON.stringify(permissions)}`);
                }
            } catch (e) {
                console.error(`      ❌ Error updating permissions:`, e.message);
            }

            // Create Attributes
            console.log(`   Checking attributes...`);
            for (const attr of col.attributes) {
                try {
                    // This throws if attribute doesn't exist, triggering creation
                    // Using listAttributes would be safer but 'get' on specific isn't available easily without knowing types, 
                    // so we just try to create and catch 'already exists' error which is robust enough for setup scripts.

                    if (attr.type === 'string') {
                        await databases.createStringAttribute(VITE_APPWRITE_DATABASE_ID, col.id, attr.key, attr.size, binding(attr.required), attr.default, attr.array);
                    } else if (attr.type === 'integer') {
                        await databases.createIntegerAttribute(VITE_APPWRITE_DATABASE_ID, col.id, attr.key, binding(attr.required), null, null, attr.default);
                    } else if (attr.type === 'double') {
                        await databases.createFloatAttribute(VITE_APPWRITE_DATABASE_ID, col.id, attr.key, binding(attr.required), null, null, attr.default);
                    } else if (attr.type === 'boolean') {
                        await databases.createBooleanAttribute(VITE_APPWRITE_DATABASE_ID, col.id, attr.key, binding(attr.required), attr.default);
                    } else if (attr.type === 'datetime') {
                        await databases.createDatetimeAttribute(VITE_APPWRITE_DATABASE_ID, col.id, attr.key, binding(attr.required), attr.default);
                    }
                    console.log(`      + Created attribute: ${attr.key}`);
                    // Wait a bit because attribute creation is async index building
                    await new Promise(r => setTimeout(r, 500));
                } catch (e) {
                    if (e.message.includes('already exists')) {
                        // console.log(`      = Attribute ${attr.key} already exists.`);
                    } else {
                        console.error(`      ❌ Error creating attribute ${attr.key}:`, e.message);
                    }
                }
            }

            // check if we need to seed
            if (col.seed.length > 0) {
                const existing = await databases.listDocuments(VITE_APPWRITE_DATABASE_ID, col.id);
                if (existing.total === 0) {
                    console.log(`   🌱 Seeding ${col.seed.length} items...`);
                    for (const item of col.seed) {
                        await databases.createDocument(VITE_APPWRITE_DATABASE_ID, col.id, ID.unique(), item);
                    }
                    console.log(`   ✅ Seeded.`);
                } else {
                    console.log(`   Collection has ${existing.total} documents. Skipping seed.`);
                }
            }
        }

        console.log('\n✨ Database setup complete!');

    } catch (error) {
        console.error('❌ Critical Error during setup:', error);
    }
}

function binding(required) {
    return required === true;
}

setupDatabase();

import { Client, Databases, Storage, ID } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const {
    VITE_APPWRITE_ENDPOINT,
    VITE_APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY, // Needs to be added to .env
    VITE_APPWRITE_DATABASE_ID = 'main',
    VITE_APPWRITE_USERS_COLLECTION = 'users',
    VITE_APPWRITE_BOOKS_COLLECTION = 'books',
    VITE_APPWRITE_ORDERS_COLLECTION = 'orders',
    VITE_APPWRITE_PAYMENT_NOTIFICATIONS_COLLECTION = 'payment_notifications',
    VITE_APPWRITE_PAYMENT_PROOFS_COLLECTION = 'payment_proofs',
    VITE_APPWRITE_MANUSCRIPTS_COLLECTION = 'manuscripts',
    VITE_APPWRITE_BLOG_COLLECTION = 'blog_posts',
    VITE_APPWRITE_TEAM_COLLECTION = 'team_members',
    VITE_APPWRITE_SERVICES_COLLECTION = 'editorial_services',
    VITE_APPWRITE_BUCKET_ID = 'uploads'
} = process.env;

if (!APPWRITE_API_KEY) {
    console.error('❌ Erro: APPWRITE_API_KEY não encontrada no ficheiro .env');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(VITE_APPWRITE_ENDPOINT)
    .setProject(VITE_APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

async function setup() {
    console.log('🚀 Iniciando configuração do Appwrite...');

    try {
        // Detect Database ID if 'main' fails
        let dbId = VITE_APPWRITE_DATABASE_ID;
        try {
            const dbs = await databases.list();
            if (dbs.databases.length > 0) {
                const mainDb = dbs.databases.find(d => d.$id === dbId || d.name === dbId);
                if (mainDb) {
                    dbId = mainDb.$id;
                    console.log(`✅ Base de dados encontrada: "${dbId}"`);
                } else {
                    dbId = dbs.databases[0].$id;
                    console.log(`⚠️ Database "${VITE_APPWRITE_DATABASE_ID}" não encontrada. Usando "${dbId}" (${dbs.databases[0].name}).`);
                }
            } else {
                console.log('📝 Nenhuma base de dados encontrada. Criando base de dados "main"...');
                const newDb = await databases.create(VITE_APPWRITE_DATABASE_ID, 'Main Database');
                dbId = newDb.$id;
                console.log('✅ Base de dados "main" criada com sucesso.');
            }
        } catch (e) {
            console.error('❌ Erro ao listar/criar bases de dados:', e.message);
            process.exit(1);
        }

        // 1. Update Users Collection
        console.log(`\n📝 Configurando coleção ${VITE_APPWRITE_USERS_COLLECTION}...`);
        try {
            await databases.createCollection(dbId, VITE_APPWRITE_USERS_COLLECTION, VITE_APPWRITE_USERS_COLLECTION, ['read("any")', 'create("users")', 'update("users")']);
            console.log('✅ Coleção de utilizadores criada.');
        } catch (e) { console.log('⚠️ Coleção de utilizadores já existe ou erro:', e.message); }

        const userAttrs = [
            { id: 'bankAccounts', type: 'string', size: 4096, required: false, array: true },
            { id: 'whatsappNumber', type: 'string', size: 32, required: false },
            { id: 'name', type: 'string', size: 255, required: true },
            { id: 'email', type: 'string', size: 255, required: true },
            { id: 'role', type: 'string', size: 32, required: true, default: 'leitor' }
        ];

        for (const attr of userAttrs) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(dbId, VITE_APPWRITE_USERS_COLLECTION, attr.id, attr.size, attr.required, attr.default, attr.array);
                }
                console.log(`✅ Atributo "${attr.id}" criado.`);
            } catch (e) {
                if (attr.id === 'role' && e.message.includes('default value')) {
                    try {
                        await databases.createStringAttribute(dbId, VITE_APPWRITE_USERS_COLLECTION, attr.id, attr.size, false, attr.default);
                        console.log(`✅ Atributo "${attr.id}" criado (sem required).`);
                    } catch (e2) { console.log(`⚠️ Atributo "${attr.id}" erro:`, e2.message); }
                } else {
                    console.log(`⚠️ Atributo "${attr.id}" erro:`, e.message);
                }
            }
        }

        // 2. Create Payment Notifications Collection
        console.log(`\n📝 Criando coleção ${VITE_APPWRITE_PAYMENT_NOTIFICATIONS_COLLECTION}...`);
        try {
            // Using 'any' instead of 'role:all' for modern Appwrite
            await databases.createCollection(dbId, VITE_APPWRITE_PAYMENT_NOTIFICATIONS_COLLECTION, VITE_APPWRITE_PAYMENT_NOTIFICATIONS_COLLECTION, ['read("any")', 'create("users")', 'update("users")']);
            console.log('✅ Coleção de notificações criada.');
        } catch (e) { console.log('⚠️ Coleção já existe ou erro:', e.message); }

        const notificationAttrs = [
            { id: 'orderId', type: 'string', size: 36, required: true },
            { id: 'readerId', type: 'string', size: 36, required: true },
            { id: 'readerName', type: 'string', size: 255, required: true },
            { id: 'readerEmail', type: 'string', size: 255, required: true },
            { id: 'items', type: 'string', size: 4096, required: true, array: true },
            { id: 'totalAmount', type: 'integer', required: true },
            { id: 'status', type: 'string', size: 32, required: true, default: 'pending' },
            { id: 'createdAt', type: 'datetime', required: true },
            { id: 'updatedAt', type: 'datetime', required: true }
        ];

        for (const attr of notificationAttrs) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(dbId, VITE_APPWRITE_PAYMENT_NOTIFICATIONS_COLLECTION, attr.id, attr.size, attr.required, attr.default, attr.array);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(dbId, VITE_APPWRITE_PAYMENT_NOTIFICATIONS_COLLECTION, attr.id, attr.required);
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(dbId, VITE_APPWRITE_PAYMENT_NOTIFICATIONS_COLLECTION, attr.id, attr.required);
                }
                console.log(`✅ Atributo "${attr.id}" criado.`);
            } catch (e) { console.log(`⚠️ Atributo "${attr.id}" erro:`, e.message); }
        }

        // 3. Create Payment Proofs Collection
        console.log(`\n📝 Criando coleção ${VITE_APPWRITE_PAYMENT_PROOFS_COLLECTION}...`);
        try {
            await databases.createCollection(dbId, VITE_APPWRITE_PAYMENT_PROOFS_COLLECTION, VITE_APPWRITE_PAYMENT_PROOFS_COLLECTION, ['read("any")', 'create("users")', 'update("users")']);
            console.log('✅ Coleção de comprovantes criada.');
        } catch (e) { console.log('⚠️ Coleção já existe ou erro:', e.message); }

        const proofAttrs = [
            { id: 'paymentNotificationId', type: 'string', size: 36, required: true },
            { id: 'readerId', type: 'string', size: 36, required: true },
            { id: 'fileUrl', type: 'string', size: 1024, required: true },
            { id: 'fileName', type: 'string', size: 255, required: true },
            { id: 'uploadedAt', type: 'datetime', required: true },
            { id: 'confirmedBy', type: 'string', size: 36, required: false },
            { id: 'confirmedAt', type: 'datetime', required: false },
            { id: 'notes', type: 'string', size: 1024, required: false }
        ];

        for (const attr of proofAttrs) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(dbId, VITE_APPWRITE_PAYMENT_PROOFS_COLLECTION, attr.id, attr.size, attr.required);
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(dbId, VITE_APPWRITE_PAYMENT_PROOFS_COLLECTION, attr.id, attr.required);
                }
                console.log(`✅ Atributo "${attr.id}" criado.`);
            } catch (e) { console.log(`⚠️ Atributo "${attr.id}" erro:`, e.message); }
        }

        // 4. Create Books Collection
        console.log(`\n📝 Criando coleção ${VITE_APPWRITE_BOOKS_COLLECTION}...`);
        try {
            await databases.createCollection(dbId, VITE_APPWRITE_BOOKS_COLLECTION, VITE_APPWRITE_BOOKS_COLLECTION, ['read("any")', 'create("users")', 'update("users")']);
            console.log('✅ Coleção de livros criada.');
        } catch (e) { console.log('⚠️ Coleção já existe ou erro:', e.message); }

        const bookAttrs = [
            { id: 'title', type: 'string', size: 255, required: true },
            { id: 'author', type: 'string', size: 255, required: true },
            { id: 'price', type: 'integer', required: true },
            { id: 'coverUrl', type: 'string', size: 1024, required: true },
            { id: 'category', type: 'string', size: 100, required: true },
            { id: 'isbn', type: 'string', size: 20, required: false },
            { id: 'isNew', type: 'boolean', required: false, default: true },
            { id: 'isBestseller', type: 'boolean', required: false, default: false },
            { id: 'description', type: 'string', size: 5000, required: true },
            { id: 'authorId', type: 'string', size: 36, required: false },
            { id: 'stock', type: 'integer', required: false, default: 0 },
            { id: 'digitalFileUrl', type: 'string', size: 1024, required: false },
            { id: 'format', type: 'string', size: 20, required: false, default: 'físico' }
        ];

        for (const attr of bookAttrs) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(dbId, VITE_APPWRITE_BOOKS_COLLECTION, attr.id, attr.size, attr.required, attr.default);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(dbId, VITE_APPWRITE_BOOKS_COLLECTION, attr.id, attr.required, 0);
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(dbId, VITE_APPWRITE_BOOKS_COLLECTION, attr.id, attr.required, attr.default);
                }
                console.log(`✅ Atributo "${attr.id}" criado.`);
            } catch (e) { console.log(`⚠️ Atributo "${attr.id}" erro:`, e.message); }
        }

        // 5. Create Manuscripts Collection
        console.log(`\n📝 Criando coleção ${VITE_APPWRITE_MANUSCRIPTS_COLLECTION}...`);
        try {
            await databases.createCollection(dbId, VITE_APPWRITE_MANUSCRIPTS_COLLECTION, VITE_APPWRITE_MANUSCRIPTS_COLLECTION, ['read("any")', 'create("users")', 'update("users")']);
            console.log('✅ Coleção de manuscritos criada.');
        } catch (e) { console.log('⚠️ Coleção já existe ou erro:', e.message); }

        const manuscriptAttrs = [
            { id: 'authorId', type: 'string', size: 36, required: true },
            { id: 'authorName', type: 'string', size: 255, required: true },
            { id: 'title', type: 'string', size: 255, required: true },
            { id: 'genre', type: 'string', size: 100, required: true },
            { id: 'pages', type: 'integer', required: false },
            { id: 'synopsis', type: 'string', size: 5000, required: true },
            { id: 'fileUrl', type: 'string', size: 1024, required: true },
            { id: 'fileName', type: 'string', size: 255, required: true },
            { id: 'status', type: 'string', size: 32, required: true, default: 'pending' },
            { id: 'submittedDate', type: 'datetime', required: true },
            { id: 'reviewedDate', type: 'datetime', required: false },
            { id: 'feedback', type: 'string', size: 2000, required: false }
        ];

        for (const attr of manuscriptAttrs) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(dbId, VITE_APPWRITE_MANUSCRIPTS_COLLECTION, attr.id, attr.size, attr.required, attr.default);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(dbId, VITE_APPWRITE_MANUSCRIPTS_COLLECTION, attr.id, attr.required);
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(dbId, VITE_APPWRITE_MANUSCRIPTS_COLLECTION, attr.id, attr.required);
                }
                console.log(`✅ Atributo "${attr.id}" criado.`);
            } catch (e) {
                if (attr.id === 'status' && e.message.includes('default value')) {
                    // Try without required or without default
                    try {
                        await databases.createStringAttribute(dbId, VITE_APPWRITE_MANUSCRIPTS_COLLECTION, attr.id, attr.size, false, attr.default);
                        console.log(`✅ Atributo "${attr.id}" criado (sem required).`);
                    } catch (e2) { console.log(`⚠️ Atributo "${attr.id}" erro persistente:`, e2.message); }
                } else {
                    console.log(`⚠️ Atributo "${attr.id}" erro:`, e.message);
                }
            }
        }

        // 6. Create Blog Posts Collection
        console.log(`\n📝 Criando coleção ${VITE_APPWRITE_BLOG_COLLECTION}...`);
        try {
            await databases.createCollection(dbId, VITE_APPWRITE_BLOG_COLLECTION, VITE_APPWRITE_BLOG_COLLECTION, ['read("any")', 'create("users")', 'update("users")']);
            console.log('✅ Coleção de blog criada.');
        } catch (e) { console.log('⚠️ Coleção já existe ou erro:', e.message); }

        const blogAttrs = [
            { id: 'title', type: 'string', size: 255, required: true },
            { id: 'content', type: 'string', size: 10000, required: true },
            { id: 'imageUrl', type: 'string', size: 1024, required: true },
            { id: 'date', type: 'string', size: 32, required: true },
            { id: 'author', type: 'string', size: 255, required: true }
        ];

        for (const attr of blogAttrs) {
            try {
                await databases.createStringAttribute(dbId, VITE_APPWRITE_BLOG_COLLECTION, attr.id, attr.size, attr.required);
                console.log(`✅ Atributo "${attr.id}" criado.`);
            } catch (e) { console.log(`⚠️ Atributo "${attr.id}" erro:`, e.message); }
        }

        // 7. Create Team Members Collection
        console.log(`\n📝 Criando coleção ${VITE_APPWRITE_TEAM_COLLECTION}...`);
        try {
            await databases.createCollection(dbId, VITE_APPWRITE_TEAM_COLLECTION, VITE_APPWRITE_TEAM_COLLECTION, ['read("any")', 'create("users")', 'update("users")']);
            console.log('✅ Coleção de equipa criada.');
        } catch (e) { console.log('⚠️ Coleção já existe ou erro:', e.message); }

        const teamAttrs = [
            { id: 'name', type: 'string', size: 255, required: true },
            { id: 'role', type: 'string', size: 255, required: true },
            { id: 'department', type: 'string', size: 255, required: true },
            { id: 'bio', type: 'string', size: 2000, required: true },
            { id: 'photoUrl', type: 'string', size: 1024, required: true },
            { id: 'order', type: 'integer', required: false, default: 0 }
        ];

        for (const attr of teamAttrs) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(dbId, VITE_APPWRITE_TEAM_COLLECTION, attr.id, attr.size, attr.required);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(dbId, VITE_APPWRITE_TEAM_COLLECTION, attr.id, attr.required, attr.default);
                }
                console.log(`✅ Atributo "${attr.id}" criado.`);
            } catch (e) { console.log(`⚠️ Atributo "${attr.id}" erro:`, e.message); }
        }

        // 8. Create Editorial Services Collection
        console.log(`\n📝 Criando coleção ${VITE_APPWRITE_SERVICES_COLLECTION}...`);
        try {
            await databases.createCollection(dbId, VITE_APPWRITE_SERVICES_COLLECTION, VITE_APPWRITE_SERVICES_COLLECTION, ['read("any")', 'create("users")', 'update("users")']);
            console.log('✅ Coleção de serviços criada.');
        } catch (e) { console.log('⚠️ Coleção já existe ou erro:', e.message); }

        const serviceAttrs = [
            { id: 'title', type: 'string', size: 255, required: true },
            { id: 'price', type: 'string', size: 255, required: true },
            { id: 'details', type: 'string', size: 2000, required: true, array: true },
            { id: 'order', type: 'integer', required: false, default: 0 }
        ];

        for (const attr of serviceAttrs) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(dbId, VITE_APPWRITE_SERVICES_COLLECTION, attr.id, attr.size, attr.required, undefined, attr.array);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(dbId, VITE_APPWRITE_SERVICES_COLLECTION, attr.id, attr.required, attr.default);
                }
                console.log(`✅ Atributo "${attr.id}" criado.`);
            } catch (e) { console.log(`⚠️ Atributo "${attr.id}" erro:`, e.message); }
        }

        // 9. Create Storage Buckets
        console.log(`\n📦 Criando bucket unificado...`);
        try {
            await storage.createBucket(VITE_APPWRITE_BUCKET_ID, 'General Uploads', ['read("any")', 'create("users")', 'update("users")', 'write("users")'], false, true, 50000000, ['jpg', 'png', 'pdf', 'jpeg', 'docx', 'doc']);
            console.log(`✅ Bucket "${VITE_APPWRITE_BUCKET_ID}" criado.`);
        } catch (e) { console.log(`⚠️ Bucket "${VITE_APPWRITE_BUCKET_ID}" erro:`, e.message); }

        console.log('\n✨ Configuração concluída com sucesso!');
        console.log(`\n📢 IMPORTANTE: Certifique-se que VITE_APPWRITE_DATABASE_ID no .env é "${dbId}"`);

    } catch (error) {
        console.error('\n❌ Erro crítico durante a configuração:', error.message);
    }
}

setup();

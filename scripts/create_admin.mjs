import { Client, Users, Databases } from 'node-appwrite';
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
    VITE_APPWRITE_DATABASE_ID = 'main',
    VITE_APPWRITE_USERS_COLLECTION = 'users'
} = process.env;

const client = new Client()
    .setEndpoint(VITE_APPWRITE_ENDPOINT)
    .setProject(VITE_APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const users = new Users(client);
const databases = new Databases(client);

async function createAdmin() {
    const adminEmail = 'geraleditoragraca@gmail.com';
    const adminPass = 'gracepu47';
    const adminName = 'Editora Graça';
    const adminPhone = '+244947472230';

    console.log(`🚀 Criando administrador: ${adminEmail}...`);

    try {
        // 1. Check if user exists or create
        let user;
        try {
            // Appwrite Users service doesn't have a direct 'getByEmail', we list
            const list = await users.list();
            user = list.users.find(u => u.email === adminEmail);

            if (user) {
                console.log('⚠️ Utilizador já existe no Auth.');
            } else {
                user = await users.create('admin_main', adminEmail, adminPhone, adminPass, adminName);
                console.log('✅ Utilizador criado no Appwrite Auth.');
            }
        } catch (e) {
            console.error('Erro ao verificar/criar no Auth:', e.message);
            // Try creating with unique ID if admin_main is taken
            user = await users.create('unique()', adminEmail, adminPhone, adminPass, adminName);
        }

        if (!user) throw new Error('Falha ao obter objeto do utilizador.');

        // 2. Create/Update Profile in Database
        const profile = {
            name: adminName,
            email: adminEmail,
            role: 'adm',
            whatsappNumber: '947472230'
        };

        try {
            await databases.createDocument(VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_USERS_COLLECTION, user.$id, profile);
            console.log('✅ Perfil de administrador criado na base de dados.');
        } catch (e) {
            if (e.message.includes('already exists') || e.code === 409) {
                await databases.updateDocument(VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_USERS_COLLECTION, user.$id, profile);
                console.log('✅ Perfil de administrador atualizado para "adm".');
            } else {
                console.error('Erro ao salvar no DB:', e.message);
                throw e;
            }
        }

        console.log('\n✨ Administrador configurado com sucesso!');
        console.log(`Email: ${adminEmail}`);
        console.log(`Senha: ${adminPass}`);
    } catch (error) {
        console.error('\n❌ Erro crítico:', error.message);
    }
}

createAdmin();

/**
 * RESET USERS AND SETUP ADMIN SCRIPT
 * 
 * Este script apaga TODOS os utilizadores do Firebase Auth e Firestore
 * e cria o administrador principal.
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
    console.error('\n❌ Erro: serviceAccountKey.json não encontrado!');
    process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function resetAndSetup() {
    console.log('\n🚀 Iniciando reset de utilizadores e setup do admin...\n');

    try {
        // 1. Apagar todos os utilizadores do Firebase Auth
        console.log('🧹 Apagando utilizadores do Firebase Auth...');
        let totalDeleted = 0;

        async function deleteAllUsers(nextPageToken) {
            const listUsersResult = await auth.listUsers(100, nextPageToken);
            if (listUsersResult.users.length > 0) {
                const uids = listUsersResult.users.map(user => user.uid);
                await auth.deleteUsers(uids);
                totalDeleted += uids.length;
                console.log(`   Deletados: ${totalDeleted}`);

                if (listUsersResult.pageToken) {
                    await deleteAllUsers(listUsersResult.pageToken);
                }
            }
        }

        await deleteAllUsers();
        console.log(`✅ ${totalDeleted} utilizadores removidos do Auth.`);

        // 2. Apagar todos os documentos da coleção 'users' no Firestore
        console.log('🧹 Limpando coleção "users" no Firestore...');
        const usersSnapshot = await db.collection('users').get();
        const batch = db.batch();

        usersSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log(`✅ ${usersSnapshot.size} documentos removidos do Firestore.`);

        // 3. Criar o novo Administrador
        const adminEmail = 'geraleditoragraca@gmail.com';
        const adminPassword = '@gracepu47';
        const adminName = 'Administrador Editora Graça';

        console.log(`👤 Criando novo administrador: ${adminEmail}...`);

        const userRecord = await auth.createUser({
            email: adminEmail,
            password: adminPassword,
            displayName: adminName,
            emailVerified: true
        });

        // 4. Criar documento no Firestore
        await db.collection('users').doc(userRecord.uid).set({
            name: adminName,
            email: adminEmail,
            role: 'adm',
            createdAt: new Date().toISOString()
        });

        console.log('\n✨ SUCESSO! ✨');
        console.log('═'.repeat(40));
        console.log(`Admin UID: ${userRecord.uid}`);
        console.log(`Email: ${adminEmail}`);
        console.log(`Role: adm`);
        console.log('═'.repeat(40));

    } catch (error) {
        console.error('\n❌ Erro fatal durante o processo:', error);
        process.exit(1);
    }
}

resetAndSetup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));

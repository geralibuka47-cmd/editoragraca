/**
 * Firebase ADMIN SDK Import Script
 * 
 * Este script usa o Firebase Admin SDK que NÃO requer regras de segurança.
 * 
 * REQUISITO: Baixar Service Account Key do Firebase Console:
 * 1. Firebase Console → Project Settings → Service Accounts
 * 2. Click "Generate New Private Key"
 * 3. Salvar como serviceAccountKey.json na raiz do projeto
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tentar carregar a Service Account Key
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
    console.error('\n❌ Erro: serviceAccountKey.json não encontrado!');
    console.log('\n📋 Instruções:');
    console.log('1. Aceda a: https://console.firebase.google.com/project/editora-graca/settings/serviceaccounts/adminsdk');
    console.log('2. Clique em "Generate New Private Key"');
    console.log('3. Salve o ficheiro como "serviceAccountKey.json" na raiz do projeto');
    console.log('4. Execute este script novamente\n');
    process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

// Inicializar Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const EXPORT_DIR = './supabase-export';

const TABLE_TO_COLLECTION_MAP = {
    'profiles': 'users',
    'books': 'books',
    'orders': 'orders',
    'blog_posts': 'blog',
    'testimonials': 'testimonials',
    'manuscripts': 'manuscripts',
    'site_content': 'siteContent',
    'reviews': 'reviews',
    'payment_notifications': 'paymentNotifications',
    'payment_proofs': 'paymentProofs',
    'blog_likes': 'blogLikes',
    'blog_comments': 'blogComments',
    'book_views': 'bookViews',
    'book_favorites': 'bookFavorites'
};

function toCamelCase(str) {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function transformKeys(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
        return obj.map(item => transformKeys(item));
    }

    const transformed = {};

    for (const [key, value] of Object.entries(obj)) {
        const camelKey = toCamelCase(key);

        // Converter timestamps ISO para Timestamp do Firestore
        if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            transformed[camelKey] = admin.firestore.Timestamp.fromDate(new Date(value));
        }
        else if (value && typeof value === 'object' && !Array.isArray(value)) {
            transformed[camelKey] = transformKeys(value);
        }
        else if (Array.isArray(value)) {
            transformed[camelKey] = value.map(item =>
                typeof item === 'object' ? transformKeys(item) : item
            );
        }
        else {
            transformed[camelKey] = value;
        }
    }

    return transformed;
}

async function importCollection(tableName, collectionName) {
    const filePath = path.join(EXPORT_DIR, `${tableName}.json`);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Arquivo não encontrado: ${tableName}.json`);
        return { success: false, count: 0 };
    }

    console.log(`📦 Importando ${tableName} → ${collectionName}...`);

    try {
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const records = JSON.parse(jsonData);

        if (!Array.isArray(records) || records.length === 0) {
            console.log(`⚠️  ${tableName}: Sem dados para importar`);
            return { success: true, count: 0 };
        }

        const batch = db.batch();
        let imported = 0;

        for (const record of records) {
            try {
                const transformedData = transformKeys(record);
                const docId = record.id;
                const docRef = db.collection(collectionName).doc(docId);

                batch.set(docRef, transformedData);
                imported++;

                process.stdout.write(`\r   Preparados: ${imported}/${records.length}`);

            } catch (error) {
                console.error(`\n❌ Erro ao preparar documento:`, error.message);
            }
        }

        // Commit batch
        await batch.commit();

        console.log(`\n✅ ${collectionName}: ${imported} documentos importados`);
        return { success: true, count: imported };

    } catch (error) {
        console.error(`\n❌ Erro ao importar ${tableName}:`, error.message);
        return { success: false, count: 0 };
    }
}

async function importAllData() {
    console.log('\n🚀 Iniciando importação via Firebase Admin SDK...\n');

    const results = [];

    for (const [tableName, collectionName] of Object.entries(TABLE_TO_COLLECTION_MAP)) {
        const result = await importCollection(tableName, collectionName);
        results.push({
            table: tableName,
            collection: collectionName,
            ...result
        });
    }

    console.log('\n📊 SUMÁRIO DA IMPORTAÇÃO\n');
    console.log('═'.repeat(60));

    let totalRecords = 0;
    let successCount = 0;

    results.forEach(r => {
        const status = r.success ? '✅' : '❌';
        console.log(`${status} ${r.table.padEnd(25)} → ${r.collection.padEnd(25)} ${r.count.toString().padStart(4)} docs`);
        if (r.success && r.count > 0) {
            totalRecords += r.count;
            successCount++;
        }
    });

    console.log('═'.repeat(60));
    console.log(`\n✅ ${successCount} coleções com dados importadas`);
    console.log(`📊 Total de documentos: ${totalRecords}\n`);
    console.log('✅ Importação concluída!\n');
}

// Executar
importAllData()
    .then(() => {
        console.log('🎉 Processo finalizado com sucesso!');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Erro fatal:', error);
        process.exit(1);
    });

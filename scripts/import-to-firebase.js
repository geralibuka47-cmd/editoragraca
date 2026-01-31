/**
 * Firebase Firestore Import Script
 * 
 * Este script importa os dados exportados do Supabase para o Firebase Firestore.
 * 
 * IMPORTANTE: Execute este script apenas UMA VEZ para evitar duplicação de dados!
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Configuração Firebase
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const EXPORT_DIR = './supabase-export';

// Mapeamento de tabelas Supabase → Coleções Firestore
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

/**
 * Converte snake_case para camelCase
 */
function toCamelCase(str) {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Transforma objeto de snake_case para camelCase
 */
function transformKeys(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
        return obj.map(item => transformKeys(item));
    }

    const transformed = {};

    for (const [key, value] of Object.entries(obj)) {
        const camelKey = toCamelCase(key);

        // Converter timestamps ISO para Timestamp do Firebase
        if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            transformed[camelKey] = Timestamp.fromDate(new Date(value));
        }
        // Recursivamente transformar objetos aninhados
        else if (value && typeof value === 'object' && !Array.isArray(value)) {
            transformed[camelKey] = transformKeys(value);
        }
        // Manter arrays como estão (mas transformar conteúdo se necessário)
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

/**
 * Importa uma coleção para o Firestore
 */
async function importCollection(tableName, collectionName) {
    const filePath = path.join(EXPORT_DIR, `${tableName}.json`);

    // Verificar se arquivo existe
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

        let imported = 0;

        for (const record of records) {
            try {
                // Transformar dados
                const transformedData = transformKeys(record);

                // Usar o ID do Supabase como ID do documento Firestore
                const docId = record.id;
                const docRef = doc(db, collectionName, docId);

                // Importar documento
                await setDoc(docRef, transformedData);
                imported++;

                process.stdout.write(`\r   Importados: ${imported}/${records.length}`);

            } catch (error) {
                console.error(`\n❌ Erro ao importar documento:`, error.message);
            }
        }

        console.log(`\n✅ ${collectionName}: ${imported} documentos importados`);
        return { success: true, count: imported };

    } catch (error) {
        console.error(`\n❌ Erro ao importar ${tableName}:`, error.message);
        return { success: false, count: 0 };
    }
}

/**
 * Função principal de importação
 */
async function importAllData() {
    console.log('\n🚀 Iniciando importação de dados para Firebase Firestore...\n');
    console.log('⚠️  ATENÇÃO: Execute este script apenas UMA VEZ!\n');

    const results = [];

    for (const [tableName, collectionName] of Object.entries(TABLE_TO_COLLECTION_MAP)) {
        const result = await importCollection(tableName, collectionName);
        results.push({
            table: tableName,
            collection: collectionName,
            ...result
        });
    }

    // Sumário
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
    console.log(`\n✅ ${successCount} coleções importadas com sucesso`);
    console.log(`📊 Total de documentos: ${totalRecords}\n`);
    console.log('✅ Importação concluída!\n');

    // Salvar relatório
    const report = {
        importDate: new Date().toISOString(),
        collections: results,
        totalRecords,
        successCount
    };

    fs.writeFileSync(
        path.join(EXPORT_DIR, '_import_report.json'),
        JSON.stringify(report, null, 2),
        'utf-8'
    );

    console.log('📄 Relatório salvo em: supabase-export/_import_report.json\n');
}

// Executar
console.log('\n⏳ Aguarde 5 segundos antes de iniciar...');
console.log('   Pressione Ctrl+C para cancelar.\n');

setTimeout(() => {
    importAllData()
        .then(() => {
            console.log('🎉 Processo finalizado com sucesso!');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Erro fatal:', error);
            process.exit(1);
        });
}, 5000);

/**
 * Supabase Data Export Script
 * 
 * Este script exporta todos os dados do Supabase para ficheiros JSON
 * que serão importados para o Firebase Firestore.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Erro: Credenciais Supabase não encontradas no .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Diretório para salvar os exports
const EXPORT_DIR = './supabase-export';

// Criar diretório se não existir
if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

/**
 * Exporta uma tabela do Supabase para JSON
 */
async function exportTable(tableName, filename) {
    console.log(`📦 Exportando ${tableName}...`);

    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*');

        if (error) {
            console.error(`❌ Erro ao exportar ${tableName}:`, error.message);
            return { success: false, count: 0 };
        }

        const filePath = path.join(EXPORT_DIR, filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

        console.log(`✅ ${tableName}: ${data?.length || 0} registos exportados → ${filename}`);
        return { success: true, count: data?.length || 0 };

    } catch (error) {
        console.error(`❌ Erro ao exportar ${tableName}:`, error.message);
        return { success: false, count: 0 };
    }
}

/**
 * Função principal de exportação
 */
async function exportAllData() {
    console.log('\n🚀 Iniciando exportação de dados do Supabase...\n');

    const tables = [
        { name: 'profiles', file: 'profiles.json' },
        { name: 'books', file: 'books.json' },
        { name: 'orders', file: 'orders.json' },
        { name: 'blog_posts', file: 'blog_posts.json' },
        { name: 'testimonials', file: 'testimonials.json' },
        { name: 'manuscripts', file: 'manuscripts.json' },
        { name: 'site_content', file: 'site_content.json' },
        { name: 'team', file: 'team.json' },
        { name: 'services', file: 'services.json' },
        { name: 'reviews', file: 'reviews.json' },
        { name: 'payment_notifications', file: 'payment_notifications.json' },
        { name: 'payment_proofs', file: 'payment_proofs.json' },
        { name: 'blog_likes', file: 'blog_likes.json' },
        { name: 'blog_comments', file: 'blog_comments.json' },
        { name: 'book_views', file: 'book_views.json' },
        { name: 'book_favorites', file: 'book_favorites.json' }
    ];

    const results = [];

    for (const table of tables) {
        const result = await exportTable(table.name, table.file);
        results.push({ table: table.name, ...result });
    }

    // Sumário
    console.log('\n📊 SUMÁRIO DA EXPORTAÇÃO\n');
    console.log('═'.repeat(50));

    let totalRecords = 0;
    let successCount = 0;

    results.forEach(r => {
        const status = r.success ? '✅' : '❌';
        console.log(`${status} ${r.table.padEnd(25)} ${r.count.toString().padStart(6)} registos`);
        if (r.success) {
            totalRecords += r.count;
            successCount++;
        }
    });

    console.log('═'.repeat(50));
    console.log(`\n📁 Ficheiros salvos em: ${EXPORT_DIR}`);
    console.log(`✅ ${successCount}/${tables.length} tabelas exportadas com sucesso`);
    console.log(`📊 Total de registos: ${totalRecords}\n`);

    // Criar ficheiro de metadata
    const metadata = {
        exportDate: new Date().toISOString(),
        tables: results,
        totalRecords,
        exportDir: EXPORT_DIR
    };

    fs.writeFileSync(
        path.join(EXPORT_DIR, '_metadata.json'),
        JSON.stringify(metadata, null, 2),
        'utf-8'
    );

    console.log('✅ Exportação concluída!\n');
}

// Executar
exportAllData()
    .then(() => {
        console.log('🎉 Processo finalizado com sucesso!');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Erro fatal:', error);
        process.exit(1);
    });

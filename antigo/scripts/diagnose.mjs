import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 DIAGNÓSTICO COMPLETO DO SUPABASE\n');
console.log('📋 Configuração:');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Anon Key: ${supabaseAnonKey ? '✅ Presente' : '❌ Ausente'}\n`);

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Credenciais do Supabase estão faltando no .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnose() {
    console.log('🧪 Testando conexão e tabelas...\n');

    const tables = [
        { name: 'books', description: 'Livros' },
        { name: 'blog_posts', description: 'Posts do Blog' },
        { name: 'team_members', description: 'Membros da Equipe' },
        { name: 'editorial_services', description: 'Serviços Editoriais' },
        { name: 'profiles', description: 'Perfis de Utilizadores' }
    ];

    let allGood = true;

    for (const table of tables) {
        try {
            const { data, error, count } = await supabase
                .from(table.name)
                .select('*', { count: 'exact', head: true });

            if (error) {
                console.log(`❌ ${table.description} (${table.name}): ${error.message}`);
                if (error.message.includes('does not exist')) {
                    console.log(`   ⚠️  A tabela não existe! Execute o SQL no Supabase.`);
                } else if (error.message.includes('infinite recursion')) {
                    console.log(`   ⚠️  Erro de recursão nas políticas RLS!`);
                }
                allGood = false;
            } else {
                console.log(`✅ ${table.description} (${table.name}): ${count || 0} registros`);
            }
        } catch (err) {
            console.log(`❌ ${table.description} (${table.name}): ${err.message}`);
            allGood = false;
        }
    }

    console.log('\n' + '='.repeat(60));

    if (allGood) {
        console.log('✨ TUDO OK! O Supabase está configurado corretamente.');
        console.log('\n💡 Se o site ainda não carrega:');
        console.log('   1. Limpe o cache do navegador (Ctrl+Shift+Delete)');
        console.log('   2. Recarregue a página (Ctrl+F5)');
    } else {
        console.log('⚠️  PROBLEMAS DETECTADOS!');
        console.log('\n🔧 Solução:');
        console.log('   1. Vá ao SQL Editor no Supabase');
        console.log('   2. Cole o conteúdo de scripts/supabase_schema.sql');
        console.log('   3. Clique em "Run"');
        console.log('   4. Execute: npm run setup:db');
        console.log('   5. Recarregue o site');
    }

    console.log('='.repeat(60) + '\n');
}

diagnose();

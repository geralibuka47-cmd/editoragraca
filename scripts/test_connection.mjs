import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase credentials missing in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('🔍 Testing Supabase connection...\n');

    try {
        // Test 1: Books
        console.log('📚 Testing books table...');
        const { data: books, error: booksError } = await supabase
            .from('books')
            .select('*')
            .limit(3);

        if (booksError) {
            console.error('❌ Books error:', booksError.message);
        } else {
            console.log(`✅ Books loaded: ${books?.length || 0} records`);
        }

        // Test 2: Blog Posts
        console.log('\n📝 Testing blog_posts table...');
        const { data: posts, error: postsError } = await supabase
            .from('blog_posts')
            .select('*')
            .limit(3);

        if (postsError) {
            console.error('❌ Blog posts error:', postsError.message);
        } else {
            console.log(`✅ Blog posts loaded: ${posts?.length || 0} records`);
        }

        // Test 3: Team Members
        console.log('\n👥 Testing team_members table...');
        const { data: team, error: teamError } = await supabase
            .from('team_members')
            .select('*')
            .limit(3);

        if (teamError) {
            console.error('❌ Team members error:', teamError.message);
        } else {
            console.log(`✅ Team members loaded: ${team?.length || 0} records`);
        }

        // Test 4: Profiles (might fail if no data)
        console.log('\n👤 Testing profiles table...');
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .limit(3);

        if (profilesError) {
            console.error('❌ Profiles error:', profilesError.message);
        } else {
            console.log(`✅ Profiles loaded: ${profiles?.length || 0} records`);
        }

        console.log('\n✨ Connection test complete!');
    } catch (error) {
        console.error('❌ Fatal error:', error);
    }
}

testConnection();

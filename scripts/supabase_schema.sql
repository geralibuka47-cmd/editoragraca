-- Editora Graça - Supabase Schema
-- Este script APAGA o banco anterior e implementa o novo

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Limpar tabelas existentes (Cascade apaga dependências)
drop table if exists public.blog_comments cascade;
drop table if exists public.blog_likes cascade;
drop table if exists public.book_views cascade;
drop table if exists public.book_favorites cascade;
drop table if exists public.site_content cascade;
drop table if exists public.testimonials cascade;
drop table if exists public.notifications cascade;
drop table if exists public.payment_proofs cascade;
drop table if exists public.manuscripts cascade;
drop table if exists public.payment_notifications cascade;
drop table if exists public.reviews cascade;
drop table if exists public.orders cascade;
drop table if exists public.editorial_services cascade;
drop table if exists public.team_members cascade;
drop table if exists public.blog_posts cascade;
drop table if exists public.profiles cascade;
drop table if exists public.books cascade;

-- Books Table
create table public.books (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    author text not null,
    price numeric not null,
    stock integer default 0,
    category text,
    isbn text,
    cover_url text,
    description text,
    is_bestseller boolean default false,
    is_new boolean default false,
    author_id text,
    format text,
    pages integer,
    digital_file_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Users Profile Table (Extensions of Supabase Auth)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text,
    email text,
    role text default 'reader',
    whatsapp_number text,
    address text,
    bio text,
    photo_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Blog Posts Table
create table public.blog_posts (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    content text not null,
    image_url text,
    author text,
    date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Blog Likes Table
create table public.blog_likes (
    id uuid default uuid_generate_v4() primary key,
    post_id uuid references public.blog_posts on delete cascade,
    user_id uuid references auth.users on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(post_id, user_id)
);

-- Blog Comments Table
create table public.blog_comments (
    id uuid default uuid_generate_v4() primary key,
    post_id uuid references public.blog_posts on delete cascade,
    user_id uuid references auth.users on delete cascade,
    user_name text not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Team Members Table
create table public.team_members (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    role text not null,
    department text,
    bio text,
    photo_url text,
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Editorial Services Table
create table public.editorial_services (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    price text not null,
    details text[] not null,
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders Table
create table public.orders (
    id uuid default uuid_generate_v4() primary key,
    customer_id uuid references auth.users,
    customer_name text not null,
    customer_email text not null,
    items jsonb not null,
    total numeric not null,
    status text default 'Pendente',
    payment_method text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payment Notifications Table
create table public.payment_notifications (
    id uuid default uuid_generate_v4() primary key,
    order_id uuid references public.orders,
    reader_id uuid references auth.users,
    reader_name text not null,
    reader_email text not null,
    total_amount numeric not null,
    items jsonb,
    status text default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone
);

-- Payment Proofs Table
create table public.payment_proofs (
    id uuid default uuid_generate_v4() primary key,
    payment_notification_id uuid references public.payment_notifications on delete cascade,
    file_url text not null,
    notes text,
    confirmed_by uuid references auth.users,
    confirmed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Manuscripts Table
create table public.manuscripts (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    author_id uuid references auth.users,
    author_name text not null,
    genre text,
    description text,
    file_url text not null,
    status text default 'pending',
    submitted_date timestamp with time zone default timezone('utc'::text, now()) not null,
    reviewed_date timestamp with time zone,
    feedback text
);

-- Reviews Table
create table public.reviews (
    id uuid default uuid_generate_v4() primary key,
    book_id uuid references public.books on delete cascade,
    user_id uuid references auth.users on delete cascade,
    user_name text not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Book Views Table
create table public.book_views (
    id uuid default uuid_generate_v4() primary key,
    book_id uuid references public.books on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Book Favorites Table
create table public.book_favorites (
    id uuid default uuid_generate_v4() primary key,
    book_id uuid references public.books on delete cascade,
    user_id uuid references auth.users on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(book_id, user_id)
);

-- Site Content Table (Key-Value/JSON storage for dynamic text)
create table public.site_content (
    id uuid default uuid_generate_v4() primary key,
    section text not null, -- e.g., 'home.hero', 'about.mission'
    key text not null unique,
    content jsonb not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Testimonials Table
create table public.testimonials (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    role text,
    content text not null,
    photo_url text,
    rating integer default 5,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications Table
create table public.notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users on delete cascade,
    type text not null, -- 'order', 'blog', 'manuscript', 'info'
    title text not null,
    content text not null,
    link text,
    is_read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) - Comprehensive Setup

-- Helper function to check if current user is admin (avoids recursion)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'adm'
  );
end;
$$ language plpgsql security definer;

-- Books
alter table public.books enable row level security;
create policy "Public Read Books" on public.books for select using (true);
create policy "Admin Full Access Books" on public.books for all using (public.is_admin());

-- Blog Posts
alter table public.blog_posts enable row level security;
create policy "Public Read Blog" on public.blog_posts for select using (true);
create policy "Admin Full Access Blog" on public.blog_posts for all using (public.is_admin());

-- Blog Likes
alter table public.blog_likes enable row level security;
create policy "Public Read Blog Likes" on public.blog_likes for select using (true);
create policy "Auth Users Toggle Likes" on public.blog_likes for all using (auth.role() = 'authenticated');

-- Blog Comments
alter table public.blog_comments enable row level security;
create policy "Public Read Blog Comments" on public.blog_comments for select using (true);
create policy "Auth Users Post Comments" on public.blog_comments for insert with check (auth.role() = 'authenticated');
create policy "Owners/Admins Delete Comments" on public.blog_comments for delete using (auth.uid() = user_id or public.is_admin());

-- Team Members
alter table public.team_members enable row level security;
create policy "Public Read Team" on public.team_members for select using (true);
create policy "Admin Full Access Team" on public.team_members for all using (public.is_admin());

-- Editorial Services
alter table public.editorial_services enable row level security;
create policy "Public Read Services" on public.editorial_services for select using (true);
create policy "Admin Full Access Services" on public.editorial_services for all using (public.is_admin());

-- Profiles (special handling to avoid recursion)
alter table public.profiles enable row level security;
create policy "Public can read profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "System can insert profiles" on public.profiles for insert with check (true);
create policy "Admins can manage profiles" on public.profiles for all using (public.is_admin());

-- Orders
alter table public.orders enable row level security;
create policy "Users can see own orders" on public.orders for select using (auth.uid() = customer_id);
create policy "Admins can see all orders" on public.orders for select using (public.is_admin());
create policy "Anyone can create orders" on public.orders for insert with check (true); 
create policy "Admins can update orders" on public.orders for update using (public.is_admin());

-- Reviews
alter table public.reviews enable row level security;
create policy "Everyone can read reviews" on public.reviews for select using (true);
create policy "Auth users can create reviews" on public.reviews for insert with check (auth.role() = 'authenticated');
create policy "Owners/Admins can delete reviews" on public.reviews for delete 
    using (auth.uid() = user_id or public.is_admin());

-- Manuscripts
alter table public.manuscripts enable row level security;
create policy "Authors can see own manuscripts" on public.manuscripts for select using (auth.uid() = author_id);
create policy "Admins can see all manuscripts" on public.manuscripts for select using (public.is_admin());
create policy "Authors can submit manuscripts" on public.manuscripts for insert with check (auth.uid() = author_id);
create policy "Admins can update manuscripts" on public.manuscripts for update using (public.is_admin());

-- Payment Proofs
alter table public.payment_proofs enable row level security;
create policy "Admins full access proofs" on public.payment_proofs for all using (public.is_admin());
create policy "Users can see own proofs" on public.payment_proofs for select using (auth.uid() = reader_id);
create policy "Users can insert own proofs" on public.payment_proofs for insert with check (true);

-- Payment Notifications
alter table public.payment_notifications enable row level security;
create policy "Public can create notifications" on public.payment_notifications for insert with check (true);
create policy "Users can see own notifications" on public.payment_notifications for select using (auth.uid() = reader_id);
create policy "Admins can manage notifications" on public.payment_notifications for all using (public.is_admin());

-- Book Views
alter table public.book_views enable row level security;
create policy "Public can insert views" on public.book_views for insert with check (true);
create policy "Public can read views" on public.book_views for select using (true);

-- Book Favorites
alter table public.book_favorites enable row level security;
create policy "Users can see own favorites" on public.book_favorites for select using (auth.uid() = user_id);
create policy "Users can control own favorites" on public.book_favorites for all using (auth.uid() = user_id);
create policy "Admins can see all favorites" on public.book_favorites for select using (public.is_admin());

-- Site Content
alter table public.site_content enable row level security;
create policy "Public can read site content" on public.site_content for select using (true);
create policy "Admins can manage site content" on public.site_content for all using (public.is_admin());

-- Testimonials
alter table public.testimonials enable row level security;
create policy "Public can read testimonials" on public.testimonials for select using (is_active = true);
create policy "Admins can manage testimonials" on public.testimonials for all using (public.is_admin());

-- Notifications
alter table public.notifications enable row level security;
create policy "Users can see own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "Admins can manage all notifications" on public.notifications for all using (public.is_admin());

-- Finalização: Criação da Conta administrativa inicial
-- Habilitar pgcrypto para hashing de senha se necessário
create extension if not exists pgcrypto;

-- Inserir usuário no Auth (se não existir)
-- Nota: Usamos o ID fixo para consistência
insert into auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
values (
    '50cb5949-2b61-44ef-8aa3-5a2ea338179c', 
    '00000000-0000-0000-0000-000000000000', 
    'geraleditoragraca@gmail.com', 
    crypt('gracepu47', gen_salt('bf')), 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Administrador"}', 
    now(), 
    now(), 
    'authenticated', 
    'authenticated', 
    ''
)
on conflict (id) do nothing;

-- Garantir que o perfil administrativo existe e tem o cargo correto
insert into public.profiles (id, name, email, role)
values (
    '50cb5949-2b61-44ef-8aa3-5a2ea338179c', 
    'Administrador Editora Graça', 
    'geraleditoragraca@gmail.com', 
    'adm'
)
on conflict (id) do update set role = 'adm';

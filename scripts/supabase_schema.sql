-- Editora Graça - Supabase Schema
-- Este script APAGA o banco anterior e implementa o novo

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Limpar tabelas existentes (Cascade apaga dependências)
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
    book_id uuid references public.books,
    user_id uuid references auth.users,
    user_name text not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) - Comprehensive Setup

-- Books
alter table public.books enable row level security;
create policy "Public Read Books" on public.books for select using (true);
create policy "Admin Full Access Books" on public.books 
    for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'adm'));

-- Blog Posts
alter table public.blog_posts enable row level security;
create policy "Public Read Blog" on public.blog_posts for select using (true);
create policy "Admin Full Access Blog" on public.blog_posts 
    for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'adm'));

-- Team Members
alter table public.team_members enable row level security;
create policy "Public Read Team" on public.team_members for select using (true);
create policy "Admin Full Access Team" on public.team_members 
    for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'adm'));

-- Editorial Services
alter table public.editorial_services enable row level security;
create policy "Public Read Services" on public.editorial_services for select using (true);
create policy "Admin Full Access Services" on public.editorial_services 
    for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'adm'));

-- Profiles
alter table public.profiles enable row level security;
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admins can read all profiles" on public.profiles for select 
    using (exists (select 1 from public.profiles where id = auth.uid() and role = 'adm'));
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "System/Admin can insert profiles" on public.profiles for insert with check (true);

-- Orders
alter table public.orders enable row level security;
create policy "Users can see own orders" on public.orders for select using (auth.uid() = customer_id);
create policy "Admins can see all orders" on public.orders for select 
    using (exists (select 1 from public.profiles where id = auth.uid() and role = 'adm'));
create policy "Anyone can create orders" on public.orders for insert with check (true); 
create policy "Admins can update orders" on public.orders for update 
    using (exists (select 1 from public.profiles where id = auth.uid() and role = 'adm'));

-- Reviews
alter table public.reviews enable row level security;
create policy "Everyone can read reviews" on public.reviews for select using (true);
create policy "Auth users can create reviews" on public.reviews for insert with check (auth.role() = 'authenticated');
create policy "Owners/Admins can delete reviews" on public.reviews for delete 
    using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'adm'));

-- Manuscripts
alter table public.manuscripts enable row level security;
create policy "Authors can see own manuscripts" on public.manuscripts for select using (auth.uid() = author_id);
create policy "Admins can see all manuscripts" on public.manuscripts for select 
    using (exists (select 1 from public.profiles where id = auth.uid() and role = 'adm'));
create policy "Authors can submit manuscripts" on public.manuscripts for insert with check (auth.uid() = author_id);
create policy "Admins can update manuscripts" on public.manuscripts for update 
    using (exists (select 1 from public.profiles where id = auth.uid() and role = 'adm'));

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

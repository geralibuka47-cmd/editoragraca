-- Editora Graça - Supabase Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Books Table
create table if not exists public.books (
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
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text,
    role text default 'reader',
    whatsapp_number text,
    address text,
    bio text,
    photo_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Blog Posts Table
create table if not exists public.blog_posts (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    content text not null,
    image_url text,
    author text,
    date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Team Members Table
create table if not exists public.team_members (
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
create table if not exists public.editorial_services (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    price text not null,
    details text[] not null,
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders Table
create table if not exists public.orders (
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
create table if not exists public.payment_notifications (
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

-- Manuscripts Table
create table if not exists public.manuscripts (
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
create table if not exists public.reviews (
    id uuid default uuid_generate_v4() primary key,
    book_id uuid references public.books,
    user_id uuid references auth.users,
    user_name text not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) - Basic Setup
-- Allow everyone to read public data
alter table public.books enable row level security;
alter table public.blog_posts enable row level security;
alter table public.team_members enable row level security;
alter table public.editorial_services enable row level security;

create policy "Public Read" on public.books for select using (true);
create policy "Public Read" on public.blog_posts for select using (true);
create policy "Public Read" on public.team_members for select using (true);
create policy "Public Read" on public.editorial_services for select using (true);

-- Authenticated users can create reviews and orders
alter table public.orders enable row level security;
create policy "Users can see own orders" on public.orders for select using (auth.uid() = customer_id);
create policy "Users can create orders" on public.orders for insert with check (auth.uid() = customer_id or auth.uid() is null); -- allow guest orders for now?

alter table public.reviews enable row level security;
create policy "Everyone can read reviews" on public.reviews for select using (true);
create policy "Auth users can create reviews" on public.reviews for insert with check (auth.role() = 'authenticated');

-- Esquema de base de datos para ViralScript AI
-- Ejecuta este SQL en Supabase → SQL Editor → New query

-- Tabla: ganchos guardados
create table if not exists public.hooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tema text not null,
  hook_type text not null,
  hook_text text not null,
  platform text not null default 'instagram',
  tone text not null default 'casual',
  niche text not null default 'otro',
  is_favorite boolean not null default false,
  used_count integer not null default 0,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists hooks_user_idx on public.hooks (user_id, created_at desc);
create index if not exists hooks_favorite_idx on public.hooks (user_id, is_favorite) where is_favorite = true;
create index if not exists hooks_used_idx on public.hooks (user_id, used_count desc);

-- Tabla: guiones guardados
create table if not exists public.scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tema text not null,
  framework text not null,
  hook_type text not null,
  platform text not null default 'instagram',
  tone text not null default 'casual',
  niche text not null default 'otro',
  length text not null default 'medio',
  script_content text not null,
  hook_id uuid references public.hooks(id) on delete set null,
  is_approved boolean not null default false,
  score integer,
  created_at timestamptz not null default now()
);

create index if not exists scripts_user_idx on public.scripts (user_id, created_at desc);
create index if not exists scripts_approved_idx on public.scripts (user_id, is_approved) where is_approved = true;

-- Tabla: perfil de estilo (defaults por usuario para el humanizador)
create table if not exists public.style_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  region text not null default 'neutro',
  personality text not null default 'directo',
  nivel_humanizacion text not null default 'moderado',
  default_platform text not null default 'instagram',
  default_tone text not null default 'casual',
  default_niche text not null default 'otro',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security: cada usuario solo ve sus datos
alter table public.hooks enable row level security;
alter table public.scripts enable row level security;
alter table public.style_profiles enable row level security;

-- Políticas: solo el dueño lee/escribe sus filas
drop policy if exists "own hooks read" on public.hooks;
create policy "own hooks read" on public.hooks for select using (auth.uid() = user_id);
drop policy if exists "own hooks write" on public.hooks;
create policy "own hooks write" on public.hooks for insert with check (auth.uid() = user_id);
drop policy if exists "own hooks update" on public.hooks;
create policy "own hooks update" on public.hooks for update using (auth.uid() = user_id);
drop policy if exists "own hooks delete" on public.hooks;
create policy "own hooks delete" on public.hooks for delete using (auth.uid() = user_id);

drop policy if exists "own scripts read" on public.scripts;
create policy "own scripts read" on public.scripts for select using (auth.uid() = user_id);
drop policy if exists "own scripts write" on public.scripts;
create policy "own scripts write" on public.scripts for insert with check (auth.uid() = user_id);
drop policy if exists "own scripts update" on public.scripts;
create policy "own scripts update" on public.scripts for update using (auth.uid() = user_id);
drop policy if exists "own scripts delete" on public.scripts;
create policy "own scripts delete" on public.scripts for delete using (auth.uid() = user_id);

drop policy if exists "own style read" on public.style_profiles;
create policy "own style read" on public.style_profiles for select using (auth.uid() = user_id);
drop policy if exists "own style write" on public.style_profiles;
create policy "own style write" on public.style_profiles for insert with check (auth.uid() = user_id);
drop policy if exists "own style update" on public.style_profiles;
create policy "own style update" on public.style_profiles for update using (auth.uid() = user_id);

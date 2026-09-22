-- GastroConnect launch fixes.
-- Run this in Supabase SQL Editor before advertising the site.
-- It does not expose service-role/private keys and is safe for a frontend-only app.

create extension if not exists pgcrypto;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create table if not exists public.public_submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('worker', 'restaurant', 'supplier', 'callback', 'feedback', 'telegram_bot')),
  title text,
  phone text,
  telegram text,
  city text,
  email text,
  personal_data_consent boolean not null default false,
  personal_data_consent_date timestamptz,
  ip_address text,
  user_agent text,
  source text not null default 'site',
  status text not null default 'new',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.public_submissions
  add column if not exists email text,
  add column if not exists personal_data_consent boolean not null default false,
  add column if not exists personal_data_consent_date timestamptz,
  add column if not exists ip_address text,
  add column if not exists user_agent text,
  add column if not exists source text not null default 'site',
  add column if not exists status text not null default 'new';

alter table public.public_submissions enable row level security;
grant insert on public.public_submissions to anon, authenticated;
grant select on public.public_submissions to authenticated;

drop policy if exists public_submissions_insert_anon on public.public_submissions;
create policy public_submissions_insert_anon
on public.public_submissions
for insert
to anon, authenticated
with check (type in ('worker', 'restaurant', 'supplier', 'callback', 'feedback', 'telegram_bot'));

drop policy if exists public_submissions_admin_select on public.public_submissions;
create policy public_submissions_admin_select
on public.public_submissions
for select
to authenticated
using (public.is_admin());

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('worker', 'restaurant', 'supplier', 'admin')),
  name text not null,
  email text,
  phone text,
  auth_provider text,
  city text,
  district text,
  status text not null default 'active',
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists auth_provider text;

alter table public.profiles enable row level security;
grant select, insert, update on public.profiles to authenticated;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
  and role in ('worker', 'restaurant', 'supplier')
);

drop policy if exists profiles_update_own_or_admin on public.profiles;
create policy profiles_update_own_or_admin
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (
  public.is_admin()
  or (
    id = auth.uid()
    and role in ('worker', 'restaurant', 'supplier')
  )
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, name, email, phone, auth_provider, city, status)
  values (
    new.id,
    case
      when new.raw_user_meta_data->>'role' in ('worker', 'restaurant', 'supplier')
        then new.raw_user_meta_data->>'role'
      else 'worker'
    end,
    coalesce(new.raw_user_meta_data->>'name', new.email, 'Пользователь'),
    new.email,
    new.phone,
    coalesce(new.raw_user_meta_data->>'auth_provider', case when new.phone is not null and new.email is null then 'phone' else 'email' end),
    new.raw_user_meta_data->>'city',
    'active'
  )
  on conflict (id) do update set
    role = excluded.role,
    name = excluded.name,
    email = coalesce(public.profiles.email, excluded.email),
    phone = coalesce(public.profiles.phone, excluded.phone),
    auth_provider = coalesce(public.profiles.auth_provider, excluded.auth_provider),
    updated_at = now();

  insert into public.admin_user_accounts (
    user_id,
    role,
    email,
    phone,
    name,
    city,
    auth_provider,
    status,
    source,
    raw_meta,
    personal_data_consent,
    personal_data_consent_date,
    user_agent,
    ip_address,
    updated_at
  )
  values (
    new.id,
    case
      when new.raw_user_meta_data->>'role' in ('worker', 'restaurant', 'supplier')
        then new.raw_user_meta_data->>'role'
      else 'worker'
    end,
    new.email,
    new.phone,
    coalesce(new.raw_user_meta_data->>'name', new.email, new.phone, 'Пользователь'),
    new.raw_user_meta_data->>'city',
    coalesce(new.raw_user_meta_data->>'auth_provider', case when new.phone is not null and new.email is null then 'phone' else 'email' end),
    'active',
    'auth_trigger',
    coalesce(new.raw_user_meta_data, '{}'::jsonb),
    coalesce((new.raw_user_meta_data->>'personalDataConsent')::boolean, false),
    nullif(new.raw_user_meta_data->>'personalDataConsentDate', '')::timestamptz,
    new.raw_user_meta_data->>'userAgent',
    new.raw_user_meta_data->>'ipAddress',
    now()
  )
  on conflict (user_id) do update set
    role = excluded.role,
    email = coalesce(public.admin_user_accounts.email, excluded.email),
    phone = coalesce(public.admin_user_accounts.phone, excluded.phone),
    name = coalesce(public.admin_user_accounts.name, excluded.name),
    city = coalesce(public.admin_user_accounts.city, excluded.city),
    auth_provider = excluded.auth_provider,
    raw_meta = excluded.raw_meta,
    personal_data_consent = excluded.personal_data_consent,
    personal_data_consent_date = coalesce(public.admin_user_accounts.personal_data_consent_date, excluded.personal_data_consent_date),
    user_agent = coalesce(excluded.user_agent, public.admin_user_accounts.user_agent),
    ip_address = coalesce(excluded.ip_address, public.admin_user_accounts.ip_address),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table if not exists public.admin_user_accounts (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role text not null check (role in ('worker', 'restaurant', 'supplier', 'admin')),
  email text,
  phone text,
  name text,
  city text,
  auth_provider text,
  status text not null default 'active',
  source text not null default 'auth_page',
  raw_meta jsonb not null default '{}'::jsonb,
  personal_data_consent boolean not null default false,
  personal_data_consent_date timestamptz,
  user_agent text,
  ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_user_accounts
  add column if not exists personal_data_consent boolean not null default false,
  add column if not exists personal_data_consent_date timestamptz,
  add column if not exists user_agent text,
  add column if not exists ip_address text;

alter table public.admin_user_accounts enable row level security;
grant select, insert, update on public.admin_user_accounts to authenticated;

drop policy if exists admin_user_accounts_select_admin_or_own on public.admin_user_accounts;
create policy admin_user_accounts_select_admin_or_own
on public.admin_user_accounts
for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists admin_user_accounts_insert_own on public.admin_user_accounts;
create policy admin_user_accounts_insert_own
on public.admin_user_accounts
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists admin_user_accounts_update_own_or_admin on public.admin_user_accounts;
create policy admin_user_accounts_update_own_or_admin
on public.admin_user_accounts
for update
to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

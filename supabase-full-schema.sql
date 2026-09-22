-- GastroConnect MVP v900 full schema.
-- Use this only if the Supabase project is empty or missing the core tables.
-- It does not change Supabase project keys.

create extension if not exists pgcrypto;

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

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

create table if not exists public.site_settings (
  setting_key text primary key,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.public_submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('worker', 'restaurant', 'supplier', 'callback', 'feedback', 'telegram_bot')),
  title text not null,
  phone text,
  telegram text,
  city text,
  email text,
  personal_data_consent boolean not null default false,
  personal_data_consent_date timestamptz,
  ip_address text,
  user_agent text,
  data jsonb not null default '{}'::jsonb,
  source text not null default 'site',
  status text not null default 'new' check (status in ('new', 'in_progress', 'done', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.worker_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  professions text[] not null default '{}',
  experience text,
  available_days text[] not null default '{}',
  available_time text,
  min_rate numeric,
  payment_type text,
  can_travel boolean not null default false,
  travel_cities text[] not null default '{}',
  travel_radius_km integer,
  about text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restaurant_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  business_name text not null default '',
  business_type text,
  contact_person text,
  phone text,
  email text,
  city text,
  address text,
  about text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supplier_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  company_name text not null default '',
  contact_person text,
  phone text,
  email text,
  city text,
  delivery_cities text[] not null default '{}',
  category text,
  about text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shift_posts (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  profession text not null,
  city text not null default '',
  district text,
  address text,
  date_from date,
  date_to date,
  time_from time,
  time_to time,
  rate numeric,
  payment_type text,
  travel_bonus boolean not null default false,
  travel_bonus_amount numeric,
  accepts_other_city boolean not null default false,
  requirements text,
  status text not null default 'open' check (status in ('open', 'closed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shift_applications (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references public.shift_posts(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  restaurant_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (shift_id, worker_id)
);

create table if not exists public.shift_invites (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references auth.users(id) on delete cascade,
  worker_id uuid not null references auth.users(id) on delete cascade,
  shift_id uuid references public.shift_posts(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supplier_offers (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category text not null,
  product_name text,
  price numeric,
  unit text,
  min_order text,
  delivery_cities text[] not null default '{}',
  description text,
  status text not null default 'active' check (status in ('active', 'paused', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supplier_inquiries (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.supplier_offers(id) on delete cascade,
  restaurant_id uuid not null references public.profiles(id) on delete cascade,
  supplier_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  status text not null default 'new' check (status in ('new', 'accepted', 'declined', 'cancelled', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (offer_id, restaurant_id)
);

create table if not exists public.supply_requests (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category text,
  quantity text,
  budget text,
  city text,
  message text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supplier_responses (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.supply_requests(id) on delete cascade,
  restaurant_id uuid not null references public.profiles(id) on delete cascade,
  supplier_id uuid not null references public.profiles(id) on delete cascade,
  category text,
  message text,
  status text not null default 'new' check (status in ('new', 'accepted', 'declined', 'cancelled', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_user_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('worker', 'restaurant', 'supplier', 'admin')),
  email text,
  phone text,
  name text,
  city text,
  auth_provider text,
  status text not null default 'active',
  source text not null default 'auth_signup',
  personal_data_consent boolean not null default false,
  personal_data_consent_date timestamptz,
  user_agent text,
  ip_address text,
  raw_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_user_accounts
  add column if not exists personal_data_consent boolean not null default false,
  add column if not exists personal_data_consent_date timestamptz,
  add column if not exists user_agent text,
  add column if not exists ip_address text;

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
    coalesce(new.raw_user_meta_data->>'name', new.email, new.phone, 'Пользователь'),
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
    personal_data_consent,
    personal_data_consent_date,
    user_agent,
    ip_address,
    raw_meta,
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
    coalesce((new.raw_user_meta_data->>'personalDataConsent')::boolean, false),
    nullif(new.raw_user_meta_data->>'personalDataConsentDate', '')::timestamptz,
    new.raw_user_meta_data->>'userAgent',
    new.raw_user_meta_data->>'ipAddress',
    coalesce(new.raw_user_meta_data, '{}'::jsonb),
    now()
  )
  on conflict (user_id) do update set
    role = excluded.role,
    email = coalesce(public.admin_user_accounts.email, excluded.email),
    phone = coalesce(public.admin_user_accounts.phone, excluded.phone),
    name = excluded.name,
    city = excluded.city,
    auth_provider = excluded.auth_provider,
    personal_data_consent = excluded.personal_data_consent,
    personal_data_consent_date = coalesce(public.admin_user_accounts.personal_data_consent_date, excluded.personal_data_consent_date),
    user_agent = coalesce(excluded.user_agent, public.admin_user_accounts.user_agent),
    ip_address = coalesce(excluded.ip_address, public.admin_user_accounts.ip_address),
    raw_meta = excluded.raw_meta,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon, authenticated;

alter table public.profiles enable row level security;
alter table public.worker_profiles enable row level security;
alter table public.restaurant_profiles enable row level security;
alter table public.supplier_profiles enable row level security;
alter table public.shift_posts enable row level security;
alter table public.shift_applications enable row level security;
alter table public.shift_invites enable row level security;
alter table public.supplier_offers enable row level security;
alter table public.supplier_inquiries enable row level security;
alter table public.supply_requests enable row level security;
alter table public.supplier_responses enable row level security;
alter table public.admin_user_accounts enable row level security;
alter table public.site_settings enable row level security;
alter table public.public_submissions enable row level security;

grant select, insert, update on all tables in schema public to authenticated;
grant select, insert, update on public.admin_user_accounts to authenticated;
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant insert on public.public_submissions to anon;
grant select, update, delete on public.public_submissions to authenticated;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
using (id = auth.uid() or status = 'active' or public.is_admin());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert to authenticated
with check (
  id = auth.uid()
  and role in ('worker', 'restaurant', 'supplier')
);

drop policy if exists profiles_update_own_or_admin on public.profiles;
create policy profiles_update_own_or_admin on public.profiles for update to authenticated
using (id = auth.uid() or public.is_admin())
with check (
  public.is_admin()
  or (
    id = auth.uid()
    and role in ('worker', 'restaurant', 'supplier')
  )
);

drop policy if exists worker_profiles_select_authenticated on public.worker_profiles;
drop policy if exists worker_profiles_select_by_role on public.worker_profiles;
create policy worker_profiles_select_by_role on public.worker_profiles for select to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'restaurant'
  )
);

drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read on public.site_settings for select to anon, authenticated using (true);

drop policy if exists site_settings_admin_write on public.site_settings;
drop policy if exists site_settings_admin_insert on public.site_settings;
create policy site_settings_admin_insert on public.site_settings for insert to authenticated
with check ((select public.is_admin()));

drop policy if exists site_settings_admin_update on public.site_settings;
create policy site_settings_admin_update on public.site_settings for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists site_settings_admin_delete on public.site_settings;
create policy site_settings_admin_delete on public.site_settings for delete to authenticated
using ((select public.is_admin()));

drop policy if exists public_submissions_insert_anon on public.public_submissions;
create policy public_submissions_insert_anon on public.public_submissions for insert to anon, authenticated
with check (type in ('worker', 'restaurant', 'supplier', 'callback', 'feedback', 'telegram_bot'));

drop policy if exists public_submissions_admin_read on public.public_submissions;
create policy public_submissions_admin_read on public.public_submissions for select to authenticated
using ((select public.is_admin()));

drop policy if exists public_submissions_admin_update on public.public_submissions;
create policy public_submissions_admin_update on public.public_submissions for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists public_submissions_admin_delete on public.public_submissions;
create policy public_submissions_admin_delete on public.public_submissions for delete to authenticated
using ((select public.is_admin()));

drop policy if exists admin_user_accounts_select_admin_or_own on public.admin_user_accounts;
create policy admin_user_accounts_select_admin_or_own on public.admin_user_accounts for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists admin_user_accounts_insert_own on public.admin_user_accounts;
create policy admin_user_accounts_insert_own on public.admin_user_accounts for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists admin_user_accounts_update_own_or_admin on public.admin_user_accounts;
create policy admin_user_accounts_update_own_or_admin on public.admin_user_accounts for update to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists worker_profiles_insert_own_or_admin on public.worker_profiles;
create policy worker_profiles_insert_own_or_admin on public.worker_profiles for insert to authenticated
with check (
  public.is_admin()
  or (
    user_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'worker')
  )
);

drop policy if exists worker_profiles_update_own_or_admin on public.worker_profiles;
create policy worker_profiles_update_own_or_admin on public.worker_profiles for update to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (
  public.is_admin()
  or (
    user_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'worker')
  )
);

drop policy if exists restaurant_profiles_all_own on public.restaurant_profiles;
create policy restaurant_profiles_all_own on public.restaurant_profiles for all to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (
  public.is_admin()
  or (
    user_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'restaurant')
  )
);

drop policy if exists supplier_profiles_select_authenticated on public.supplier_profiles;

drop policy if exists supplier_profiles_all_own on public.supplier_profiles;
create policy supplier_profiles_all_own on public.supplier_profiles for all to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (
  public.is_admin()
  or (
    user_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'supplier')
  )
);

drop policy if exists shift_posts_select_authenticated on public.shift_posts;
drop policy if exists shift_posts_select_by_role on public.shift_posts;
create policy shift_posts_select_by_role on public.shift_posts for select to authenticated
using (
  restaurant_id = auth.uid()
  or public.is_admin()
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'worker'
      and shift_posts.status = 'open'
  )
);

drop policy if exists shift_posts_insert_restaurant_or_admin on public.shift_posts;
create policy shift_posts_insert_restaurant_or_admin on public.shift_posts for insert to authenticated
with check (
  public.is_admin()
  or (
    restaurant_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'restaurant')
  )
);

drop policy if exists shift_posts_update_restaurant_or_admin on public.shift_posts;
create policy shift_posts_update_restaurant_or_admin on public.shift_posts for update to authenticated
using (restaurant_id = auth.uid() or public.is_admin())
with check (
  public.is_admin()
  or (
    restaurant_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'restaurant')
  )
);

drop policy if exists shift_applications_select_related on public.shift_applications;
create policy shift_applications_select_related on public.shift_applications for select to authenticated
using (worker_id = auth.uid() or restaurant_id = auth.uid() or public.is_admin());

drop policy if exists shift_applications_insert_worker on public.shift_applications;
create policy shift_applications_insert_worker on public.shift_applications for insert to authenticated
with check (
  worker_id = auth.uid()
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'worker')
);

drop policy if exists shift_applications_update_related on public.shift_applications;
drop policy if exists shift_applications_update_restaurant_or_admin on public.shift_applications;
create policy shift_applications_update_related on public.shift_applications for update to authenticated
using (worker_id = auth.uid() or restaurant_id = auth.uid() or public.is_admin())
with check (worker_id = auth.uid() or restaurant_id = auth.uid() or public.is_admin());

drop policy if exists shift_invites_select_own on public.shift_invites;
create policy shift_invites_select_own on public.shift_invites for select to authenticated
using (restaurant_id = auth.uid() or worker_id = auth.uid() or public.is_admin());

drop policy if exists shift_invites_insert_own_restaurant on public.shift_invites;
drop policy if exists shift_invites_insert_restaurant on public.shift_invites;
create policy shift_invites_insert_own_restaurant on public.shift_invites for insert to authenticated
with check (
  (
    restaurant_id = auth.uid()
    and (
      shift_id is null
      or exists (
        select 1
        from public.shift_posts
        where shift_posts.id = shift_invites.shift_id
          and shift_posts.restaurant_id = auth.uid()
      )
    )
  )
  or public.is_admin()
);

drop policy if exists shift_invites_update_own on public.shift_invites;
drop policy if exists shift_invites_update_worker on public.shift_invites;
create policy shift_invites_update_own on public.shift_invites for update to authenticated
using (restaurant_id = auth.uid() or worker_id = auth.uid() or public.is_admin())
with check (restaurant_id = auth.uid() or worker_id = auth.uid() or public.is_admin());

drop policy if exists supplier_offers_select_authenticated on public.supplier_offers;
drop policy if exists supplier_offers_select_by_role on public.supplier_offers;
create policy supplier_offers_select_by_role on public.supplier_offers for select to authenticated
using (
  supplier_id = auth.uid()
  or public.is_admin()
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'restaurant'
      and supplier_offers.status = 'active'
  )
);

drop policy if exists supplier_offers_insert_supplier_or_admin on public.supplier_offers;
create policy supplier_offers_insert_supplier_or_admin on public.supplier_offers for insert to authenticated
with check (
  public.is_admin()
  or (
    supplier_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'supplier')
  )
);

drop policy if exists supplier_offers_update_supplier_or_admin on public.supplier_offers;
create policy supplier_offers_update_supplier_or_admin on public.supplier_offers for update to authenticated
using (supplier_id = auth.uid() or public.is_admin())
with check (
  public.is_admin()
  or (
    supplier_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'supplier')
  )
);

drop policy if exists supplier_inquiries_select_related on public.supplier_inquiries;
create policy supplier_inquiries_select_related on public.supplier_inquiries for select to authenticated
using (restaurant_id = auth.uid() or supplier_id = auth.uid() or public.is_admin());

drop policy if exists supplier_inquiries_insert_restaurant on public.supplier_inquiries;
create policy supplier_inquiries_insert_restaurant on public.supplier_inquiries for insert to authenticated
with check (
  public.is_admin()
  or (
    restaurant_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'restaurant')
    and exists (
      select 1
      from public.supplier_offers offer
      where offer.id = supplier_inquiries.offer_id
        and offer.supplier_id = supplier_inquiries.supplier_id
        and offer.status = 'active'
    )
  )
);

drop policy if exists supplier_inquiries_update_supplier_or_admin on public.supplier_inquiries;
create policy supplier_inquiries_update_supplier_or_admin on public.supplier_inquiries for update to authenticated
using (supplier_id = auth.uid() or public.is_admin())
with check (supplier_id = auth.uid() or public.is_admin());

drop policy if exists supply_requests_select_authenticated on public.supply_requests;
drop policy if exists "authenticated can read supply requests" on public.supply_requests;
drop policy if exists "suppliers and owners can read supply requests" on public.supply_requests;
drop policy if exists supply_requests_select_by_role on public.supply_requests;
create policy supply_requests_select_by_role on public.supply_requests for select to authenticated
using (
  restaurant_id = auth.uid()
  or public.is_admin()
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'supplier'
      and supply_requests.status = 'open'
  )
);

drop policy if exists supply_requests_insert_restaurant on public.supply_requests;
drop policy if exists "restaurants can create supply requests" on public.supply_requests;
create policy supply_requests_insert_restaurant on public.supply_requests for insert to authenticated
with check (
  public.is_admin()
  or (
    restaurant_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'restaurant')
  )
);

drop policy if exists supply_requests_update_restaurant on public.supply_requests;
drop policy if exists "restaurants can update own supply requests" on public.supply_requests;
create policy supply_requests_update_restaurant on public.supply_requests for update to authenticated
using (restaurant_id = auth.uid() or public.is_admin())
with check (
  public.is_admin()
  or (
    restaurant_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'restaurant')
  )
);

drop policy if exists supplier_responses_select_related on public.supplier_responses;
drop policy if exists "supplier responses related users can read" on public.supplier_responses;
create policy supplier_responses_select_related on public.supplier_responses for select to authenticated
using (restaurant_id = auth.uid() or supplier_id = auth.uid() or public.is_admin());

drop policy if exists supplier_responses_insert_supplier on public.supplier_responses;
drop policy if exists "suppliers can create supplier responses" on public.supplier_responses;
create policy supplier_responses_insert_supplier on public.supplier_responses for insert to authenticated
with check (
  public.is_admin()
  or (
    supplier_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'supplier')
    and exists (
      select 1
      from public.supply_requests request
      where request.id = supplier_responses.request_id
        and request.restaurant_id = supplier_responses.restaurant_id
        and request.status = 'open'
    )
  )
);

drop policy if exists supplier_responses_update_related on public.supplier_responses;
drop policy if exists "restaurants can update supplier responses" on public.supplier_responses;
create policy supplier_responses_update_related on public.supplier_responses for update to authenticated
using (restaurant_id = auth.uid() or supplier_id = auth.uid() or public.is_admin())
with check (restaurant_id = auth.uid() or supplier_id = auth.uid() or public.is_admin());

create index if not exists shift_posts_status_idx on public.shift_posts(status);
create index if not exists shift_posts_restaurant_id_idx on public.shift_posts(restaurant_id);
create index if not exists shift_posts_city_idx on public.shift_posts(city);
create index if not exists shift_posts_profession_idx on public.shift_posts(profession);
create index if not exists shift_applications_restaurant_id_idx on public.shift_applications(restaurant_id);
create index if not exists shift_applications_worker_id_idx on public.shift_applications(worker_id);
create index if not exists shift_invites_worker_id_idx on public.shift_invites(worker_id);
create index if not exists shift_invites_shift_id_idx on public.shift_invites(shift_id);
drop index if exists public.shift_invites_pending_unique_idx;
create unique index if not exists shift_invites_pending_shift_unique_idx on public.shift_invites(restaurant_id, worker_id, shift_id) where status = 'pending' and shift_id is not null;
create unique index if not exists shift_invites_pending_general_unique_idx on public.shift_invites(restaurant_id, worker_id) where status = 'pending' and shift_id is null;
create index if not exists supplier_offers_supplier_id_idx on public.supplier_offers(supplier_id);
create index if not exists supplier_offers_category_idx on public.supplier_offers(category);
create index if not exists supplier_inquiries_supplier_id_idx on public.supplier_inquiries(supplier_id);
create index if not exists supply_requests_status_idx on public.supply_requests(status);
create index if not exists supplier_responses_request_id_idx on public.supplier_responses(request_id);
create index if not exists supplier_responses_restaurant_id_idx on public.supplier_responses(restaurant_id);
create index if not exists supplier_responses_supplier_id_idx on public.supplier_responses(supplier_id);
create index if not exists supplier_responses_status_idx on public.supplier_responses(status);
create unique index if not exists supplier_responses_request_supplier_unique_idx on public.supplier_responses(request_id, supplier_id);
create index if not exists public_submissions_type_idx on public.public_submissions(type);
create index if not exists public_submissions_status_idx on public.public_submissions(status);
create index if not exists public_submissions_created_at_idx on public.public_submissions(created_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets',
  'site-assets',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists site_assets_public_read on storage.objects;

drop policy if exists site_assets_admin_insert on storage.objects;
create policy site_assets_admin_insert on storage.objects for insert to authenticated
with check (bucket_id = 'site-assets' and public.is_admin());

drop policy if exists site_assets_admin_update on storage.objects;
create policy site_assets_admin_update on storage.objects for update to authenticated
using (bucket_id = 'site-assets' and public.is_admin())
with check (bucket_id = 'site-assets' and public.is_admin());

drop policy if exists site_assets_admin_delete on storage.objects;
create policy site_assets_admin_delete on storage.objects for delete to authenticated
using (bucket_id = 'site-assets' and public.is_admin());



alter table public.public_submissions
  add column if not exists email text,
  add column if not exists personal_data_consent boolean not null default false,
  add column if not exists personal_data_consent_date timestamptz,
  add column if not exists ip_address text,
  add column if not exists user_agent text;

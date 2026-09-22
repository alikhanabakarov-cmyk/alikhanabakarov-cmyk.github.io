-- GastroConnect marketplace support.
-- Run in Supabase SQL Editor after review. It does not change Supabase keys or auth settings.
-- Existing tables profiles, worker_profiles, shift_posts, shift_applications,
-- shift_invites, supplier_offers and supplier_inquiries are reused.

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
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.supply_requests enable row level security;
alter table public.supplier_responses enable row level security;
grant select, insert, update on public.supply_requests to authenticated;
grant select, insert, update on public.supplier_responses to authenticated;

drop policy if exists "restaurants can create supply requests" on public.supply_requests;
create policy "restaurants can create supply requests"
on public.supply_requests
for insert
to authenticated
with check (restaurant_id = auth.uid());

drop policy if exists "restaurants can update own supply requests" on public.supply_requests;
create policy "restaurants can update own supply requests"
on public.supply_requests
for update
to authenticated
using (restaurant_id = auth.uid())
with check (restaurant_id = auth.uid());

drop policy if exists "authenticated can read supply requests" on public.supply_requests;
drop policy if exists "suppliers and owners can read supply requests" on public.supply_requests;
create policy "suppliers and owners can read supply requests"
on public.supply_requests
for select
to authenticated
using (
  restaurant_id = auth.uid()
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('supplier', 'admin')
      and supply_requests.status = 'open'
  )
);

drop policy if exists "supplier responses related users can read" on public.supplier_responses;
create policy "supplier responses related users can read"
on public.supplier_responses
for select
to authenticated
using (restaurant_id = auth.uid() or supplier_id = auth.uid());

drop policy if exists "suppliers can create supplier responses" on public.supplier_responses;
create policy "suppliers can create supplier responses"
on public.supplier_responses
for insert
to authenticated
with check (supplier_id = auth.uid());

drop policy if exists "restaurants can update supplier responses" on public.supplier_responses;
create policy "restaurants can update supplier responses"
on public.supplier_responses
for update
to authenticated
using (restaurant_id = auth.uid())
with check (restaurant_id = auth.uid());

create index if not exists supply_requests_restaurant_id_idx on public.supply_requests(restaurant_id);
create index if not exists supply_requests_status_idx on public.supply_requests(status);
create index if not exists supply_requests_city_idx on public.supply_requests(city);
create index if not exists supplier_responses_request_id_idx on public.supplier_responses(request_id);
create index if not exists supplier_responses_restaurant_id_idx on public.supplier_responses(restaurant_id);
create index if not exists supplier_responses_supplier_id_idx on public.supplier_responses(supplier_id);
create index if not exists supplier_responses_status_idx on public.supplier_responses(status);

create extension if not exists pgcrypto;

create table if not exists public.kpr_simulations (
  id bigserial primary key,
  mode text not null default 'A' check (mode in ('A', 'B')),
  interval integer not null default 12 check (interval in (1, 6, 12)),
  extra_annual numeric not null default 0,
  params jsonb not null,
  saved_at timestamptz not null default now()
);

create index if not exists idx_kpr_simulations_saved_at
  on public.kpr_simulations (saved_at desc);

alter table public.kpr_simulations enable row level security;

create policy "Allow anonymous insert for app data"
  on public.kpr_simulations
  for insert
  with check (true);

create policy "Allow anonymous select recent history"
  on public.kpr_simulations
  for select
  using (true);

create policy "Allow anonymous update for own rows"
  on public.kpr_simulations
  for update
  using (true)
  with check (true);

create policy "Allow anonymous delete for own rows"
  on public.kpr_simulations
  for delete
  using (true);

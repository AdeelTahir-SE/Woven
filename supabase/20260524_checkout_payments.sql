create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('WV-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  customer_name text not null,
  email text not null,
  phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  subtotal_pkr integer not null check (subtotal_pkr >= 0),
  shipping_pkr integer not null default 0 check (shipping_pkr >= 0),
  total_pkr integer not null check (total_pkr >= 0),
  status text not null default 'pending_payment' check (status in ('pending_payment', 'paid', 'pay_on_delivery', 'cancelled', 'fulfilled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  size text not null,
  quantity integer not null check (quantity > 0),
  unit_price_pkr integer not null check (unit_price_pkr >= 0),
  line_total_pkr integer not null check (line_total_pkr >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null check (provider in ('cod', 'bank_transfer', 'card')),
  status text not null default 'pending' check (status in ('pending', 'pay_on_delivery', 'authorized', 'paid', 'failed', 'refunded')),
  amount_pkr integer not null check (amount_pkr >= 0),
  provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists payments_order_id_idx on public.payments(order_id);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders"
on public.orders
for insert
with check (true);

drop policy if exists "Public can create order items" on public.order_items;
create policy "Public can create order items"
on public.order_items
for insert
with check (true);

drop policy if exists "Public can create payments" on public.payments;
create policy "Public can create payments"
on public.payments
for insert
with check (true);

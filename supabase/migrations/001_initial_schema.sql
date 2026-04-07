-- ============================================================
-- 001 Initial Schema
-- Core tables: profiles, categories, products, orders,
-- order_items, subscriptions, wishlists, addresses, coa, discounts
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ===== Helper function =====
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ===== Profiles =====
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Admins can view all profiles"
  on profiles for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admins can manage all profiles"
  on profiles for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- ===== Categories =====
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table categories enable row level security;

create policy "Public can view categories"
  on categories for select using (true);

create policy "Admins can manage categories"
  on categories for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create trigger categories_updated_at
  before update on categories
  for each row execute function update_updated_at();

-- ===== Products =====
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  category_id uuid references categories(id) on delete set null,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  images text[] default '{}',
  stock_quantity integer default 100,
  low_stock_threshold integer default 10,
  active boolean default true,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index products_category_idx on products(category_id);
create index products_slug_idx on products(slug);
create index products_active_idx on products(active);

alter table products enable row level security;

create policy "Public can view active products"
  on products for select using (active = true);

create policy "Admins can manage products"
  on products for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- ===== Orders =====
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending',
  subtotal numeric(10,2) not null default 0,
  shipping_cost numeric(10,2) default 0,
  tax numeric(10,2) default 0,
  total numeric(10,2) not null default 0,
  discount_amount numeric(10,2) default 0,
  discount_code text,
  shipping_name text,
  shipping_email text,
  shipping_phone text,
  shipping_address jsonb,
  billing_address jsonb,
  stripe_payment_intent_id text,
  tracking_number text,
  tracking_url text,
  shipping_carrier text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index orders_user_idx on orders(user_id);
create index orders_status_idx on orders(status);
create index orders_created_idx on orders(created_at desc);

alter table orders enable row level security;

create policy "Users can view own orders"
  on orders for select using (auth.uid() = user_id);

create policy "Admins can manage all orders"
  on orders for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- ===== Order Items =====
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  product_image text,
  quantity integer not null default 1,
  price numeric(10,2) not null,
  created_at timestamptz default now()
);

create index order_items_order_idx on order_items(order_id);

alter table order_items enable row level security;

create policy "Users can view own order items"
  on order_items for select
  using (exists (
    select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()
  ));

create policy "Admins can manage order items"
  on order_items for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ===== Subscriptions =====
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_subscription_id text,
  status text not null default 'active',
  interval text default 'month',
  price numeric(10,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index subscriptions_user_idx on subscriptions(user_id);
create index subscriptions_status_idx on subscriptions(status);

alter table subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on subscriptions for select using (auth.uid() = user_id);

create policy "Admins can manage subscriptions"
  on subscriptions for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute function update_updated_at();

-- ===== Wishlists =====
create table wishlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table wishlists enable row level security;

create policy "Users can manage own wishlist"
  on wishlists for all using (auth.uid() = user_id);

-- ===== Addresses =====
create table addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text default 'Home',
  name text,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  zip text not null,
  country text default 'US',
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table addresses enable row level security;

create policy "Users can manage own addresses"
  on addresses for all using (auth.uid() = user_id);

-- ===== COA (Certificates of Analysis) =====
create table coa (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  batch_number text not null,
  file_url text not null,
  test_date date,
  created_at timestamptz default now()
);

alter table coa enable row level security;

create policy "Public can view COA"
  on coa for select using (true);

create policy "Admins can manage COA"
  on coa for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ===== Discounts =====
create table discounts (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  type text not null check (type in ('percentage', 'fixed')),
  value numeric(10,2) not null,
  min_order numeric(10,2) default 0,
  max_uses integer,
  used_count integer default 0,
  active boolean default true,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now()
);

alter table discounts enable row level security;

create policy "Public can view active discounts"
  on discounts for select using (active = true);

create policy "Admins can manage discounts"
  on discounts for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ===== Abandoned Carts =====
create table abandoned_carts (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  cart_items jsonb not null default '[]',
  recovered boolean default false,
  reminder_sent boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table abandoned_carts enable row level security;

create policy "Admins can manage abandoned carts"
  on abandoned_carts for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ===== Stock decrement function =====
create or replace function decrement_stock(p_product_id uuid, p_quantity int)
returns void as $$
  update products
  set stock_quantity = greatest(stock_quantity - p_quantity, 0)
  where id = p_product_id;
$$ language sql security definer;

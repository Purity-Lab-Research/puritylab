-- Saved payment methods (processor-agnostic, stores card display info only)
create table saved_payment_methods (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text default 'Card',
  brand text not null,
  last4 text not null,
  exp_month int not null,
  exp_year int not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

alter table saved_payment_methods enable row level security;

create policy "Users can manage own payment methods"
  on saved_payment_methods for all using (auth.uid() = user_id);

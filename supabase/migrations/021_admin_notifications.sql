-- Admin notifications table for persistent notification system
create table if not exists admin_notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in (
    'new_order', 'needs_shipping', 'order_cancelled',
    'new_review', 'low_stock', 'out_of_stock',
    'new_affiliate_app', 'new_customer',
    'inbox_message', 'email_bounce',
    'back_in_stock_request', 'subscription_cancelled',
    'info'
  )),
  title text not null,
  description text,
  href text,
  is_read boolean not null default false,
  dismissed boolean not null default false,
  entity_type text,  -- 'order', 'review', 'affiliate_application', 'product', 'profile', etc.
  entity_id text,    -- id of the related entity for dedup
  created_at timestamptz not null default now()
);

-- Fast fetch of unread/active notifications
create index if not exists idx_admin_notif_active
  on admin_notifications (created_at desc)
  where not dismissed;

create index if not exists idx_admin_notif_unread
  on admin_notifications (is_read, created_at desc)
  where not dismissed and not is_read;

-- Dedup index: prevent duplicate notifications for the same entity
create unique index if not exists idx_admin_notif_entity_unique
  on admin_notifications (type, entity_type, entity_id)
  where entity_id is not null;

-- RLS: only service-role / admin access
alter table admin_notifications enable row level security;

drop policy if exists "Service role full access to admin_notifications" on admin_notifications;
create policy "Service role full access to admin_notifications"
  on admin_notifications for all
  using (true)
  with check (true);

-- Auto-cleanup: delete dismissed notifications older than 30 days
-- (run via cron or manual cleanup)

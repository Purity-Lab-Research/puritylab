-- ===== Email Events & Unsubscribe Tracking =====
-- Tracks all Resend webhook events (delivered, bounced, complained, etc.)
-- and manages email opt-out status for compliance.

-- Email event log — every send, delivery, bounce, complaint
create table if not exists email_events (
  id uuid primary key default uuid_generate_v4(),
  email_id text,               -- Resend email ID
  event_type text not null,    -- sent, delivered, bounced, complained, opened, clicked, delivery_delayed
  recipient_email text not null,
  subject text,
  from_address text,
  bounce_type text,            -- hard, soft (for bounces)
  bounce_description text,
  complaint_type text,         -- abuse, auth-failure, fraud, etc.
  metadata jsonb default '{}', -- raw event payload for debugging
  created_at timestamptz default now()
);

create index if not exists idx_email_events_recipient on email_events(recipient_email, created_at desc);
create index if not exists idx_email_events_type on email_events(event_type, created_at desc);
create index if not exists idx_email_events_email_id on email_events(email_id);

-- Suppression list — emails that should not receive marketing/transactional mail
create table if not exists email_suppressions (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  reason text not null check (reason in ('bounce_hard', 'complaint', 'manual_unsubscribe')),
  source text,                 -- webhook, admin, user_request
  created_at timestamptz default now()
);

create index if not exists idx_email_suppressions_email on email_suppressions(email);

-- Add marketing opt-out column to profiles
alter table profiles add column if not exists email_unsubscribed boolean default false;

-- RLS: admin-only for both tables
alter table email_events enable row level security;
alter table email_suppressions enable row level security;

drop policy if exists "Admins can manage email events" on email_events;
create policy "Admins can manage email events"
  on email_events for all
  using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

drop policy if exists "Admins can manage email suppressions" on email_suppressions;
create policy "Admins can manage email suppressions"
  on email_suppressions for all
  using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

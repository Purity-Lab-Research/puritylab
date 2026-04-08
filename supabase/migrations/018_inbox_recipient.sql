-- Add recipient_email to inbox_messages for outbound email tracking
alter table inbox_messages add column if not exists recipient_email text;

-- Backfill: for outbound replies, the recipient is the thread's original sender
-- (This is best-effort; new emails will always have recipient_email set)

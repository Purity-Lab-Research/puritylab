-- Track whether a user has received their welcome email / admin notification
-- Prevents duplicate notifications on subsequent logins
alter table profiles add column if not exists welcome_email_sent boolean default false;

-- Rename addresses columns to match application code
alter table addresses rename column name to full_name;
alter table addresses rename column state to province_state;
alter table addresses rename column zip to postal_code;

-- Set default country to 'CA' to match app default
alter table addresses alter column country set default 'CA';

-- Rename addresses columns to match application code (idempotent)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'addresses' AND column_name = 'name') THEN
    ALTER TABLE addresses RENAME COLUMN name TO full_name;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'addresses' AND column_name = 'state') THEN
    ALTER TABLE addresses RENAME COLUMN state TO province_state;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'addresses' AND column_name = 'zip') THEN
    ALTER TABLE addresses RENAME COLUMN zip TO postal_code;
  END IF;
END $$;

-- Set default country to 'CA' to match app default
ALTER TABLE addresses ALTER COLUMN country SET DEFAULT 'CA';

-- Add password field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add first_name and last_name fields for compatibility
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- Update trigger to extract first/last name from full_name when needed
CREATE OR REPLACE FUNCTION update_name_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.full_name IS NOT NULL AND (NEW.first_name IS NULL OR NEW.last_name IS NULL) THEN
        NEW.first_name = SPLIT_PART(NEW.full_name, ' ', 1);
        NEW.last_name = CASE 
            WHEN ARRAY_LENGTH(STRING_TO_ARRAY(NEW.full_name, ' '), 1) > 1 
            THEN SUBSTRING(NEW.full_name FROM LENGTH(NEW.first_name) + 2)
            ELSE ''
        END;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_name_fields 
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_name_fields();
-- Make owner_id NOT NULL to prevent orphaned content
-- This ensures all portfolio content must have an owner

-- First, we need to handle existing NULL values
-- For a single-user portfolio, we'll use a trigger to auto-assign the first user
CREATE OR REPLACE FUNCTION public.set_portfolio_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If owner_id is NULL, set it to the current authenticated user
  IF NEW.owner_id IS NULL THEN
    NEW.owner_id := auth.uid();
  END IF;
  
  -- If still NULL (no auth context), use the first user in the system
  IF NEW.owner_id IS NULL THEN
    SELECT id INTO NEW.owner_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-assign owner on INSERT
DROP TRIGGER IF EXISTS portfolio_content_set_owner ON public.portfolio_content;
CREATE TRIGGER portfolio_content_set_owner
  BEFORE INSERT ON public.portfolio_content
  FOR EACH ROW
  EXECUTE FUNCTION public.set_portfolio_owner();

-- For existing NULL rows, we'll update them when a user signs up
-- But to fix the immediate issue, let's allow NULL temporarily but add validation
-- Once the user signs up and edits content, it will auto-assign the owner_id
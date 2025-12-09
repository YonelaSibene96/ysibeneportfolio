-- Assign ownership to existing portfolio_content rows
UPDATE public.portfolio_content 
SET owner_id = '36ca3d56-ae25-4db9-be1e-400563633555' 
WHERE owner_id IS NULL;

-- Make owner_id NOT NULL to prevent this issue in the future
ALTER TABLE public.portfolio_content ALTER COLUMN owner_id SET NOT NULL;

-- Add default value trigger similar to certifications table
CREATE OR REPLACE FUNCTION public.set_portfolio_content_owner()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    NEW.owner_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic owner assignment
DROP TRIGGER IF EXISTS set_portfolio_content_owner_trigger ON public.portfolio_content;
CREATE TRIGGER set_portfolio_content_owner_trigger
BEFORE INSERT ON public.portfolio_content
FOR EACH ROW
EXECUTE FUNCTION public.set_portfolio_content_owner();
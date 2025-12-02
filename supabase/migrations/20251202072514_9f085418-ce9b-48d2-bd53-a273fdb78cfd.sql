-- Add owner_id column to portfolio_content to support owner-based RLS
ALTER TABLE public.portfolio_content
  ADD COLUMN IF NOT EXISTS owner_id uuid;

-- Ensure each content_key is unique so other users cannot create conflicting rows
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_class c
    JOIN   pg_namespace n ON n.oid = c.relnamespace
    WHERE  c.relname = 'portfolio_content_content_key_key'
    AND    n.nspname = 'public'
  ) THEN
    CREATE UNIQUE INDEX portfolio_content_content_key_key
      ON public.portfolio_content (content_key);
  END IF;
END $$;

-- Replace existing policies with owner-based policies
DROP POLICY IF EXISTS "Public can view portfolio content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Authenticated users can insert portfolio content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Authenticated users can update portfolio content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio content" ON public.portfolio_content;

-- Public can read portfolio content
CREATE POLICY "Public can view portfolio content"
ON public.portfolio_content
FOR SELECT
TO public
USING (true);

-- Only the portfolio owner (based on owner_id) can insert/update/delete
CREATE POLICY "Portfolio owner can insert content"
ON public.portfolio_content
FOR INSERT
TO authenticated
WITH CHECK (owner_id IS NULL OR owner_id = auth.uid());

CREATE POLICY "Portfolio owner can update content"
ON public.portfolio_content
FOR UPDATE
TO authenticated
USING (owner_id IS NULL OR owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Portfolio owner can delete content"
ON public.portfolio_content
FOR DELETE
TO authenticated
USING (owner_id IS NULL OR owner_id = auth.uid());

-- Fix linter warning: set a fixed search_path for the trigger function
CREATE OR REPLACE FUNCTION public.update_portfolio_content_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
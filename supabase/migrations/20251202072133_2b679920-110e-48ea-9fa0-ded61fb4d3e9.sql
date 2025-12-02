-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can delete portfolio content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Anyone can insert portfolio content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Anyone can update portfolio content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Anyone can view portfolio content" ON public.portfolio_content;

-- Create secure policies
-- Allow public read access so visitors can view the portfolio
CREATE POLICY "Public can view portfolio content"
ON public.portfolio_content
FOR SELECT
TO public
USING (true);

-- Only authenticated users can insert content
CREATE POLICY "Authenticated users can insert portfolio content"
ON public.portfolio_content
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only authenticated users can update content
CREATE POLICY "Authenticated users can update portfolio content"
ON public.portfolio_content
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Only authenticated users can delete content
CREATE POLICY "Authenticated users can delete portfolio content"
ON public.portfolio_content
FOR DELETE
TO authenticated
USING (true);
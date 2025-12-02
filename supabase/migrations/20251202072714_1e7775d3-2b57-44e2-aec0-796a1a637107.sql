-- Drop policies with owner_id IS NULL conditions that allow unauthorized access
DROP POLICY IF EXISTS "Portfolio owner can insert content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Portfolio owner can update content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Portfolio owner can delete content" ON public.portfolio_content;

-- Create strict owner-only write policies
-- Only the portfolio owner can insert content (owner_id must match auth.uid())
CREATE POLICY "Portfolio owner can insert content"
ON public.portfolio_content
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

-- Only the portfolio owner can update their content
CREATE POLICY "Portfolio owner can update content"
ON public.portfolio_content
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Only the portfolio owner can delete their content
CREATE POLICY "Portfolio owner can delete content"
ON public.portfolio_content
FOR DELETE
TO authenticated
USING (owner_id = auth.uid());
-- Ensure documents bucket has proper RLS policies
DROP POLICY IF EXISTS "Anyone can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete documents" ON storage.objects;

-- Create comprehensive policies for documents bucket
CREATE POLICY "Public can view documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "Public can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Public can update documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'documents');

CREATE POLICY "Public can delete documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents');

-- Create similar policies for contact-images bucket
DROP POLICY IF EXISTS "Anyone can view contact images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload contact images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update contact images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete contact images" ON storage.objects;

CREATE POLICY "Public can view contact images"
ON storage.objects FOR SELECT
USING (bucket_id = 'contact-images');

CREATE POLICY "Public can upload contact images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'contact-images');

CREATE POLICY "Public can update contact images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'contact-images');

CREATE POLICY "Public can delete contact images"
ON storage.objects FOR DELETE
USING (bucket_id = 'contact-images');

-- Create portfolio_content table for permanent storage of all editable content
CREATE TABLE IF NOT EXISTS public.portfolio_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key TEXT UNIQUE NOT NULL,
  content_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on portfolio_content
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access to portfolio content
CREATE POLICY "Anyone can view portfolio content"
ON public.portfolio_content FOR SELECT
USING (true);

-- Allow public write access to portfolio content
CREATE POLICY "Anyone can insert portfolio content"
ON public.portfolio_content FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update portfolio content"
ON public.portfolio_content FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete portfolio content"
ON public.portfolio_content FOR DELETE
USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_portfolio_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_portfolio_content_timestamp
BEFORE UPDATE ON public.portfolio_content
FOR EACH ROW
EXECUTE FUNCTION public.update_portfolio_content_updated_at();
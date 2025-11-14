-- Create storage buckets for portfolio files
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('profile-images', 'profile-images', true),
  ('contact-images', 'contact-images', true),
  ('documents', 'documents', true);

-- Create storage policies for profile images
CREATE POLICY "Anyone can view profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Anyone can upload profile images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Anyone can update profile images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-images');

CREATE POLICY "Anyone can delete profile images"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-images');

-- Create storage policies for contact images
CREATE POLICY "Anyone can view contact images"
ON storage.objects FOR SELECT
USING (bucket_id = 'contact-images');

CREATE POLICY "Anyone can upload contact images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'contact-images');

CREATE POLICY "Anyone can update contact images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'contact-images');

CREATE POLICY "Anyone can delete contact images"
ON storage.objects FOR DELETE
USING (bucket_id = 'contact-images');

-- Create storage policies for documents
CREATE POLICY "Anyone can view documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "Anyone can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Anyone can update documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'documents');

CREATE POLICY "Anyone can delete documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents');
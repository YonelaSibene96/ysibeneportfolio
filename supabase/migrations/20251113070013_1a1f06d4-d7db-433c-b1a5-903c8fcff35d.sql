-- Create storage buckets for portfolio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('profile-images', 'profile-images', true, 5242880, ARRAY['image/*']),
  ('documents', 'documents', true, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*']),
  ('contact-images', 'contact-images', true, 5242880, ARRAY['image/*']);

-- Allow public read access to all files
CREATE POLICY "Public read access for profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Public read access for documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "Public read access for contact images"
ON storage.objects FOR SELECT
USING (bucket_id = 'contact-images');

-- Allow public upload access (can be restricted later with authentication)
CREATE POLICY "Public upload access for profile images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Public upload access for documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Public upload access for contact images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'contact-images');

-- Allow public update access
CREATE POLICY "Public update access for profile images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-images');

CREATE POLICY "Public update access for documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'documents');

CREATE POLICY "Public update access for contact images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'contact-images');

-- Allow public delete access
CREATE POLICY "Public delete access for profile images"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-images');

CREATE POLICY "Public delete access for documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents');

CREATE POLICY "Public delete access for contact images"
ON storage.objects FOR DELETE
USING (bucket_id = 'contact-images');
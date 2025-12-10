-- Drop all existing permissive storage policies
DROP POLICY IF EXISTS "Anyone can view profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete profile images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can view contact images" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload contact images" ON storage.objects;
DROP POLICY IF EXISTS "Public can update contact images" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete contact images" ON storage.objects;

-- Create secure policies: Public can VIEW, only owner can modify

-- Profile images - public view, owner-only modifications
CREATE POLICY "Public can view profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Owner can upload profile images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

CREATE POLICY "Owner can update profile images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-images' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

CREATE POLICY "Owner can delete profile images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-images' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

-- Documents - public view, owner-only modifications
CREATE POLICY "Public can view documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "Owner can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

CREATE POLICY "Owner can update documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

CREATE POLICY "Owner can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

-- Contact images - public view, owner-only modifications
CREATE POLICY "Public can view contact images"
ON storage.objects FOR SELECT
USING (bucket_id = 'contact-images');

CREATE POLICY "Owner can upload contact images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'contact-images' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

CREATE POLICY "Owner can update contact images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'contact-images' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

CREATE POLICY "Owner can delete contact images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'contact-images' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);
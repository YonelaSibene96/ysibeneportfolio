
-- Drop existing owner policies first
DROP POLICY IF EXISTS "Owner can upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Owner can update profile images" ON storage.objects;
DROP POLICY IF EXISTS "Owner can delete profile images" ON storage.objects;
DROP POLICY IF EXISTS "Owner can upload contact images" ON storage.objects;
DROP POLICY IF EXISTS "Owner can update contact images" ON storage.objects;
DROP POLICY IF EXISTS "Owner can delete contact images" ON storage.objects;
DROP POLICY IF EXISTS "Owner can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Owner can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Owner can delete documents" ON storage.objects;

-- Also drop any remaining "Anyone" policies
DROP POLICY IF EXISTS "Anyone can upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload contact images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update contact images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete contact images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete documents" ON storage.objects;

-- Recreate with owner-only access
CREATE POLICY "Owner can upload profile images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-images' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

CREATE POLICY "Owner can update profile images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profile-images' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

CREATE POLICY "Owner can delete profile images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'profile-images' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

CREATE POLICY "Owner can upload contact images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'contact-images' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

CREATE POLICY "Owner can update contact images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'contact-images' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

CREATE POLICY "Owner can delete contact images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'contact-images' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

CREATE POLICY "Owner can upload documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

CREATE POLICY "Owner can update documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'documents' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

CREATE POLICY "Owner can delete documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'documents' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

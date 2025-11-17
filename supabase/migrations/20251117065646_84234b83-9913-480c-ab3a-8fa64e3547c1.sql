-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete profile images" ON storage.objects;

-- Create RLS policies for profile-images bucket
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

-- Create gallery table
CREATE TABLE public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  title TEXT,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'audio')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Owner can insert gallery" ON public.gallery FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owner can update gallery" ON public.gallery FOR UPDATE USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owner can delete gallery" ON public.gallery FOR DELETE USING (owner_id = auth.uid());

-- Create reflections table
CREATE TABLE public.reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  reflection_number INTEGER NOT NULL CHECK (reflection_number >= 1 AND reflection_number <= 5),
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (owner_id, reflection_number)
);

ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view reflections" ON public.reflections FOR SELECT USING (true);
CREATE POLICY "Owner can insert reflections" ON public.reflections FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owner can update reflections" ON public.reflections FOR UPDATE USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owner can delete reflections" ON public.reflections FOR DELETE USING (owner_id = auth.uid());

-- Create gallery-media storage bucket with no file size limit
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('gallery-media', 'gallery-media', true, NULL, ARRAY['image/jpeg','image/png','image/gif','image/webp','image/svg+xml','video/mp4','video/webm','video/ogg','video/quicktime','audio/mpeg','audio/wav','audio/ogg','audio/mp3','audio/mp4','audio/aac','audio/flac']);

-- Storage policies for gallery-media
CREATE POLICY "Public can view gallery media" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-media');
CREATE POLICY "Owner can upload gallery media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-media' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);
CREATE POLICY "Owner can update gallery media" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery-media' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);
CREATE POLICY "Owner can delete gallery media" ON storage.objects FOR DELETE USING (bucket_id = 'gallery-media' AND auth.uid() = '36ca3d56-ae25-4db9-be1e-400563633555'::uuid);

-- Seed the 5 reflections for the owner
INSERT INTO public.reflections (owner_id, reflection_number, title, content) VALUES
  ('36ca3d56-ae25-4db9-be1e-400563633555', 1, 'Reflection 1', ''),
  ('36ca3d56-ae25-4db9-be1e-400563633555', 2, 'Reflection 2', ''),
  ('36ca3d56-ae25-4db9-be1e-400563633555', 3, 'Reflection 3', ''),
  ('36ca3d56-ae25-4db9-be1e-400563633555', 4, 'Reflection 4', ''),
  ('36ca3d56-ae25-4db9-be1e-400563633555', 5, 'Reflection 5', '');

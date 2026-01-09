-- Create skills table for persistent storage
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  skill_name TEXT NOT NULL,
  skill_type TEXT NOT NULL CHECK (skill_type IN ('technical', 'soft')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Public can view all skills
CREATE POLICY "Public can view skills" 
ON public.skills 
FOR SELECT 
USING (true);

-- Owner can insert skills
CREATE POLICY "Owner can insert skills" 
ON public.skills 
FOR INSERT 
WITH CHECK (owner_id = auth.uid());

-- Owner can delete skills
CREATE POLICY "Owner can delete skills" 
ON public.skills 
FOR DELETE 
USING (owner_id = auth.uid());

-- Add unique constraint to prevent duplicate skills per owner
CREATE UNIQUE INDEX skills_unique_per_owner ON public.skills (owner_id, skill_name, skill_type);
-- Create certifications table for permanent storage
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL DEFAULT '2025',
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Create policies for certifications
CREATE POLICY "Public can view certifications" 
ON public.certifications 
FOR SELECT 
USING (true);

CREATE POLICY "Owner can insert certifications" 
ON public.certifications 
FOR INSERT 
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owner can update certifications" 
ON public.certifications 
FOR UPDATE 
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owner can delete certifications" 
ON public.certifications 
FOR DELETE 
USING (owner_id = auth.uid());

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_certifications_updated_at
BEFORE UPDATE ON public.certifications
FOR EACH ROW
EXECUTE FUNCTION public.update_portfolio_content_updated_at();
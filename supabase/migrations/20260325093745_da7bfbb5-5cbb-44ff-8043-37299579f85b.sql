-- Create materials table
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'notes', 'slides')),
  file_size TEXT,
  file_path TEXT,
  downloads INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Everyone can view materials
CREATE POLICY "Anyone can view materials" ON public.materials FOR SELECT USING (true);

-- Allow inserts (admin-only enforced in app)
CREATE POLICY "Allow material inserts" ON public.materials FOR INSERT WITH CHECK (true);

-- Allow deletes (admin-only enforced in app)
CREATE POLICY "Allow material deletes" ON public.materials FOR DELETE USING (true);

-- Create storage bucket for material files
INSERT INTO storage.buckets (id, name, public) VALUES ('materials', 'materials', true);

-- Anyone can download files
CREATE POLICY "Material files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'materials');

-- Allow uploads
CREATE POLICY "Allow material uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'materials');

-- Allow deletes from storage
CREATE POLICY "Allow material file deletes" ON storage.objects FOR DELETE USING (bucket_id = 'materials');

CREATE TABLE public.head_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.head_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view head_files" ON public.head_files FOR SELECT USING (true);
CREATE POLICY "Anyone can insert head_files" ON public.head_files FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete head_files" ON public.head_files FOR DELETE USING (true);

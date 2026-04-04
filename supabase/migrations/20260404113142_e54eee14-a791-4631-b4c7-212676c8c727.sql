
-- Create admins table
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Public read so login can check credentials
CREATE POLICY "Anyone can view admins" ON public.admins FOR SELECT USING (true);
CREATE POLICY "Anyone can insert admins" ON public.admins FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete admins" ON public.admins FOR DELETE USING (true);

-- Seed head admin
INSERT INTO public.admins (username, password, role) VALUES ('abhi', 'Abhi123#', 'head');
INSERT INTO public.admins (username, password, role) VALUES ('admin2', 'Admin2@123', 'admin');
INSERT INTO public.admins (username, password, role) VALUES ('admin3', 'Admin3@123', 'admin');

-- Add uploaded_by to materials
ALTER TABLE public.materials ADD COLUMN uploaded_by TEXT DEFAULT NULL;

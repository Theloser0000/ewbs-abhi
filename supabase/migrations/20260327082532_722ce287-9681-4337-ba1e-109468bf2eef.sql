-- Align materials.type allowed values with current UI categories while preserving legacy values
ALTER TABLE public.materials
DROP CONSTRAINT IF EXISTS materials_type_check;

ALTER TABLE public.materials
ADD CONSTRAINT materials_type_check
CHECK (type = ANY (ARRAY['Textbook'::text, 'Question Paper'::text, 'Other'::text, 'pdf'::text, 'notes'::text, 'slides'::text]));
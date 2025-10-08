-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit testimonials (insert)
CREATE POLICY "Anyone can submit testimonials"
ON public.testimonials
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Only approved testimonials are publicly visible
CREATE POLICY "Approved testimonials are publicly visible"
ON public.testimonials
FOR SELECT
TO anon, authenticated
USING (approved = true);

-- Policy: Admins can view all testimonials
CREATE POLICY "Admins can view all testimonials"
ON public.testimonials
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE admins.id = auth.uid()
  )
);

-- Policy: Admins can update testimonials
CREATE POLICY "Admins can update testimonials"
ON public.testimonials
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE admins.id = auth.uid()
  )
);

-- Policy: Admins can delete testimonials
CREATE POLICY "Admins can delete testimonials"
ON public.testimonials
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE admins.id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
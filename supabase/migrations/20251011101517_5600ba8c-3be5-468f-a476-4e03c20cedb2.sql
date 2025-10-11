-- Drop the old RLS policy that only showed approved testimonials
DROP POLICY IF EXISTS "Approved testimonials are publicly visible" ON public.testimonials;

-- Drop the admin-specific policies since we're simplifying
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;

-- Create new policy: All testimonials are publicly visible
CREATE POLICY "All testimonials are publicly visible"
ON public.testimonials
FOR SELECT
TO public
USING (true);

-- Update the insert policy to remain the same (anyone can submit)
-- (Already exists: "Anyone can submit testimonials")

-- Keep admin delete policy
-- (Already exists: "Admins can delete testimonials")
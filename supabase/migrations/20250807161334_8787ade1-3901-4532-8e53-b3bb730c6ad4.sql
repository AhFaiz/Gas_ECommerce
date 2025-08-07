-- First, drop the existing check constraint
ALTER TABLE public.orders DROP CONSTRAINT orders_status_check;

-- Create a new check constraint with 'Done' instead of 'Processing'
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
CHECK (status = ANY (ARRAY['New'::text, 'Done'::text, 'Shipped'::text, 'Delivered'::text, 'Cancelled'::text, 'Pending'::text]));

-- Now update existing orders with 'Processing' status to 'Done' status
UPDATE public.orders 
SET status = 'Done' 
WHERE status = 'Processing';
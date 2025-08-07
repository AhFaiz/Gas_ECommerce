-- First, drop the existing check constraint
ALTER TABLE public.orders DROP CONSTRAINT orders_status_check;

-- Update existing orders with 'Processing' status to 'Done' status
UPDATE public.orders 
SET status = 'Done' 
WHERE status = 'Processing';

-- Create a new check constraint with the current valid statuses including 'Done'
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
CHECK (status = ANY (ARRAY['Pending'::text, 'Done'::text, 'Cancelled'::text]));
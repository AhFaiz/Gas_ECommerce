-- Update existing orders with 'Processing' status to 'Done' status
UPDATE public.orders 
SET status = 'Done' 
WHERE status = 'Processing';
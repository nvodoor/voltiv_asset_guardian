
-- Create function to get Palmetto houses in San Francisco
CREATE OR REPLACE FUNCTION public.get_palmetto_houses_sf()
RETURNS SETOF public.palmetto_houses
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.palmetto_houses
  WHERE city = 'San Francisco' 
  AND state = 'CA';
$$;

-- Migration: Create ping() keep-alive RPC function
-- Description: Simple RPC function returning 'pong' to prevent Supabase database from going to sleep due to inactivity.

CREATE OR REPLACE FUNCTION public.ping()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 'pong'::text;
$$;

-- Grant execute permissions to public roles so it can be called via REST/PostgREST
GRANT EXECUTE ON FUNCTION public.ping() TO anon;
GRANT EXECUTE ON FUNCTION public.ping() TO authenticated;
GRANT EXECUTE ON FUNCTION public.ping() TO service_role;

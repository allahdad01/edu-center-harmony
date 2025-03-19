
-- Function to assign an admin to a branch
CREATE OR REPLACE FUNCTION public.assign_admin_to_branch(
  admin_id_param UUID,
  branch_id_param UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.branch_admins (admin_id, branch_id)
  VALUES (admin_id_param, branch_id_param);
END;
$$;

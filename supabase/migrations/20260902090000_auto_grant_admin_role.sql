-- Auto-concede a role 'admin' para todo usuário que se cadastrar no login administrativo.
-- Este projeto não possui fluxo de convite/múltiplas roles: qualquer conta criada em /login
-- é considerada equipe da clínica e precisa acessar o /admin.

-- 1) Trigger: ao criar um usuário em auth.users, insere automaticamente a role admin.
CREATE OR REPLACE FUNCTION public.handle_new_user_grant_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_admin ON auth.users;

CREATE TRIGGER on_auth_user_created_grant_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_grant_admin();

-- 2) Correção retroativa: concede admin a usuários já existentes que ainda não têm nenhuma role.
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'
FROM auth.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE ur.user_id IS NULL
ON CONFLICT (user_id, role) DO NOTHING;

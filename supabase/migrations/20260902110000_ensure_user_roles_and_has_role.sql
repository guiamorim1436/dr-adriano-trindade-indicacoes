-- Garante que a tabela user_roles, o enum app_role e a função has_role existam.
-- Idempotente (IF NOT EXISTS / OR REPLACE).

-- 1) Enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2) Tabela user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        public.app_role NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3) Grants
GRANT SELECT, INSERT, DELETE ON public.user_roles TO service_role;
GRANT SELECT ON public.user_roles TO authenticated;

-- 4) Função has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role, anon;

-- 5) Corrige retroativamente: garante que todo usuário existente tem role admin
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'
FROM auth.users u
ON CONFLICT (user_id, role) DO NOTHING;

-- 6) Trigger para novos cadastros (recria se necessário)
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

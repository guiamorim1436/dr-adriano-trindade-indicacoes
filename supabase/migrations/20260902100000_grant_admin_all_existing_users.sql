-- Garante role 'admin' para TODOS os usuários existentes em auth.users.
-- Essa migration é idempotente (ON CONFLICT DO NOTHING).
-- Necessária porque o trigger criado na migration anterior só age em novos cadastros.

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'
FROM auth.users u
ON CONFLICT (user_id, role) DO NOTHING;

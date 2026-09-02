-- Reforço: garante role 'admin' especificamente para o e-mail relatado com problema
-- de acesso, além de reforçar a concessão para todos os usuários existentes.
-- Idempotente (ON CONFLICT DO NOTHING).

-- 1) Garante admin para todos os usuários existentes (reforço das migrations anteriores)
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'
FROM auth.users u
ON CONFLICT (user_id, role) DO NOTHING;

-- 2) Reforço direcionado: garante admin para o e-mail relatado, case-insensitive
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'
FROM auth.users u
WHERE lower(u.email) = lower('Guilherme.amorimcrm@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;

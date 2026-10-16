# Tenno Referral Template

Sistema Web Humanizado e Elegante de Indicação e Recompensas Multi-Tenant com Integração Kommo CRM.

---

## 1. Visão Geral

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui.
- **Backend**: Supabase Postgres (Multi-Tenant por Schema isolado) + Edge Functions (`public-api` e `admin-api`).
- **CRM**: Integração com Kommo via tokens cadastrados no painel administrativo.

---

## 2. Estrutura do App

- **`/`**: Apresentação institucional do programa de indicação.
- **`/indicar`**: Cadastro rápido do paciente/indicador (gera link único `/r/:codigo`).
- **`/r/:codigo`**: Página de captura onde o amigo indicado preenche seus dados.
- **`/entrar`** ou **`/painel/:token`**: Área onde o indicador acompanha o status das indicações e saldo de pontos.
- **`/login`** / **`/admin`**: Painel administrativo protegido por PIN para gestão de indicações, métricas e integração com Kommo.

---

## 3. Variáveis de Ambiente Obrigatórias (.env)

```env
VITE_SUPABASE_URL="https://mxfnpxofhbqdlerpcobv.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_RAQvQtur7NLPb7SPr-QaJQ_j6tlfdOy"
VITE_SUPABASE_PROJECT_ID="mxfnpxofhbqdlerpcobv"
VITE_SUPABASE_SCHEMA="nome_do_schema_do_cliente"
```

---

## 4. Comandos Disponíveis

- `npm run dev`: Inicia o servidor local de desenvolvimento.
- `npm run build`: Compila o projeto para produção.
- `npm run preview`: Visualiza o build de produção localmente.

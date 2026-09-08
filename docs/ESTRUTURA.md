# Clínica Vasques — Sistema de Indicações

Documentação completa: banco de dados, arquitetura e estrutura do app.

---

## 1. Visão geral

App web (React 18 + Vite + TypeScript + Tailwind + shadcn/ui) com backend Lovable Cloud (Supabase).

Três públicos:

1. **Indicador** (paciente): se cadastra sem senha, recebe um link único (`/r/CODIGO`) e acompanha suas indicações em `/painel/:token` (magic token).
2. **Indicado** (amigo): abre o link, preenche nome + WhatsApp e vira lead.
3. **Equipe da clínica**: faz login por e-mail/senha em `/login` e usa o painel `/admin`.

Toda a lógica de dados passa por **duas edge functions**; o frontend nunca consulta as tabelas diretamente.

```
Navegador (React)
   │  supabase.functions.invoke()
   ├── public-api   (sem autenticação, usa service role internamente)
   └── admin-api    (exige sessão autenticada)
            │
            ├── Postgres (tabelas abaixo)
            └── API Kommo (contatos, leads, notas, status)
```

---

## 2. Schema do banco (schema `public`)

### Enums

| Tipo | Valores |
|---|---|
| `app_role` | `admin` |
| `indicacao_status` | `recebido`, `em_contato`, `compareceu`, `convertido`, `encerrado` |

### `indicadores`
Pacientes que indicam.

| Coluna | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `nome` | text NOT NULL | |
| `telefone` | text NOT NULL | normalizado (DDD + número, sem +55) |
| `codigo_indicacao` | text NOT NULL | 6 caracteres, alfabeto sem ambíguos |
| `magic_token` | text NOT NULL | regenerado a cada acesso/cadastro |
| `created_at` | timestamptz | `now()` |

RLS: apenas admin (`has_role(auth.uid(),'admin')`) — ALL.

### `indicacoes`
Cada pessoa indicada.

| Coluna | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `indicador_id` | uuid NOT NULL | FK → `indicadores.id` |
| `nome_indicado` | text NOT NULL | |
| `telefone_indicado` | text NOT NULL | |
| `status` | `indicacao_status` | default `recebido` |
| `kommo_contact_id` | bigint | id do contato no Kommo |
| `kommo_lead_id` | bigint | id do lead no Kommo |
| `kommo_status` | text | nome do estágio sincronizado |
| `kommo_updated_at` | timestamptz | último sync |
| `observacao` | text | |
| `created_at` / `updated_at` | timestamptz | `updated_at` via trigger |

RLS: apenas admin — ALL.
Trigger: `trg_indicacoes_updated_at` BEFORE UPDATE → `set_updated_at()`.

### `cliques_link`
Tracking leve de cliques no link de indicação.

| Coluna | Tipo |
|---|---|
| `id` | uuid PK |
| `indicador_id` | uuid NOT NULL → `indicadores.id` |
| `user_agent` | text |
| `created_at` | timestamptz |

RLS: admin somente SELECT; INSERT/UPDATE/DELETE negados ao cliente (inserção acontece via service role na edge function).

### `premios`
Consumo de pontos/benefícios pelo indicador.

| Coluna | Tipo |
|---|---|
| `id` | uuid PK |
| `indicador_id` | uuid NOT NULL → `indicadores.id` |
| `pontos_consumidos` | integer NOT NULL |
| `comentario` | text |
| `created_at` | timestamptz |

RLS: admin — ALL.

### `configuracoes_kommo`
Linha única (`id = 1`) com integração + branding.

| Coluna | Tipo | Uso |
|---|---|---|
| `id` | integer PK default 1 | sempre 1 |
| `subdomain` | text | subdomínio Kommo |
| `bearer_token` | text | token da API Kommo |
| `pipeline_id` | bigint | funil padrão |
| `stage_id` | bigint | etapa padrão |
| `whatsapp_clinica` | text | número para o botão do indicado |
| `whatsapp_mensagem` | text | mensagem pré-preenchida (`[Indicador]` é substituído) |
| `nome_plataforma` | text | título público |
| `logo_url` | text | logo exibida no app |
| `updated_at` | timestamptz | |

RLS: admin — ALL.

### `user_roles`
Papéis de acesso (separada da tabela de usuários, por segurança).

| Coluna | Tipo |
|---|---|
| `id` | uuid PK |
| `user_id` | uuid NOT NULL → `auth.users.id` |
| `role` | `app_role` NOT NULL |
| `created_at` | timestamptz |

Único por (`user_id`, `role`). RLS: admin somente SELECT; escrita apenas via service role.

### Funções

- `has_role(_user_id uuid, _role app_role) → boolean` — SECURITY DEFINER, usada nas policies (evita recursão de RLS).
- `handle_new_user_admin()` — trigger que torna o primeiro usuário admin.
- `set_updated_at()` — atualiza `updated_at`.

### Storage
Bucket público `brand_assets` (logos e imagens da marca).

---

## 3. Edge functions

### `public-api` (sem login)
Ações aceitas em `{ action, payload }`:

| Ação | O que faz |
|---|---|
| `getPublicConfig` | Nome da plataforma, logo, WhatsApp e mensagem |
| `cadastrarIndicador` | Cria indicador (ou reaproveita telefone existente), gera `codigo_indicacao` + `magic_token` |
| `entrarPorTelefone` | Gera novo magic token para telefone já cadastrado |
| `getPainel` | Dados do indicador + suas indicações a partir do token |
| `getIndicadorPorCodigo` | Resolve o código do link e opcionalmente registra o clique |
| `submitIndicacao` | Valida, bloqueia autoindicação e duplicidade, cria contato/lead/nota no Kommo, grava a indicação e devolve o link do WhatsApp |

Regras antifraude: telefone normalizado (10–13 dígitos, remove +55), autoindicação bloqueada, duplicidade por (indicador, telefone) ignorada, falha do Kommo não impede o registro interno.

### `admin-api` (exige sessão)
Qualquer conta autenticada é tratada como equipe da clínica: a função valida o JWT, faz upsert best-effort da role `admin` e libera as ações.

| Ação | O que faz |
|---|---|
| `adminDashboard` | Totais de indicadores, indicações, convertidos e ranking top 5 |
| `listarIndicadores` | Lista com total, convertidos e pontos consumidos |
| `premiarIndicador` | Registra consumo de pontos em `premios` |
| `listarIndicacoes` | Lista de indicados com indicador, status e dados Kommo |
| `getConfigKommo` / `salvarConfigKommo` / `testarConfigKommo` | Configurações e teste de conexão |
| `atualizarStatus` | Muda o status de uma indicação |
| `syncKommoLeads` | Sincroniza status dos leads (lotes de 50, cache de 1h) |

---

## 4. Estrutura do frontend

```
src/
├── App.tsx                 rotas
├── main.tsx
├── styles.css              tema navy/dourado (tokens)
├── components/
│   ├── Logo.tsx            logo da clínica (config ou fallback)
│   ├── PageShell.tsx       moldura das páginas públicas
│   ├── ProtectedRoute.tsx  bloqueia /admin sem sessão
│   ├── StatusBadge.tsx     selo de status
│   └── ui/                 shadcn/ui
├── lib/
│   ├── api.ts              client tipado das duas edge functions
│   ├── phone.ts            máscara/validação BR
│   ├── codes.ts
│   └── utils.ts
├── pages/ (ver rotas)
└── integrations/supabase/  client e types gerados
```

### Rotas

| Rota | Página | Público |
|---|---|---|
| `/` | Index | apresentação do programa |
| `/indicar` | Indicar | cadastro do indicador |
| `/entrar` | Entrar | acesso por telefone |
| `/painel/:token` | PainelToken | painel do indicador (link, WhatsApp, histórico) |
| `/r/:codigo` | RCodigo | landing do indicado + formulário |
| `/r/:codigo/obrigado` | RCodigoObrigado | agradecimento + WhatsApp |
| `/login` | Login | e-mail/senha da equipe (e-mail auto-confirmado) |
| `/admin` | AdminLayout | protegida |
| `/admin` (index) | AdminIndex | dashboard |
| `/admin/indicadores` | AdminIndicadores | gestão + premiação |
| `/admin/indicados` | AdminIndicados | status e Kommo |
| `/admin/configuracoes` | AdminConfiguracoes | Kommo, WhatsApp, marca |
| `*` | NotFound | |

Dados via TanStack Query; notificações com sonner.

---

## 5. Fluxos principais

**Indicador:** `/indicar` → cadastro → magic token → `/painel/:token` → copia/compartilha `https://<dominio>/r/CODIGO`.

**Indicado:** abre `/r/CODIGO` (clique registrado) → envia nome + WhatsApp → validações → contato/lead/nota no Kommo → indicação salva como `recebido` → `/r/CODIGO/obrigado` com botão de WhatsApp.

**Equipe:** `/login` → `/admin` → acompanha, muda status, sincroniza com o Kommo e registra prêmios.

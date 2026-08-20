# Clinica vasques

Sistema Simples e Humanizado de Indicação para Clínica com Integração Kommo

Crie um sistema web simples, elegante, humanizado e mobile-first para gestão de indicações de pacientes de uma clínica.

O sistema será desenvolvido no Lovable e deve priorizar:

- simplicidade

- experiência do usuário

- facilidade de compartilhamento

- integração leve com Kommo

- aparência premium e discreta

Evitar aparência de:

- marketing agressivo

- gamificação exagerada

- sistema complexo

- CRM tradicional

O objetivo é criar um programa de indicação leve e pessoal entre pacientes.

---

# CONCEITO DO SISTEMA

Pacientes da clínica poderão indicar amigos através de um link pessoal de indicação.

O processo deve ser extremamente simples:

- sem senha

- sem onboarding complexo

- sem excesso de informações

O sistema deve funcionar principalmente via WhatsApp.

---

# FLUXO DO INDICADOR

## Entrada

O paciente acessa uma página simples contendo:

- logo da clínica

- breve explicação do programa

- campo nome completo

- campo WhatsApp

Após preencher:

- o sistema cria automaticamente um perfil de indicador

- gera um link único de indicação

- salva no banco

Exemplo:

https://indicacoes.clinica.com/r/X8K29Q

Não exigir senha.

---

# ACESSO DO INDICADOR

O indicador acessa seu painel através de:

- link mágico

OU

- código enviado por WhatsApp

Evitar login tradicional.

---

# PAINEL DO INDICADOR

O painel deve ser extremamente simples e elegante.

Exibir apenas:

## Informações principais

- Nome

- Seu link de indicação

- Botão copiar link

- Botão compartilhar no WhatsApp

## Histórico simples

Lista contendo:

- Nome do indicado

- Status:

  - Recebido

  - Em contato

  - Compareceu

  - Convertido

## Benefícios

Mostrar:

- quantidade de indicações

- elegibilidade para benefícios

- mensagem amigável

Exemplo:

“Você já indicou 3 pessoas ❤️”

---

# FLUXO DO INDICADO

Quando alguém clicar no link de indicação:

Exemplo:

https://indicacoes.clinica.com/r/X8K29Q

Abrir uma landing page simples e acolhedora contendo:

- logo da clínica

- mensagem amigável

Exemplo:

“Maria indicou nossa clínica para você ❤️”

Campos:

- Nome completo

- WhatsApp

Botão:

- “Quero saber mais”

---

# LÓGICA DE INDICAÇÃO

Ao enviar formulário:

O sistema deverá:

1. Validar telefone

2. Verificar se o contato já existe no Kommo

3. Caso não exista:

   - criar contato

   - criar lead

4. Caso exista:

   - apenas registrar a indicação internamente

Sempre:

- associar ao indicador

- registrar data

- salvar origem “Indicação”

---

# INTEGRAÇÃO KOMMO

Implementar integração com API do Kommo.

Permitir configurar:

- subdomínio

- bearer token

- pipeline

- stage padrão

Tudo via painel administrativo.

---

# AO CRIAR LEAD NO KOMMO

Criar:

- contato

- lead vinculado

Adicionar:

- origem = “Indicação”

- nota interna contendo:

  - nome do indicador

  - telefone do indicador

  - link/código de indicação

---

# REGRAS IMPORTANTES

## Evitar fraude simples

- impedir autoindicação

- impedir múltiplos cadastros com mesmo telefone

- validar formato do WhatsApp

## Tracking leve

Registrar:

- clique no link

- cadastro realizado

- status do lead

---

# STATUS DAS INDICAÇÕES

Os status devem ser simples:

- Recebido

- Em contato

- Compareceu

- Convertido

- Encerrado

Os status podem ser:

- atualizados manualmente

OU

- sincronizados via Kommo

---

# TELA ADMINISTRATIVA

Criar painel administrativo simples contendo:

## Dashboard

Exibir:

- total de indicadores

- total de indicados

- total convertidos

- ranking simples

---

## Gestão de indicadores

Tabela contendo:

- nome

- telefone

- quantidade de indicações

- quantidade convertida

- link de indicação

---

## Gestão de indicados

Tabela contendo:

- nome

- telefone

- indicador responsável

- status

- data

- ID Kommo

---

## Configurações Kommo

Campos:

- subdomínio

- bearer token

- pipeline

- stage padrão

---

# EXPERIÊNCIA VISUAL

O sistema deve possuir:

- visual clean

- aparência premium

- estilo minimalista

- interface moderna

- mobile-first

- navegação simples

- poucos elementos

- cards elegantes

- cores suaves

Evitar aparência de:

- sistema corporativo pesado

- painel complexo

- plataforma de afiliados

A sensação deve ser:

- acolhedora

- humana

- confiável

---

# STACK SUGERIDA

Frontend:

- Next.js

- TailwindCSS

Backend:

- Node.js

- API Routes

Banco:

- PostgreSQL ou Supabase

Hospedagem:

- Vercel

---

# MODELAGEM SUGERIDA

## Tabela indicadores

- id

- nome

- telefone

- codigo_indicacao

- magic_link_token

- created_at

## Tabela indicacoes

- id

- indicador_id

- nome_indicado

- telefone_indicado

- status

- kommo_contact_id

- kommo_lead_id

- created_at

## Tabela configuracoes

- kommo_subdomain

- kommo_token

- pipeline_id

- stage_id

---

# FUNCIONALIDADES IMPORTANTES

- geração automática de link único

- compartilhamento via WhatsApp

- login mágico

- verificação de duplicidade no Kommo

- sincronização simples de status

- feedback visual amigável

- integração desacoplada do Kommo

---

# ESTRUTURA DO PROJETO

Organizar em:

- components

- services

- integrations

- pages

- database

- utils

Criar:

- README

- variáveis de ambiente

- serviço isolado de integração Kommo

- função de busca de contatos existentes

- função de criação de leads

- middleware de autenticação mágica

O código deve ser:

- limpo

- escalável

- organizado

- fácil de manter

- preparado para evolução futura

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://human-referrals.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0eb80240-4511-4218-aad6-9d45ffbd8a52).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

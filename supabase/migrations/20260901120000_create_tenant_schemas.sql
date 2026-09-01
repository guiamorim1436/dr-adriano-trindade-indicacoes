-- Migration: Create isolated schemas for each clinic clone
-- Each schema replicates the full table structure from public

-- Helper function to create a tenant schema with all tables
CREATE OR REPLACE FUNCTION create_tenant_schema(schema_name TEXT) RETURNS void AS $$
BEGIN
  -- Create schema
  EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);

  -- Create enums in the new schema
  EXECUTE format('DO $enum$ BEGIN CREATE TYPE %I.indicacao_status AS ENUM (''recebido'', ''em_contato'', ''compareceu'', ''convertido'', ''encerrado''); EXCEPTION WHEN duplicate_object THEN NULL; END $enum$', schema_name);
  EXECUTE format('DO $enum$ BEGIN CREATE TYPE %I.app_role AS ENUM (''admin''); EXCEPTION WHEN duplicate_object THEN NULL; END $enum$', schema_name);

  -- indicadores
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.indicadores (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL,
      codigo_indicacao TEXT NOT NULL UNIQUE,
      magic_token TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )', schema_name);

  -- indicacoes
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.indicacoes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      indicador_id UUID NOT NULL REFERENCES %I.indicadores(id),
      nome_indicado TEXT NOT NULL,
      telefone_indicado TEXT NOT NULL,
      status %I.indicacao_status NOT NULL DEFAULT ''recebido'',
      kommo_contact_id INTEGER,
      kommo_lead_id INTEGER,
      kommo_status TEXT,
      kommo_updated_at TIMESTAMPTZ,
      observacao TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )', schema_name, schema_name, schema_name);

  -- cliques_link
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.cliques_link (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      indicador_id UUID NOT NULL REFERENCES %I.indicadores(id),
      user_agent TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )', schema_name, schema_name);

  -- configuracoes_kommo
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.configuracoes_kommo (
      id INTEGER PRIMARY KEY DEFAULT 1,
      subdomain TEXT,
      bearer_token TEXT,
      pipeline_id INTEGER,
      stage_id INTEGER,
      whatsapp_clinica TEXT,
      whatsapp_mensagem TEXT,
      nome_plataforma TEXT,
      logo_url TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )', schema_name);

  -- premios
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.premios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      indicador_id UUID NOT NULL REFERENCES %I.indicadores(id),
      pontos_consumidos INTEGER NOT NULL,
      comentario TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    )', schema_name, schema_name);

  -- Insert default config row
  EXECUTE format('
    INSERT INTO %I.configuracoes_kommo (id) VALUES (1) ON CONFLICT (id) DO NOTHING
  ', schema_name);

  -- Grant permissions to service_role and authenticated
  EXECUTE format('GRANT USAGE ON SCHEMA %I TO service_role', schema_name);
  EXECUTE format('GRANT ALL ON ALL TABLES IN SCHEMA %I TO service_role', schema_name);
  EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT ALL ON TABLES TO service_role', schema_name);
  EXECUTE format('GRANT USAGE ON SCHEMA %I TO authenticated', schema_name);
  EXECUTE format('GRANT SELECT ON ALL TABLES IN SCHEMA %I TO authenticated', schema_name);
  EXECUTE format('GRANT USAGE ON SCHEMA %I TO anon', schema_name);
  EXECUTE format('GRANT SELECT ON ALL TABLES IN SCHEMA %I TO anon', schema_name);
END;
$$ LANGUAGE plpgsql;

-- Create the three clinic schemas
SELECT create_tenant_schema('waldemar_penna');
SELECT create_tenant_schema('clinica_pedron');
SELECT create_tenant_schema('dr_roger_vieira');

-- Keep create_tenant_schema function for future clones

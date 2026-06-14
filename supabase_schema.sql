-- Copie este código e cole no Editor SQL ('SQL Editor') do seu Supabase para criar o banco de dados.

-- 1. EXTENSÃO UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA CLIENTES
CREATE TABLE public.clientes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT,
  endereco TEXT,
  nif TEXT,
  email TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA FORNECEDORES
CREATE TABLE public.fornecedores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome TEXT NOT NULL,
  contato TEXT,
  endereco TEXT,
  nif TEXT,
  email TEXT
);

-- 4. TABELA PRODUTOS (ESTOQUE)
CREATE TABLE public.produtos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome TEXT NOT NULL,
  codigo TEXT UNIQUE NOT NULL,
  preco_custo NUMERIC(10,2) DEFAULT 0,
  preco_venda NUMERIC(10,2) DEFAULT 0,
  quantidade INTEGER DEFAULT 0,
  categoria TEXT,
  fornecedor_id UUID REFERENCES public.fornecedores(id) ON DELETE SET NULL,
  data_entrada TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA FATURAS
CREATE TABLE public.faturas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  numero_fatura TEXT UNIQUE NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total NUMERIC(10,2) DEFAULT 0,
  estado TEXT DEFAULT 'pendente', -- opções: rascunho, pago, pendente, cancelado
  forma_pagamento TEXT
);

-- 6. TABELA ITENS DA FATURA
CREATE TABLE public.itens_fatura (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  fatura_id UUID REFERENCES public.faturas(id) ON DELETE CASCADE,
  produto_id UUID REFERENCES public.produtos(id) ON DELETE RESTRICT,
  quantidade INTEGER DEFAULT 1,
  preco_unitario NUMERIC(10,2) DEFAULT 0,
  subtotal NUMERIC(10,2) DEFAULT 0
);

-- 7. SEGURANÇA (RLS) E POLÍTICAS BÁSICAS
-- Habilitar Row Level Security (RLS)
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_fatura ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso (Para este projeto inicial, deixaremos o acesso livre para todas as chaves 'anon')
-- IMPORTANTE: Para um app em produção maduro, as políticas devem verificar auth.uid()
CREATE POLICY "Acesso total Clientes anon" ON public.clientes FOR ALL USING (true);
CREATE POLICY "Acesso total Fornecedores anon" ON public.fornecedores FOR ALL USING (true);
CREATE POLICY "Acesso total Produtos anon" ON public.produtos FOR ALL USING (true);
CREATE POLICY "Acesso total Faturas anon" ON public.faturas FOR ALL USING (true);
CREATE POLICY "Acesso total Itens Fatura anon" ON public.itens_fatura FOR ALL USING (true);

export type Produto = {
  id: string;
  nome: string;
  codigo: string;
  preco_custo: number;
  preco_venda: number;
  quantidade: number;
  categoria: string;
  fornecedor_id?: string;
  data_entrada: string;
};

export type Cliente = {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  nif: string;
  email: string;
  data_cadastro: string;
};

export type Fornecedor = {
  id: string;
  nome: string;
  contato: string;
  endereco: string;
  nif: string;
  email: string;
};

export type FaturaEstado = 'rascunho' | 'pago' | 'pendente' | 'cancelado';

export type ItemFatura = {
  id: string;
  fatura_id: string;
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
};

export type Fatura = {
  id: string;
  numero_fatura: string;
  cliente_id: string;
  data: string;
  total: number;
  estado: FaturaEstado;
  forma_pagamento: string;
  itens?: ItemFatura[];
};

export type StoreSettings = {
  nome_loja: string;
  vendedor: string;
  nif: string;
  telefone: string;
  endereco: string;
  logotipo: string;
};

export type DashboardStats = {
  totalRevenue: number;
  totalInvoices: number;
  totalClients: number;
  lowStockItems: number;
  revenueData: { month: string; revenue: number; expenses: number }[];
};

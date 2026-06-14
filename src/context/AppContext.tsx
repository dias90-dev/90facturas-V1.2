import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Produto, Cliente, Fornecedor, Fatura, DashboardStats } from '../types';
import { supabase, hasSupabaseConfig } from '../lib/supabase';

interface AppContextType {
  produtos: Produto[];
  clientes: Cliente[];
  fornecedores: Fornecedor[];
  faturas: Fatura[];
  stats: DashboardStats;
  addProduto: (p: Partial<Produto>) => Promise<void>;
  updateProduto: (p: Produto) => Promise<void>;
  deleteProduto: (id: string) => Promise<void>;
  addCliente: (c: Partial<Cliente>) => Promise<void>;
  updateCliente: (c: Cliente) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;
  addFornecedor: (s: Partial<Fornecedor>) => Promise<void>;
  addFatura: (i: Partial<Fatura>) => Promise<void>;
  exportBackup: () => void;
}

// Fallback Mocks temporários caso o Supabase não esteja ligado
const mockProdutos: Produto[] = [
  { id: '1', nome: 'Laptop Pro 15', codigo: 'LP-15-2023', quantidade: 12, preco_venda: 1299000, preco_custo: 900000, categoria: 'Eletrônicos', data_entrada: new Date().toISOString() },
  { id: '2', nome: 'Monitor Curvo 27"', codigo: 'MC-27', quantidade: 4, preco_venda: 250000, preco_custo: 180000, categoria: 'Periféricos', data_entrada: new Date().toISOString() },
];
const mockClientes: Cliente[] = [
  { id: '1', nome: 'Tech Corp, Lda.', email: 'billing@techcorp.ao', telefone: '923 456 789', endereco: 'Talatona, Luanda', nif: '5001234567', data_cadastro: new Date().toISOString() },
];
const mockFornecedores: Fornecedor[] = [
  { id: '1', nome: 'Global Systems', email: 'vendas@globalsystems.com', contato: '912 345 678', endereco: 'Maianga, Luanda', nif: '5441234567' },
];
const mockFaturas: Fatura[] = [
  { id: '1', numero_fatura: 'FT-2023-001', cliente_id: '1', data: new Date().toISOString(), estado: 'pago', total: 1299000, forma_pagamento: 'Transferência Bancária' }
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [produtos, setProdutos] = useState<Produto[]>(hasSupabaseConfig ? [] : mockProdutos);
  const [clientes, setClientes] = useState<Cliente[]>(hasSupabaseConfig ? [] : mockClientes);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(hasSupabaseConfig ? [] : mockFornecedores);
  const [faturas, setFaturas] = useState<Fatura[]>(hasSupabaseConfig ? [] : mockFaturas);

  useEffect(() => {
    if (hasSupabaseConfig && supabase) {
      const fetchData = async () => {
        try {
          const [resProd, resCli, resFor, resFat] = await Promise.all([
            supabase.from('produtos').select('*'),
            supabase.from('clientes').select('*'),
            supabase.from('fornecedores').select('*'),
            supabase.from('faturas').select('*')
          ]);
          if (resProd.data) setProdutos(resProd.data);
          if (resCli.data) setClientes(resCli.data);
          if (resFor.data) setFornecedores(resFor.data);
          if (resFat.data) setFaturas(resFat.data);
        } catch (error) {
          console.error("Erro ao carregar dados do Supabase:", error);
        }
      };
      fetchData();
    }
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = faturas.filter(i => i.estado === 'pago').reduce((acc, inv) => acc + inv.total, 0);
    const lowStockItems = produtos.filter(p => p.quantidade <= 10).length; // Alerta abaixo de 10
    return {
      totalRevenue,
      totalInvoices: faturas.length,
      totalClients: clientes.length,
      lowStockItems,
      revenueData: [ // Idealmente isto deveria ser dinâmico com base nos meses
        { month: 'Jan', revenue: 4000000, expenses: 2400000 },
        { month: 'Fev', revenue: 3000000, expenses: 1398000 },
        { month: 'Mar', revenue: 2000000, expenses: 9800000 },
        { month: 'Abr', revenue: 2780000, expenses: 3908000 },
        { month: 'Mai', revenue: 1890000, expenses: 4800000 },
        { month: 'Jun', revenue: totalRevenue, expenses: 3800000 },
      ]
    };
  }, [faturas, produtos, clientes]);

  const addProduto = async (p: Partial<Produto>) => {
    if (supabase) {
      const { data, error } = await supabase.from('produtos').insert([p]).select().single();
      if (!error && data) setProdutos([...produtos, data]);
    } else {
      setProdutos([...produtos, { ...p, id: Math.random().toString() } as Produto]);
    }
  };

  const updateProduto = async (p: Produto) => {
    if (supabase) {
      const { error } = await supabase.from('produtos').update(p).eq('id', p.id);
      if (!error) setProdutos(produtos.map(prod => prod.id === p.id ? p : prod));
    } else {
      setProdutos(produtos.map(prod => prod.id === p.id ? p : prod));
    }
  };

  const deleteProduto = async (id: string) => {
    if (supabase) {
      await supabase.from('produtos').delete().eq('id', id);
    }
    setProdutos(produtos.filter(prod => prod.id !== id));
  };
  
  const addCliente = async (c: Partial<Cliente>) => {
    if (supabase) {
      const { data, error } = await supabase.from('clientes').insert([c]).select().single();
      if (!error && data) setClientes([...clientes, data]);
    } else {
      setClientes([...clientes, { ...c, id: Math.random().toString() } as Cliente]);
    }
  };

  const updateCliente = async (c: Cliente) => {
    if (supabase) {
      const { error } = await supabase.from('clientes').update(c).eq('id', c.id);
      if (!error) setClientes(clientes.map(cli => cli.id === c.id ? c : cli));
    } else {
      setClientes(clientes.map(cli => cli.id === c.id ? c : cli));
    }
  };

  const deleteCliente = async (id: string) => {
    if (supabase) {
      await supabase.from('clientes').delete().eq('id', id);
    }
    setClientes(clientes.filter(cli => cli.id !== id));
  };

  const addFornecedor = async (s: Partial<Fornecedor>) => {
    if (supabase) {
      const { data, error } = await supabase.from('fornecedores').insert([s]).select().single();
      if (!error && data) setFornecedores([...fornecedores, data]);
    } else {
      setFornecedores([...fornecedores, { ...s, id: Math.random().toString() } as Fornecedor]);
    }
  }

  const addFatura = async (i: Partial<Fatura>) => {
    if (supabase) {
      const { data, error } = await supabase.from('faturas').insert([i]).select().single();
      if (!error && data) setFaturas([...faturas, data]);
    } else {
      setFaturas([...faturas, { ...i, id: Math.random().toString() } as Fatura]);
    }
  };

  const exportBackup = () => {
    const dataObj = {
      produtos,
      clientes,
      fornecedores,
      faturas,
      timestamp: new Date().toISOString()
    };
    
    // Salvar no local storage do navegador como redundância
    localStorage.setItem('gestoke_backup_snapshot', JSON.stringify(dataObj));

    // Despachar download do JSON
    const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gestoke_backup_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppContext.Provider value={{ 
      produtos, clientes, fornecedores, faturas, stats, 
      addProduto, updateProduto, deleteProduto, 
      addCliente, updateCliente, deleteCliente, 
      addFornecedor, addFatura, exportBackup 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

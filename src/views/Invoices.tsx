import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Plus, Search, Eye } from 'lucide-react';

export const Invoices: React.FC = () => {
  const { faturas, clientes } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const getClientName = (id: string) => clientes.find(c => c.id === id)?.nome || 'Cliente Desconhecido';

  const filtered = faturas.filter(inv => 
    inv.numero_fatura.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getClientName(inv.cliente_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatKz = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Faturas</h2>
          <p className="text-slate-500">Gestão de facturação</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" /> Nova Fatura
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Pesquisar fatura ou cliente..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Nº Fatura</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Data Emissão</th>
                <th className="px-6 py-4 font-medium">Pagamento</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-indigo-600">{inv.numero_fatura}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">{getClientName(inv.cliente_id)}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(inv.data).toLocaleDateString('pt-AO')}</td>
                  <td className="px-6 py-4 text-slate-500">{inv.forma_pagamento}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                      inv.estado === 'pago' ? 'bg-emerald-100 text-emerald-700' :
                      inv.estado === 'pendente' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {inv.estado === 'pago' ? 'Pago' : inv.estado === 'pendente' ? 'Pendente' : inv.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">{formatKz(inv.total)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

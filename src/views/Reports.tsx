import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, PieChart, TrendingUp, Calendar } from 'lucide-react';

export const Reports: React.FC = () => {
  const { stats, exportBackup } = useApp();

  const formatKz = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Relatórios Detalhados</h2>
          <p className="text-slate-500">Acompanhamento preciso das transações financeiras</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportBackup} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Download className="w-5 h-5" /> JSON
          </button>
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Download className="w-5 h-5" /> Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Receitas vs Despesas
            </h3>
            <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-600">Este Ano</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Kz ${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                  formatter={(value: number) => formatKz(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="revenue" name="Receita" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expenses" name="Despesa" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-500" />
              Resumo Financeiro
            </h3>
          </div>
          
          <div className="space-y-6 flex-1 flex flex-col justify-center">
             <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="bg-emerald-200 p-2 rounded-full">
                   <TrendingUp className="w-5 h-5 text-emerald-700" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-emerald-900">Total Faturado</p>
                   <p className="text-emerald-700 text-xs">Até a presente data</p>
                 </div>
               </div>
               <span className="text-xl font-bold text-emerald-700">{formatKz(stats.totalRevenue)}</span>
             </div>

             <div className="p-4 bg-rose-50 rounded-lg border border-rose-100 flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="bg-rose-200 p-2 rounded-full">
                   <TrendingUp className="w-5 h-5 text-rose-700 rotate-180" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-rose-900">Despesas Estimadas</p>
                   <p className="text-rose-700 text-xs">Baseado em compras</p>
                 </div>
               </div>
               <span className="text-xl font-bold text-rose-700">{formatKz(stats.totalRevenue * 0.4)}</span>
             </div>

             <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="bg-indigo-200 p-2 rounded-full">
                   <Calendar className="w-5 h-5 text-indigo-700" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-indigo-900">Recebimentos Pendentes</p>
                   <p className="text-indigo-700 text-xs">Faturas não pagas</p>
                 </div>
               </div>
               <span className="text-xl font-bold text-indigo-700">{formatKz(stats.totalRevenue * 0.15)}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

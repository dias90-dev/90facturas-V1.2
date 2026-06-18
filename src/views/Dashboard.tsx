import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { TrendingUp, Package, Users, DollarSign, AlertTriangle, Printer } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { stats, faturas, produtos, settings } = useApp();

  const formatKz = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
  };

  const topProducts = React.useMemo(() => {
    const salesMap: Record<string, { nome: string; totalVendidos: number; receita: number }> = {};
    
    faturas.forEach(f => {
      // Consider apenas faturas pagas ou todas? Assume all or paid
      if (f.estado === 'cancelado' || f.estado === 'rascunho') return;

      f.itens?.forEach(item => {
        if (!salesMap[item.produto_id]) {
          const p = produtos.find(p => p.id === item.produto_id);
          salesMap[item.produto_id] = {
            nome: p ? p.nome : 'Produto Deletado',
            totalVendidos: 0,
            receita: 0
          };
        }
        salesMap[item.produto_id].totalVendidos += item.quantidade;
        salesMap[item.produto_id].receita += (item.preco_unitario * item.quantidade);
      });
    });

    return Object.values(salesMap)
      .sort((a, b) => b.totalVendidos - a.totalVendidos)
      .slice(0, 5);
  }, [faturas, produtos]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-[#B4B4B4]">Acompanhamento de faturação e estoque</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-[#0A0A0A] border border-[#27272A] hover:bg-[#0A0A0A] text-[#B4B4B4] px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Printer className="w-5 h-5" /> Imprimir
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0A0A0A] rounded-xl shadow-sm border border-[#27272A] p-6 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[#B4B4B4]">Receita Total</p>
              <h3 className="text-2xl font-bold tracking-tight mt-1">{formatKz(stats.totalRevenue)}</h3>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg text-[#7B2CF5]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-4 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +12.5% desde o último mês
          </p>
        </div>

        <div className="bg-[#0A0A0A] rounded-xl shadow-sm border border-[#27272A] p-6 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[#B4B4B4]">Faturas Emitidas</p>
              <h3 className="text-2xl font-bold tracking-tight mt-1">{stats.totalInvoices}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-[#7B2CF5]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] rounded-xl shadow-sm border border-[#27272A] p-6 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[#B4B4B4]">Total Clientes</p>
              <h3 className="text-2xl font-bold tracking-tight mt-1">{stats.totalClients}</h3>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] rounded-xl shadow-sm border border-[#27272A] p-6 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[#B4B4B4]">Artigos Pouco Estoque</p>
              <h3 className="text-2xl font-bold tracking-tight mt-1 text-[#F59E0B]">{stats.lowEstoqueItems}</h3>
            </div>
            <div className="bg-rose-50 p-3 rounded-lg text-[#F59E0B]">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0A0A0A] p-6 rounded-xl shadow-sm border border-[#27272A]">
          <h3 className="font-bold mb-6">Receitas vs Despesas Anual</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Kz ${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => formatKz(value)}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0A0A0A] p-6 rounded-xl shadow-sm border border-[#27272A] flex flex-col print:border-none print:shadow-none print:p-0">
          <h3 className="font-bold mb-4">Estoque Crítico</h3>
          <div className="flex-1 overflow-y-auto">
            {produtos.filter(p => p.quantidade <= (settings.limite_estoque || 10)).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                <Package className="w-8 h-8 opacity-50" />
                <p className="text-sm">Estoque regularizado.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {produtos.filter(p => p.quantidade <= (settings.limite_estoque || 10)).map(item => (
                  <li key={item.id} className="flex items-center justify-between p-3 bg-[#F59E0B]/10 text-[#F59E0B] rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                      <div>
                        <p className="font-medium text-sm">{item.nome}</p>
                        <p className="text-xs text-red-700 opacity-80">Cód: {item.codigo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.quantidade} unid.</p>
                      <p className="text-xs text-red-700">Baixo</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0A0A0A] p-6 rounded-xl shadow-sm border border-[#27272A]">
          <h3 className="font-bold mb-6">Top 5 Artigos Mais Vendidos</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="nome" type="category" width={120} stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number, name: string) => [value, name === 'receita' ? 'Receita Total' : 'Unidades Vendidas']}
                />
                <Bar dataKey="totalVendidos" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0A0A0A] p-6 rounded-xl shadow-sm border border-[#27272A] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Faturas Recentes</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[#B4B4B4] border-b border-[#27272A]">
                <th className="pb-3 font-medium">Nº Fatura</th>
                <th className="pb-3 font-medium">Data</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {faturas.slice(0, 5).map(inv => (
                <tr key={inv.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-4 font-medium text-[#7B2CF5]">{inv.numero_fatura}</td>
                  <td className="py-4 text-[#B4B4B4]">{new Date(inv.data).toLocaleDateString('pt-AO')}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                      inv.estado === 'pago' ? 'bg-emerald-100 text-emerald-700' :
                      inv.estado === 'pendente' ? 'bg-amber-100 text-amber-700' :
                      'bg-[#18181A] text-[#B4B4B4]'
                    }`}>
                      {inv.estado === 'pago' ? 'Pago' : inv.estado === 'pendente' ? 'Pendente' : inv.estado}
                    </span>
                  </td>
                  <td className="py-4 text-right font-bold text-[#FFFFFF]">{formatKz(inv.total)}</td>
                </tr>
              ))}
              {faturas.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#B4B4B4]">Nenhuma fatura recente.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
};

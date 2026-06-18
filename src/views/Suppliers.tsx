import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Truck, Plus, Search, Edit2, X, Trash2 } from 'lucide-react';

export const Suppliers: React.FC = () => {
  const { fornecedores, addFornecedor } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFornecedor, setNewFornecedor] = useState({
    nome: '',
    nif: '',
    email: '',
    contato: '',
    endereco: ''
  });

  const filtered = fornecedores.filter(s => 
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFornecedor = async (e: React.FormEvent) => {
    e.preventDefault();
    await addFornecedor(newFornecedor);
    setIsModalOpen(false);
    setNewFornecedor({ nome: '', nif: '', email: '', contato: '', endereco: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fornecedores</h2>
          <p className="text-[#B4B4B4]">Gestão de parceiros e encomendas</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#7B2CF5] hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Novo Fornecedor
        </button>
      </div>

      <div className="bg-[#0A0A0A] rounded-xl shadow-sm border border-[#27272A] overflow-hidden">
        <div className="p-4 border-b border-[#27272A]">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Pesquisar fornecedor..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#27272A] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0A0A0A] text-[#B4B4B4]">
              <tr>
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">NIF</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Telefone</th>
                <th className="px-6 py-4 font-medium">Endereço</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(supplier => (
                <tr key={supplier.id} className="hover:bg-[#0A0A0A] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#FFFFFF]">{supplier.nome}</td>
                  <td className="px-6 py-4 text-[#B4B4B4]">{supplier.nif}</td>
                  <td className="px-6 py-4 text-[#B4B4B4]">{supplier.email}</td>
                  <td className="px-6 py-4 text-[#B4B4B4]">{supplier.contato}</td>
                  <td className="px-6 py-4 text-[#B4B4B4]">{supplier.endereco}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-[#7B2CF5] rounded-md hover:bg-[#18181A] transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adicionar Fornecedor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A0A0A] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#27272A] flex justify-between items-center bg-[#0A0A0A]">
              <h3 className="text-xl font-bold text-[#FFFFFF]">Adicionar Fornecedor</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-[#B4B4B4] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddFornecedor} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#B4B4B4]">Nome do Fornecedor *</label>
                <input 
                  required
                  type="text" 
                  value={newFornecedor.nome}
                  onChange={e => setNewFornecedor({...newFornecedor, nome: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-[#27272A] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#B4B4B4]">NIF</label>
                  <input 
                    type="text" 
                    value={newFornecedor.nif}
                    onChange={e => setNewFornecedor({...newFornecedor, nif: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-[#27272A] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#B4B4B4]">Contato / Telefone</label>
                  <input 
                    type="text" 
                    value={newFornecedor.contato}
                    onChange={e => setNewFornecedor({...newFornecedor, contato: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-[#27272A] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#B4B4B4]">Email</label>
                <input 
                  type="email" 
                  value={newFornecedor.email}
                  onChange={e => setNewFornecedor({...newFornecedor, email: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-[#27272A] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#B4B4B4]">Endereço</label>
                <input 
                  type="text" 
                  value={newFornecedor.endereco}
                  onChange={e => setNewFornecedor({...newFornecedor, endereco: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-[#27272A] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-[#27272A] mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#EF4444] hover:bg-red-500/10 rounded-lg font-medium transition-colors">
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-[#10B981] hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm">
                  Guardar Fornecedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

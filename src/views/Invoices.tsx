import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Plus, Search, Eye, X, Trash2, ScanLine, Mic, MicOff } from 'lucide-react';
import { InvoicePrintModal } from '../components/InvoicePrintModal';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';
import { Fatura } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const Invoices: React.FC = () => {
  const { faturas, clientes, produtos, addFatura, settings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setSearchTerm(transcript);
    }
  }, [transcript]);

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [previewFatura, setPreviewFatura] = useState<Fatura | null>(null);

  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<{produto_id: string, quantidade: number}[]>([]);
  const [currentProductSelector, setCurrentProductSelector] = useState('');
  
  const getClientName = (id: string) => clientes.find(c => c.id === id)?.nome || 'Cliente Desconhecido';
  const getClient = (id: string) => clientes.find(c => c.id === id);
  const getProductName = (id: string) => produtos.find(p => p.id === id)?.nome || '';
  const getProductPrice = (id: string) => produtos.find(p => p.id === id)?.preco_venda || 0;

  const currentTotal = selectedProducts.reduce((acc, item) => acc + (getProductPrice(item.produto_id) * item.quantidade), 0);

  const filtered = faturas.filter(inv => 
    inv.numero_fatura.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getClientName(inv.cliente_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatKz = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
  };

  const handleAddProduct = () => {
    if (currentProductSelector && !selectedProducts.find(p => p.produto_id === currentProductSelector)) {
      setSelectedProducts([...selectedProducts, { produto_id: currentProductSelector, quantidade: 1 }]);
      setCurrentProductSelector('');
    }
  };

  const handleScanProduct = (code: string) => {
    const foundProduct = produtos.find(p => p.codigo === code);
    if (foundProduct) {
      if (!selectedProducts.find(p => p.produto_id === foundProduct.id)) {
        setSelectedProducts([...selectedProducts, { produto_id: foundProduct.id, quantidade: 1 }]);
      }
    } else {
      alert(`Artigo não encontrado para o código: ${code}`);
    }
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    setSelectedProducts(selectedProducts.map(p => p.produto_id === id ? { ...p, quantidade: Math.max(1, qty) } : p));
  };

  const handleRemoveProduct = (id: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.produto_id !== id));
  };

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCliente || selectedProducts.length === 0) return;

    await addFatura({
      numero_fatura: `FT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      cliente_id: selectedCliente,
      data: new Date().toISOString(),
      estado: 'pendente',
      total: currentTotal,
      forma_pagamento: 'Transferência Bancária',
      itens: selectedProducts.map(sel => ({
        id: Math.random().toString(),
        fatura_id: '',
        produto_id: sel.produto_id,
        quantidade: sel.quantidade,
        preco_unitario: getProductPrice(sel.produto_id),
        subtotal: getProductPrice(sel.produto_id) * sel.quantidade
      }))
    });

    setIsModalOpen(false);
    setSelectedCliente('');
    setSelectedProducts([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Faturas</h2>
          <p className="text-[#B4B4B4]">Gestão de faturação</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#7B2CF5] hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Nova Fatura
        </button>
      </div>

      <div className="bg-[#0A0A0A] rounded-xl shadow-sm border border-[#27272A] overflow-hidden">
        <div className="p-4 border-b border-[#27272A]">
          <div className="relative max-w-sm flex">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder={isListening ? "Ouvindo..." : "Pesquisar fatura ou cliente..."}
              className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${isListening ? 'border-indigo-400 bg-indigo-50' : 'border-[#27272A]'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={isListening ? stopListening : startListening}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isListening ? 'text-[#7B2CF5]' : 'text-slate-400 hover:text-[#7B2CF5]'}`}
              title="Pesquisar por Voz"
            >
              {isListening ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0A0A0A] text-[#B4B4B4]">
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
                <tr key={inv.id} className="hover:bg-[#0A0A0A] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#7B2CF5]">{inv.numero_fatura}</td>
                  <td className="px-6 py-4 text-[#FFFFFF] font-medium">{getClientName(inv.cliente_id)}</td>
                  <td className="px-6 py-4 text-[#B4B4B4]">{new Date(inv.data).toLocaleDateString('pt-AO')}</td>
                  <td className="px-6 py-4 text-[#B4B4B4]">{inv.forma_pagamento}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                      inv.estado === 'pago' ? 'bg-emerald-100 text-emerald-700' :
                      inv.estado === 'pendente' ? 'bg-amber-100 text-amber-700' :
                      'bg-[#18181A] text-[#B4B4B4]'
                    }`}>
                      {inv.estado === 'pago' ? 'Pago' : inv.estado === 'pendente' ? 'Pendente' : inv.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#FFFFFF]">{formatKz(inv.total)}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setPreviewFatura(inv)}
                      className="p-1.5 text-slate-400 hover:text-[#7B2CF5] rounded-md hover:bg-[#18181A] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {previewFatura && (
        <InvoicePrintModal 
          fatura={previewFatura}
          cliente={getClient(previewFatura.cliente_id)}
          settings={settings}
          produtos={produtos}
          onClose={() => setPreviewFatura(null)}
        />
      )}

      {/* Modal Nova Fatura */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A0A0A] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#27272A] flex justify-between items-center bg-[#0A0A0A] shrink-0">
              <h3 className="text-xl font-bold text-[#FFFFFF]">Adicionar Fatura</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-[#B4B4B4] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleGenerateInvoice} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-6 overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#B4B4B4]">Selecionar Cliente *</label>
                  <select 
                    required
                    value={selectedCliente}
                    onChange={(e) => setSelectedCliente(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#27272A] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="" disabled>Escolha um cliente...</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 bg-[#0A0A0A] p-4 rounded-xl border border-[#27272A]">
                  <label className="text-sm font-medium text-[#B4B4B4] block">Adicionar Artigos</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select 
                      value={currentProductSelector}
                      onChange={(e) => setCurrentProductSelector(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-[#27272A] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    >
                      <option value="" disabled>Escolha um artigo...</option>
                      {produtos.map(p => (
                        <option key={p.id} value={p.id}>{p.nome} - {formatKz(p.preco_venda)}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={handleAddProduct}
                        className="bg-[#27272A] hover:bg-slate-300 text-[#B4B4B4] px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Adicionar
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsScannerOpen(true)}
                        className="bg-[#18181A] hover:bg-[#27272A] text-[#B4B4B4] px-3 py-2 border border-[#27272A] rounded-lg flex items-center transition-colors"
                        title="Escanear Código de Barras"
                      >
                        <ScanLine className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {selectedProducts.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {selectedProducts.map(sel => (
                        <div key={sel.produto_id} className="flex items-center justify-between bg-[#0A0A0A] p-3 rounded border border-[#27272A]">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{getProductName(sel.produto_id)}</p>
                            <p className="text-xs text-[#B4B4B4]">{formatKz(getProductPrice(sel.produto_id))} un.</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <input 
                              type="number"
                              min="1"
                              value={sel.quantidade}
                              onChange={(e) => handleUpdateQuantity(sel.produto_id, parseInt(e.target.value) || 1)}
                              className="w-16 px-2 py-1 text-sm border border-[#27272A] rounded text-center"
                            />
                            <p className="font-medium text-sm w-24 text-right">
                              {formatKz(getProductPrice(sel.produto_id) * sel.quantidade)}
                            </p>
                            <button 
                              type="button"
                              onClick={() => handleRemoveProduct(sel.produto_id)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-4 border-t border-[#27272A] mt-4">
                        <span className="font-medium text-[#B4B4B4]">Total a Pagar</span>
                        <span className="text-xl font-bold text-indigo-700">{formatKz(currentTotal)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 p-6 border-t border-[#27272A] bg-[#0A0A0A] shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#EF4444] hover:bg-red-500/10 rounded-lg font-medium transition-colors">
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={!selectedCliente || selectedProducts.length === 0}
                  className="bg-[#10B981] hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm">
                  Confirmar Fatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isScannerOpen && (
        <BarcodeScannerModal 
          onScan={handleScanProduct}
          onClose={() => setIsScannerOpen(false)}
        />
      )}
    </div>
  );
};

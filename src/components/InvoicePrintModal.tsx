import React, { useRef } from 'react';
import { Fatura, Cliente, Produto, StoreSettings } from '../types';
import { X, Printer, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface InvoicePrintModalProps {
  fatura: Fatura;
  cliente?: Cliente;
  settings: StoreSettings;
  produtos: Produto[];
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({ 
  fatura, 
  cliente, 
  settings, 
  produtos, 
  onClose 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const formatKz = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
  };

  const getProductName = (id: string) => produtos.find(p => p.id === id)?.nome || 'Artigo Desconhecido';

  const handlePrint = (type: 'a4' | 'thermal') => {
    document.body.classList.add(`print-${type}`);
    window.print();
    // remove timeout to ensure it cleans up right after print dialog closes
    document.body.classList.remove(`print-${type}`); 
  };

  const qrData = `Fatura: ${fatura.numero_fatura} | Total: ${formatKz(fatura.total)} | Cliente: ${cliente?.nome || 'Desconhecido'}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header Modal - Hide on Print */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0 no-print">
          <h3 className="text-xl font-bold text-slate-900">Pré-visualização da Fatura</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePrint('a4')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" /> A4
            </button>
            <button 
              onClick={() => handlePrint('thermal')}
              className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" /> Cupão Térmico
            </button>
            <button 
              onClick={() => handlePrint('a4')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" /> PDF
            </button>
            <button 
              onClick={onClose}
              className="ml-2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-md border border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100 no-print flex justify-center">
          
          <div 
            id="printable-area" 
            ref={contentRef}
            className="bg-white shadow-sm border border-slate-200 p-8 w-full max-w-2xl mx-auto"
          >
            {/* Header da Fatura */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
              <div className="space-y-1">
                {settings.logotipo && (
                  <img src={settings.logotipo} alt="Logo" className="h-16 max-w-full mb-4 object-contain" />
                )}
                <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wider">{settings.nome_loja}</h1>
                <p className="text-slate-600 text-sm">NIF: {settings.nif}</p>
                <p className="text-slate-600 text-sm">{settings.endereco}</p>
                <p className="text-slate-600 text-sm">{settings.telefone}</p>
              </div>
              <div className="text-right space-y-1">
                <h2 className="text-2xl font-bold text-purple-600">FATURA</h2>
                <p className="text-slate-900 font-medium">#{fatura.numero_fatura}</p>
                <p className="text-slate-600 text-sm">Data: {new Date(fatura.data).toLocaleDateString('pt-AO')}</p>
                <p className="text-slate-600 text-sm">Vendedor: {settings.vendedor}</p>
              </div>
            </div>

            {/* Dados do Cliente */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Faturado a:</h3>
              <p className="text-slate-900 font-bold">{cliente?.nome || 'Cliente Consumidor Final'}</p>
              {cliente?.nif && <p className="text-slate-600 text-sm">NIF: {cliente.nif}</p>}
              {cliente?.endereco && <p className="text-slate-600 text-sm">{cliente.endereco}</p>}
              {cliente?.telefone && <p className="text-slate-600 text-sm">{cliente.telefone}</p>}
            </div>

            {/* Tabela de Itens */}
            <table className="w-full mb-8 text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="py-2 px-2 text-left font-semibold">Qtd</th>
                  <th className="py-2 px-2 text-left font-semibold">Descrição</th>
                  <th className="py-2 px-2 text-right font-semibold">Preço Un.</th>
                  <th className="py-2 px-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fatura.itens && fatura.itens.length > 0 ? (
                  fatura.itens.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-2 text-slate-900">{item.quantidade}</td>
                      <td className="py-3 px-2 text-slate-900">{getProductName(item.produto_id)}</td>
                      <td className="py-3 px-2 text-right text-slate-600">{formatKz(item.preco_unitario)}</td>
                      <td className="py-3 px-2 text-right font-medium text-slate-900">{formatKz(item.subtotal)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500 italic">Itens não detalhados nesta fatura</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200">
                  <td colSpan={3} className="py-4 text-right font-bold text-slate-900">Total a Pagar</td>
                  <td className="py-4 text-right font-bold text-purple-700 text-lg">{formatKz(fatura.total)}</td>
                </tr>
              </tfoot>
            </table>

            {/* Restante Info - QR Code e Footer */}
            <div className="flex justify-between items-end mt-8 border-t border-slate-100 pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Forma de Pagamento</p>
                  <p className="text-sm text-slate-900 font-medium">{fatura.forma_pagamento}</p>
                </div>
                <div>
                  <QRCodeSVG value={qrData} size={100} level="M" includeMargin={false} />
                </div>
              </div>
              <div className="text-right space-y-1 mt-auto pb-2">
                <p className="text-xs text-slate-400">Gerenciado e desenvolvido pelo</p>
                <p className="text-sm font-bold text-slate-900">grupo 90 Creations</p>
                <p className="text-xs text-slate-400">Obrigado pela preferência!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

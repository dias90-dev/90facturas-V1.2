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
      <div className="bg-[#0A0A0A] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header Modal - Hide on Print */}
        <div className="p-4 border-b border-[#27272A] flex justify-between items-center bg-[#0A0A0A] shrink-0 no-print">
          <h3 className="text-xl font-bold text-[#FFFFFF]">Pré-visualização da Fatura</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePrint('a4')}
              className="bg-[#7B2CF5] hover:bg-purple-700 text-white px-3 py-1.5 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" /> A4
            </button>
            <button 
              onClick={() => handlePrint('thermal')}
              className="bg-slate-800 hover:bg-[#000000] text-white px-3 py-1.5 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
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
              className="ml-2 p-1.5 text-slate-400 hover:text-[#B4B4B4] transition-colors bg-[#0A0A0A] rounded-md border border-[#27272A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#18181A] no-print flex justify-center">
          
          <div 
            id="printable-area" 
            ref={contentRef}
            className="bg-[#0A0A0A] print:bg-white shadow-sm border border-[#27272A] print:border-none p-8 w-full max-w-2xl mx-auto text-[#FFFFFF] print:text-black"
          >
            {/* Header da Fatura */}
            <div className="flex justify-between items-start border-b border-[#27272A] print:border-black/20 pb-6 mb-6">
              <div className="space-y-1">
                {settings.logotipo && (
                  <img src={settings.logotipo} alt="Logo" className="h-16 max-w-full mb-4 object-contain" />
                )}
                <h1 className="text-2xl font-bold uppercase tracking-wider">{settings.nome_loja}</h1>
                <p className="text-[#B4B4B4] print:text-black/80 text-sm">NIF: {settings.nif}</p>
                <p className="text-[#B4B4B4] print:text-black/80 text-sm">{settings.endereco}</p>
                <p className="text-[#B4B4B4] print:text-black/80 text-sm">Contatos: {settings.telefone} • {settings.email}</p>
              </div>
              <div className="text-right space-y-1">
                <h2 className="text-2xl font-bold text-[#7B2CF5]">FATURA</h2>
                <p className="font-medium">#{fatura.numero_fatura}</p>
                <p className="text-[#B4B4B4] print:text-black/80 text-sm">Data: {new Date(fatura.data).toLocaleDateString('pt-AO')} {new Date(fatura.data).toLocaleTimeString('pt-AO')}</p>
                <p className="text-[#B4B4B4] print:text-black/80 text-sm">Vendedor: {settings.vendedor}</p>
              </div>
            </div>

            {/* Dados do Cliente */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-[#B4B4B4] print:text-black/60 uppercase tracking-wider mb-2">Faturado a:</h3>
              <p className="font-bold">{cliente?.nome || 'Cliente Consumidor Final'}</p>
              {cliente?.nif && <p className="text-[#B4B4B4] print:text-black/80 text-sm">NIF: {cliente.nif}</p>}
              {cliente?.endereco && <p className="text-[#B4B4B4] print:text-black/80 text-sm">{cliente.endereco}</p>}
              {cliente?.telefone && <p className="text-[#B4B4B4] print:text-black/80 text-sm">{cliente.telefone}</p>}
            </div>

            {/* Tabela de Itens */}
            <table className="w-full mb-8 text-sm">
              <thead className="bg-[#18181A] print:bg-gray-100 text-[#B4B4B4] print:text-black">
                <tr>
                  <th className="py-2 px-2 text-left font-semibold">Qtd</th>
                  <th className="py-2 px-2 text-left font-semibold">Descrição</th>
                  <th className="py-2 px-2 text-right font-semibold">Preço Un.</th>
                  <th className="py-2 px-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A] print:divide-gray-200">
                {fatura.itens && fatura.itens.length > 0 ? (
                  fatura.itens.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-2">{item.quantidade}</td>
                      <td className="py-3 px-2">{getProductName(item.produto_id)}</td>
                      <td className="py-3 px-2 text-right text-[#B4B4B4] print:text-black">{formatKz(item.preco_unitario)}</td>
                      <td className="py-3 px-2 text-right font-medium">{formatKz(item.subtotal)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-[#B4B4B4] print:text-gray-500 italic">Itens não detalhados nesta fatura</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#27272A] print:border-black">
                  <td colSpan={3} className="py-4 text-right font-bold">Total a Pagar</td>
                  <td className="py-4 text-right font-bold text-[#7B2CF5] print:text-black text-lg">{formatKz(fatura.total)}</td>
                </tr>
              </tfoot>
            </table>

            {/* Restante Info - QR Code e Footer */}
            <div className="flex justify-between items-end mt-8 border-t border-[#27272A] print:border-black/20 pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-[#B4B4B4] print:text-black/60 uppercase">Forma de Pagamento</p>
                  <p className="text-sm font-medium">{fatura.forma_pagamento}</p>
                </div>
                <div>
                  <QRCodeSVG value={qrData} size={100} level="M" includeMargin={false} />
                </div>
              </div>
              <div className="text-right space-y-1 mt-auto pb-2">
                <p className="text-xs font-bold text-[#B4B4B4] print:text-black/80">Obrigado pela preferência!</p>
                <p className="text-xs text-[#B4B4B4] print:text-black/60 mt-2 block">Documento processado por GESTOKE • Gestão Profissional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer } from 'lucide-react';
import { Produto } from '../types';

interface ProductQRCodeModalProps {
  produto: Produto;
  onClose: () => void;
}

export const ProductQRCodeModal: React.FC<ProductQRCodeModalProps> = ({ produto, onClose }) => {
  const formatKz = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 no-print">
          <h3 className="text-xl font-bold text-slate-900">Código QR do Artigo</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="p-1.5 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-md border border-indigo-200"
              title="Imprimir"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-md border border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-8 flex flex-col items-center print:p-0 print:border-none">
          <div className="bg-white p-4 border border-slate-200 rounded-xl mb-6 shadow-sm print:border-none print:shadow-none">
            <QRCodeSVG value={produto.codigo} size={200} level="M" />
          </div>
          
          <div className="text-center space-y-2 w-full">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Código</p>
            <p className="text-xl font-mono bg-slate-100 py-2 rounded-lg text-slate-800 tracking-widest">{produto.codigo}</p>
            
            <h2 className="text-2xl font-bold mt-4 mb-1">{produto.nome}</h2>
            <p className="text-lg font-bold text-indigo-600">{formatKz(produto.preco_venda)}</p>
            <p className="text-sm text-slate-500">Stock atual: {produto.quantidade} un</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Plus, Search, Edit2, Trash2, X, AlertTriangle, Download, Upload, ScanLine, QrCode, Mic, MicOff } from 'lucide-react';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';
import { ProductQRCodeModal } from '../components/ProductQRCodeModal';
import { Produto } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const Inventory: React.FC = () => {
  const { produtos, deleteProduto, addProduto } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();

  React.useEffect(() => {
    if (transcript) {
      setSearchTerm(transcript);
    }
  }, [transcript]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [qrProduct, setQrProduct] = useState<Produto | null>(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [newProduto, setNewProduto] = useState({
    nome: '',
    codigo: '',
    preco_venda: 0,
    preco_custo: 0,
    quantidade: 0,
    categoria: ''
  });

  const lowStockThreshold = 10;
  const lowStockCount = produtos.filter(p => p.quantidade <= lowStockThreshold).length;

  const filtered = produtos.filter(p => {
    const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = showLowStockOnly ? p.quantidade <= lowStockThreshold : true;
    return matchesSearch && matchesLowStock;
  });

  const formatKz = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Nome', 'Código', 'Preço Custo', 'Preço Venda', 'Quantidade', 'Categoria', 'Data Entrada'];
    const csvContent = [
      headers.join(','),
      ...produtos.map(p => 
        [p.id, `"${p.nome}"`, `"${p.codigo}"`, p.preco_custo, p.preco_venda, p.quantidade, `"${p.categoria}"`, p.data_entrada].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inventario_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l);
      
      let importedCount = 0;
      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        // Simple CSV parse handling quotes roughly
        const line = lines[i];
        const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (parts && parts.length >= 7) {
          const nome = parts[1].replace(/"/g, '');
          const codigo = parts[2].replace(/"/g, '');
          const preco_custo = Number(parts[3]) || 0;
          const preco_venda = Number(parts[4]) || 0;
          const quantidade = Number(parts[5]) || 0;
          const categoria = parts[6].replace(/"/g, '');
          
          await addProduto({
            nome,
            codigo,
            preco_custo,
            preco_venda,
            quantidade,
            categoria,
            data_entrada: new Date().toISOString()
          });
          importedCount++;
        }
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      alert(`Importação concluída: ${importedCount} artigos adicionados.`);
    };
    reader.readAsText(file);
  };

  const handleAddProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduto({
      ...newProduto,
      data_entrada: new Date().toISOString()
    });
    setIsModalOpen(false);
    setNewProduto({
      nome: '',
      codigo: '',
      preco_venda: 0,
      preco_custo: 0,
      quantidade: 0,
      categoria: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventário</h2>
          <p className="text-slate-500">Gestão de stock e artigos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {lowStockCount > 0 && (
            <button 
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${showLowStockOnly ? 'bg-red-600 text-white shadow-md shadow-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'}`}
            >
              <AlertTriangle className="w-5 h-5" /> 
              {lowStockCount} Stock Baixo
            </button>
          )}
          <button 
            onClick={exportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Download className="w-5 h-5" /> Exportar CSV
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Upload className="w-5 h-5" /> Importar CSV
          </button>
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleCSVImport} 
            className="hidden" 
          />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" /> Adicionar Artigo
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text"
                placeholder={isListening ? "Ouvindo..." : "Pesquisar por nome ou Código..."}
                className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors ${isListening ? 'border-purple-400 bg-purple-50' : 'border-slate-200'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                onClick={isListening ? stopListening : startListening}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isListening ? 'text-purple-600' : 'text-slate-400 hover:text-purple-600'}`}
                title="Pesquisar por Voz"
              >
                {isListening ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
              </button>
            </div>
            <button 
              onClick={() => setIsScannerOpen(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center gap-2 transition-colors border border-slate-200"
              title="Escanear Código de Barras"
            >
              <ScanLine className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Artigo</th>
                <th className="px-6 py-4 font-medium">Código</th>
                <th className="px-6 py-4 font-medium">Preço Venda</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(product => {
                const isLow = product.quantidade <= 10;
                return (
                  <tr key={product.id} className={`transition-colors ${isLow ? 'bg-red-50/50 hover:bg-red-50' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
                          <Package className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-slate-900">{product.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{product.codigo}</td>
                    <td className="px-6 py-4 font-medium">{formatKz(product.preco_venda)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isLow ? 'text-red-700' : 'text-slate-900'}`}>
                          {product.quantidade}
                        </span>
                        {isLow && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isLow ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Stock Baixo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Adequado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setQrProduct(product)}
                          className="p-1.5 text-slate-400 hover:text-purple-600 rounded-md hover:bg-slate-100 transition-colors"
                          title="Ver Código QR"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-purple-600 rounded-md hover:bg-slate-100 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteProduto(product.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhum artigo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adicionar Produto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Novo Artigo</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddProduto} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-sm font-medium text-slate-700">Nome do Artigo *</label>
                  <input 
                    required
                    type="text" 
                    value={newProduto.nome}
                    onChange={e => setNewProduto({...newProduto, nome: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="ex: Monitor 27'' IPS"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Código/SKU *</label>
                  <input 
                    required
                    type="text" 
                    value={newProduto.codigo}
                    onChange={e => setNewProduto({...newProduto, codigo: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="ex: MON-27-IPS"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Categoria</label>
                  <input 
                    type="text" 
                    value={newProduto.categoria}
                    onChange={e => setNewProduto({...newProduto, categoria: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="ex: Eletrónicos"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Preço de Custo (AOA) *</label>
                  <input 
                    required
                    type="number" 
                    value={newProduto.preco_custo || ''}
                    onChange={e => setNewProduto({...newProduto, preco_custo: Number(e.target.value)})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Preço de Venda (AOA) *</label>
                  <input 
                    required
                    type="number" 
                    value={newProduto.preco_venda || ''}
                    onChange={e => setNewProduto({...newProduto, preco_venda: Number(e.target.value)})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-sm font-medium text-slate-700">Quantidade Inicial *</label>
                  <input 
                    required
                    type="number" 
                    value={newProduto.quantidade || ''}
                    onChange={e => setNewProduto({...newProduto, quantidade: Number(e.target.value)})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                  Guardar Artigo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isScannerOpen && (
        <BarcodeScannerModal 
          onScan={(text) => setSearchTerm(text)}
          onClose={() => setIsScannerOpen(false)}
        />
      )}

      {qrProduct && (
        <ProductQRCodeModal 
          produto={qrProduct}
          onClose={() => setQrProduct(null)}
        />
      )}
    </div>
  );
};

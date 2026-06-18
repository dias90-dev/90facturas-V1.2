import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Plus, Search, Edit2, Trash2, X, AlertTriangle, Download, Upload, ScanLine, QrCode, Mic, MicOff, Printer } from 'lucide-react';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';
import { ProductQRCodeModal } from '../components/ProductQRCodeModal';
import { Produto } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const Inventory: React.FC = () => {
  const { produtos, deleteProduto, addProduto, settings } = useApp();
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
  const [showLowEstoqueOnly, setShowLowEstoqueOnly] = useState(false);
  const [newProduto, setNewProduto] = useState({
    nome: '',
    codigo: '',
    preco_venda: 0,
    preco_custo: 0,
    quantidade: 0,
    categoria: ''
  });

  const lowEstoqueThreshold = settings?.limite_estoque || 10;
  const lowEstoqueCount = produtos.filter(p => p.quantidade <= lowEstoqueThreshold).length;

  const filtered = produtos.filter(p => {
    const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowEstoque = showLowEstoqueOnly ? p.quantidade <= lowEstoqueThreshold : true;
    return matchesSearch && matchesLowEstoque;
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
          <p className="text-[#B4B4B4]">Gestão de estoque e artigos</p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          {lowEstoqueCount > 0 && (
            <button 
              onClick={() => setShowLowEstoqueOnly(!showLowEstoqueOnly)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${showLowEstoqueOnly ? 'bg-[#F59E0B] text-white shadow-md shadow-[#F59E0B]/20' : 'bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20 border border-[#F59E0B]/30'}`}
            >
              <AlertTriangle className="w-5 h-5" /> 
              {lowEstoqueCount} Estoque Baixo
            </button>
          )}
          <button 
            onClick={() => window.print()}
            className="bg-[#18181A] hover:bg-[#27272A] text-[#B4B4B4] px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Printer className="w-5 h-5" /> Imprimir
          </button>
          <button 
            onClick={exportCSV}
            className="bg-[#18181A] hover:bg-[#27272A] text-[#B4B4B4] px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Download className="w-5 h-5" /> Exportar CSV
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#18181A] hover:bg-[#27272A] text-[#B4B4B4] px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
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
            className="bg-[#7B2CF5] hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" /> Adicionar Artigo
          </button>
        </div>
      </div>

      <div className="bg-[#18181A] rounded-xl shadow-sm border border-[#27272A] overflow-hidden flex flex-col print:border-none print:shadow-none print:bg-transparent">
        <div className="p-4 border-b border-[#27272A] flex gap-4 print:hidden">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#B4B4B4]" />
            <div className="flex w-full relative">
              <input 
                type="text" 
                placeholder="Pesquisar artigos por nome, código ou categoria..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-[#27272A] bg-[#0A0A0A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2CF5] focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B4B4B4] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <button 
            onClick={() => setIsScannerOpen(true)}
            className="bg-[#27272A] hover:bg-[#3f3f46] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            title="Scan Barcode"
          >
            <ScanLine className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0A0A0A] text-[#B4B4B4]">
              <tr>
                <th className="px-6 py-4 font-medium">Artigo</th>
                <th className="px-6 py-4 font-medium">Código</th>
                <th className="px-6 py-4 font-medium">Categoria</th>
                <th className="px-6 py-4 font-medium">Estoque</th>
                <th className="px-6 py-4 font-medium">Preço Venda</th>
                <th className="px-6 py-4 font-medium">Preço Custo</th>
                <th className="px-6 py-4 font-medium text-right print:hidden">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {filtered.map(product => {
                const isLow = product.quantidade <= lowStockThreshold;
                return (
                  <tr key={product.id} className={`transition-colors text-[#FFFFFF] ${isLow ? 'bg-[#F59E0B]/5 hover:bg-[#F59E0B]/10' : 'hover:bg-[#27272A]/50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#27272A] flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-[#B4B4B4]" />
                        </div>
                        <span className="font-medium text-[15px]">{product.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#B4B4B4]">{product.codigo}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#27272A] text-[#B4B4B4]">
                        {product.categoria || 'Geral'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isLow ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F59E0B]/20 text-[#F59E0B] gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Estoque Baixo ({product.quantidade})
                        </span>
                      ) : (
                        <span className="font-medium">{product.quantidade} un</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#10B981]">{formatKz(product.preco_venda)}</td>
                    <td className="px-6 py-4 text-[#B4B4B4]">{formatKz(product.preco_custo)}</td>
                    <td className="px-6 py-4 text-right print:hidden">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setQrProduct(product)}
                          className="p-2 text-[#B4B4B4] hover:text-white hover:bg-[#27272A] rounded-lg transition-colors"
                          title="Gerar QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-[#B4B4B4] hover:text-[#7B2CF5] hover:bg-[#7B2CF5]/10 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteProduto(product.id)}
                          className="p-2 text-[#B4B4B4] hover:text-[#EF4444] hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Excluir"
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
                  <td colSpan={7} className="px-6 py-12 text-center text-[#B4B4B4]">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="w-12 h-12 mb-4 opacity-20 text-white" />
                      <p className="text-lg font-medium text-white mb-1">Nenhum artigo encontrado</p>
                      <p className="text-sm">Tente ajustar a pesquisa ou adicionar um novo.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A0A0A] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-[#27272A]">
            <div className="p-6 border-b border-[#27272A] flex justify-between items-center bg-[#18181A]">
              <h3 className="text-xl font-bold text-white">Adicionar Artigo</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#B4B4B4] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddProduto} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#B4B4B4] mb-1">Nome do Produto</label>
                <input 
                  type="text" 
                  required
                  value={newProduto.nome}
                  onChange={(e) => setNewProduto({...newProduto, nome: e.target.value})}
                  className="w-full px-3 py-2 bg-[#18181A] border border-[#27272A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2CF5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#B4B4B4] mb-1">Código</label>
                  <input 
                    type="text" 
                    required
                    value={newProduto.codigo}
                    onChange={(e) => setNewProduto({...newProduto, codigo: e.target.value})}
                    className="w-full px-3 py-2 bg-[#18181A] border border-[#27272A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2CF5]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#B4B4B4] mb-1">Categoria</label>
                  <input 
                    type="text" 
                    required
                    value={newProduto.categoria}
                    onChange={(e) => setNewProduto({...newProduto, categoria: e.target.value})}
                    className="w-full px-3 py-2 bg-[#18181A] border border-[#27272A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2CF5]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#B4B4B4] mb-1">Preço Compra</label>
                  <input 
                    type="number" 
                    required min="0" step="0.01"
                    value={newProduto.preco_custo || ''}
                    onChange={(e) => setNewProduto({...newProduto, preco_custo: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-[#18181A] border border-[#27272A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2CF5]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#B4B4B4] mb-1">Preço Venda</label>
                  <input 
                    type="number" 
                    required min="0" step="0.01"
                    value={newProduto.preco_venda || ''}
                    onChange={(e) => setNewProduto({...newProduto, preco_venda: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-[#18181A] border border-[#27272A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2CF5]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#B4B4B4] mb-1">Quantidade Inicial</label>
                <input 
                  type="number" 
                  required min="0"
                  value={newProduto.quantidade || ''}
                  onChange={(e) => setNewProduto({...newProduto, quantidade: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-[#18181A] border border-[#27272A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2CF5]"
                />
              </div>
              <div className="flex justify-end pt-4 gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#EF4444] hover:bg-red-500/10 rounded-lg font-medium transition-colors border border-transparent"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Save className="w-5 h-5" /> Guardar
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

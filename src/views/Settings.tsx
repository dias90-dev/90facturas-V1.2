import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings, exportBackup } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSettings(localSettings);
    alert('Configurações salvas com sucesso!');
  };

  const currentDate = new Date().toLocaleDateString('pt-AO', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <div className="-m-4 md:-m-8 p-4 md:p-8 bg-[#0B1120] text-slate-300 min-h-[calc(100vh-4rem)] md:min-h-screen font-sans">
      {/* Top Header Section */}
      <div className="flex justify-between items-start mb-8 pt-4 md:pt-0">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Configurações</h2>
          <p className="text-slate-400 mt-1">Logotipo, dados e preferências</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-lg shadow-purple-500/20">
          {currentDate}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Logotipo + Dados) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Logo Card */}
          <div className="bg-[#131B2F] rounded-2xl p-6 shadow-xl shadow-black/20 border border-slate-800/50">
            <div className="border-2 border-dashed border-slate-700/70 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-slate-800/30 cursor-pointer">
              {localSettings.logotipo ? (
                <img src={localSettings.logotipo} alt="Logo Preview" className="h-20 object-contain mb-4" />
              ) : (
                <div className="w-16 h-16 mb-4 relative">
                  <div className="absolute inset-0 bg-yellow-500 rounded-sm"></div>
                  <div className="absolute inset-1 bg-white flex items-center justify-center flex-col">
                     <div className="w-8 h-8 rounded-full bg-purple-500 absolute -top-2 -right-2"></div>
                     <div className="w-full h-1/2 bg-green-500 absolute bottom-0 rounded-b-sm"></div>
                  </div>
                </div>
              )}
              <h3 className="text-slate-300 font-medium text-lg leading-snug">
                Clique para<br/>carregar o<br/>logotipo
              </h3>
              <p className="text-slate-500 text-sm mt-3">
                PNG, JPG ou<br/>SVG —<br/>recomendado<br/>200×80px
              </p>
            </div>
            
            <div className="mt-6 flex justify-start">
              <button 
                type="button"
                onClick={() => setLocalSettings({...localSettings, logotipo: ''})}
                className="bg-[#1E293B] hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors border border-slate-700/50"
              >
                <Trash2 className="w-4 h-4 text-purple-400" />
                Remover Logo
              </button>
            </div>
          </div>

          {/* Business Data Card */}
          <div className="bg-[#131B2F] rounded-2xl p-6 shadow-xl shadow-black/20 border border-slate-800/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
              <h3 className="text-xl font-bold text-white">Dados do<br/>Negócio</h3>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 tracking-widest uppercase">Nome do Negócio</label>
                <input 
                  type="text" 
                  value={localSettings.nome_loja}
                  onChange={e => setLocalSettings({...localSettings, nome_loja: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0B1120] text-white rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                  placeholder="Nome da sua loja"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 tracking-widest uppercase">NIF / NIPC</label>
                <input 
                  type="text" 
                  value={localSettings.nif}
                  onChange={e => setLocalSettings({...localSettings, nif: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0B1120] text-white rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                  placeholder="Número fiscal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 tracking-widest uppercase">Telefone</label>
                <input 
                  type="text" 
                  value={localSettings.telefone}
                  onChange={e => setLocalSettings({...localSettings, telefone: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0B1120] text-white rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                  placeholder="Seu telefone"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 tracking-widest uppercase">Email (Vendedor)</label>
                <input 
                  type="text" 
                  value={localSettings.vendedor}
                  onChange={e => setLocalSettings({...localSettings, vendedor: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0B1120] text-white rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 tracking-widest uppercase">Endereço</label>
                <input 
                  type="text" 
                  value={localSettings.endereco}
                  onChange={e => setLocalSettings({...localSettings, endereco: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0B1120] text-white rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                  placeholder="Endereço físico"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Guardar<br className="hidden sm:block" />Configurações
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Column (Message + Preview) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#131B2F] rounded-2xl p-6 shadow-xl shadow-black/20 border border-slate-800/50">
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Esta mensagem aparecerá automaticamente em todas as faturas.
            </p>
            <button 
              onClick={() => handleSave()}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
          </div>

          <div className="bg-[#131B2F] rounded-2xl p-6 shadow-xl shadow-black/20 border border-slate-800/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
              <h3 className="text-xl font-bold text-white">Prévia da Fatura</h3>
            </div>
            
            <div className="bg-[#192136] rounded-xl p-5 border border-slate-800">
               <p className="text-slate-400 text-sm leading-relaxed text-center mb-4">
                 As configurações acima serão aplicadas em todas as faturas emitidas.
               </p>
               <p className="text-slate-400 text-sm text-center leading-relaxed">
                 O rodapé incluirá sempre:<br/>
                 <span className="text-white font-bold">
                   Gerado pelo Sistema de Gestão — 90 Creations
                 </span>
               </p>
            </div>
          </div>
          
          {/* Include Download Backup Button here since it was removed from header */}
          <div className="mt-8 flex justify-center lg:justify-end">
            <button 
               onClick={exportBackup}
               className="text-slate-500 hover:text-purple-400 text-sm flex items-center gap-2 transition-colors"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
               Exportar Backup JSON
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};


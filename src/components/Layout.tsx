import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Truck, 
  FileText, 
  BarChart3, 
  Settings as SettingsIcon,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useApp();

  const navItems = [
    { id: 'dashboard', label: t('menu.dashboard'), icon: LayoutDashboard },
    { id: 'inventory', label: t('menu.inventory'), icon: Package },
    { id: 'invoices', label: t('menu.invoices'), icon: FileText },
    { id: 'clients', label: t('menu.clients'), icon: Users },
    { id: 'suppliers', label: t('menu.suppliers'), icon: Truck },
    { id: 'reports', label: t('menu.reports'), icon: BarChart3 },
    { id: 'settings', label: t('menu.settings'), icon: SettingsIcon },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-[#FFFFFF] font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#000000] text-[#B4B4B4] transition-all duration-300">
        <div className="p-6 flex items-center justify-center h-24">
          {settings.logotipo ? (
            <img src={settings.logotipo} alt={settings.nome_loja} className="max-h-full max-w-full object-contain" />
          ) : (
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Package className="h-6 w-6 text-[#7B2CF5]" />
              GESTOKE
            </h1>
          )}
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#7B2CF5] text-white' 
                    : 'text-[#B4B4B4] hover:bg-[#27272A] hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#27272A] bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#7B2CF5]/20 flex items-center justify-center text-[#7B2CF5] font-bold">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">{t('common.adminName')}</span>
              <span className="text-xs text-[#B4B4B4]">{t('common.fullAccess')}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#000000] text-white fixed top-0 w-full z-20">
        <div className="flex items-center gap-2 font-bold text-xl h-8">
          {settings.logotipo ? (
            <img src={settings.logotipo} alt={settings.nome_loja} className="max-h-full max-w-full object-contain" />
          ) : (
            <>
              <Package className="h-6 w-6 text-[#7B2CF5]" />
              GESTOKE
            </>
          )}
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-[#000000] text-white pt-20 px-4 flex flex-col h-full space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg text-lg ${
                  activeView === item.id 
                    ? 'bg-[#7B2CF5] text-white' 
                    : 'text-[#B4B4B4]'
                }`}
              >
                <Icon className="h-6 w-6" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

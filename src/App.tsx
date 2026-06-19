/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { Inventory } from './views/Inventory';
import { Invoices } from './views/Invoices';
import { Clients } from './views/Clients';
import { Suppliers } from './views/Suppliers';
import { Reports } from './views/Reports';
import { Settings } from './views/Settings';
import { Package, LogIn, Lock, User } from 'lucide-react';

function Splash() {
  return (
    <div className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center z-50 transition-opacity duration-500">
      <div className="animate-pulse flex flex-col items-center">
        <Package className="h-16 w-16 text-[#7B2CF5] mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">GESTOKE</h1>
        <p className="text-[#B4B4B4] tracking-widest text-sm">GESTÃO PROFISSIONAL</p>
      </div>
    </div>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { settings } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = settings.senha_admin || '123456';
    if (username === 'admin' && password === correctPassword) {
      onLogin();
    } else {
      setError('Credenciais inválidas. Verifique os dados fornecidos.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Package className="mx-auto h-12 w-12 text-[#7B2CF5]" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Entrar no GESTOKE
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#18181A] py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-[#27272A]">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-[#B4B4B4]">
                Usuário
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#B4B4B4]" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#0A0A0A] border-[#27272A] text-white block w-full pl-10 sm:text-sm border rounded-lg py-3 focus:ring-[#7B2CF5] focus:border-[#7B2CF5] outline-none transition-colors"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B4B4B4]">
                Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#B4B4B4]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#0A0A0A] border-[#27272A] text-white block w-full pl-10 sm:text-sm border rounded-lg py-3 focus:ring-[#7B2CF5] focus:border-[#7B2CF5] outline-none transition-colors"
                  placeholder="••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-[#EF4444] text-sm text-center bg-red-500/10 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#7B2CF5] hover:bg-[#7B2CF5]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7B2CF5] transition-colors"
              >
                Acessar Sistema
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Splash screen timer
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <Splash />;
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'invoices': return <Invoices />;
      case 'clients': return <Clients />;
      case 'suppliers': return <Suppliers />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeView={activeView} onNavigate={setActiveView}>
      {renderView()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { Inventory } from './views/Inventory';
import { Invoices } from './views/Invoices';
import { Clients } from './views/Clients';
import { Suppliers } from './views/Suppliers';
import { Reports } from './views/Reports';

function MainApp() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'invoices': return <Invoices />;
      case 'clients': return <Clients />;
      case 'suppliers': return <Suppliers />;
      case 'reports': return <Reports />;
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

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Farmers from './pages/Farmers';
import Schemes from './pages/Schemes';
import AIKB from './pages/AIKB';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Simulated connection flags
  const [dbStatus, setDbStatus] = useState('Simulation'); // Connected vs Simulation
  const [aiStatus, setAiStatus] = useState('Offline Agent'); // Active Agent vs Offline Agent

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'farmers':
        return <Farmers />;
      case 'schemes':
        return <Schemes />;
      case 'aikb':
        return <AIKB />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Ecosystem Overview';
      case 'farmers': return 'Farmer Digital Twins';
      case 'schemes': return 'Government Scheme Manager';
      case 'aikb': return 'RAG Knowledge Base & Embeddings';
      default: return 'ApnaKissan Admin';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        dbStatus={dbStatus} 
        aiStatus={aiStatus} 
      />
      <div style={{ marginLeft: '308px', padding: '40px', flexGrow: 1, minHeight: '100vh', boxSizing: 'border-box' }}>
        <Header 
          title={getPageTitle()} 
          dbStatus={dbStatus} 
          aiStatus={aiStatus} 
        />
        {renderContent()}
      </div>
    </div>
  );
}

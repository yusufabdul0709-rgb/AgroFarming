import React from 'react';
import { Sprout, BarChart2, Users, Landmark, Database, HelpCircle, HardDrive, Cpu } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, dbStatus, aiStatus }) {
  return (
    <div 
      style={{ 
        width: '260px', 
        background: 'rgba(10, 20, 10, 0.8)', 
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(129, 199, 132, 0.1)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed',
        height: 'calc(100vh - 48px)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sprout size={24} style={{ color: 'white' }} />
          </div>
          <div>
            <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px' }}>ApnaKissan</span>
            <p style={{ margin: 0, fontSize: '10px', color: '#81C784', fontWeight: '600' }}>ADMIN PORTAL</p>
          </div>
        </div>

        {/* Nav Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '14px',
              border: 'none',
              background: activeTab === 'dashboard' ? 'rgba(76, 175, 80, 0.15)' : 'transparent',
              color: activeTab === 'dashboard' ? '#81C784' : '#c2c9bf',
              fontWeight: activeTab === 'dashboard' ? '600' : '400',
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <BarChart2 size={18} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('farmers')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '14px',
              border: 'none',
              background: activeTab === 'farmers' ? 'rgba(76, 175, 80, 0.15)' : 'transparent',
              color: activeTab === 'farmers' ? '#81C784' : '#c2c9bf',
              fontWeight: activeTab === 'farmers' ? '600' : '400',
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <Users size={18} /> Digital Twins
          </button>
          <button 
            onClick={() => setActiveTab('schemes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '14px',
              border: 'none',
              background: activeTab === 'schemes' ? 'rgba(76, 175, 80, 0.15)' : 'transparent',
              color: activeTab === 'schemes' ? '#81C784' : '#c2c9bf',
              fontWeight: activeTab === 'schemes' ? '600' : '400',
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <Landmark size={18} /> Schemes Publisher
          </button>
          <button 
            onClick={() => setActiveTab('aikb')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '14px',
              border: 'none',
              background: activeTab === 'aikb' ? 'rgba(76, 175, 80, 0.15)' : 'transparent',
              color: activeTab === 'aikb' ? '#81C784' : '#c2c9bf',
              fontWeight: activeTab === 'aikb' ? '600' : '400',
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <Database size={18} /> RAG Knowledge Base
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '11px', color: '#c2c9bf' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HardDrive size={14} style={{ color: dbStatus === 'Simulation' ? '#F9A825' : '#4CAF50' }} />
          <span>Database: <b>{dbStatus}</b></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={14} style={{ color: aiStatus.includes('Offline') ? '#F9A825' : '#4CAF50' }} />
          <span>AI LLM: <b>{aiStatus}</b></span>
        </div>
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>v1.0.0</span>
          <HelpCircle size={14} style={{ cursor: 'pointer' }} />
        </div>
      </div>
    </div>
  );
}

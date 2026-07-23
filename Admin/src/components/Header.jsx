import React from 'react';
import { Cpu, HardDrive, UserCheck } from 'lucide-react';

export default function Header({ title, dbStatus, aiStatus }) {
  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        marginBottom: '20px'
      }}
    >
      <div>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#81C784', fontWeight: '800' }}>Admin Workspace</span>
        <h1 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '800' }}>{title}</h1>
      </div>
      
      {/* Quick Status indicators */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'rgba(255,255,255,0.02)', padding: '6px 12px', borderRadius: '10px' }}>
          <HardDrive size={14} color={dbStatus === 'Simulation' ? '#F9A825' : '#4CAF50'} />
          <span>DB: <b>{dbStatus}</b></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'rgba(255,255,255,0.02)', padding: '6px 12px', borderRadius: '10px' }}>
          <Cpu size={14} color={aiStatus.includes('Offline') ? '#F9A825' : '#4CAF50'} />
          <span>LLM: <b>{aiStatus}</b></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'rgba(76, 175, 80, 0.15)', padding: '6px 12px', borderRadius: '10px', color: '#81C784' }}>
          <UserCheck size={14} />
          <span>Administrator</span>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function CropChart() {
  const cropDistribution = [
    { name: 'Paddy', percentage: 48, color: '#4CAF50', acres: '1,240 acres' },
    { name: 'Wheat', percentage: 32, color: '#81C784', acres: '830 acres' },
    { name: 'Maize', percentage: 12, color: '#F9A825', acres: '310 acres' },
    { name: 'Tomato', percentage: 8, color: '#FF7043', acres: '200 acres' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {cropDistribution.map((crop) => (
        <div key={crop.name}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
            <span style={{ fontWeight: '500' }}>{crop.name}</span>
            <span style={{ color: '#c2c9bf' }}>{crop.acres} ({crop.percentage}%)</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${crop.percentage}%`, backgroundColor: crop.color, borderRadius: '10px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

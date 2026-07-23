import React from 'react';

export default function PriceChart() {
  const priceTrends = [
    { crop: 'Wheat', price: '2,275', change: '+1.8%', up: true, points: '10,40 30,35 50,38 70,25 90,20 110,12' },
    { crop: 'Paddy', price: '2,183', change: '+2.4%', up: true, points: '10,38 30,30 50,32 70,22 90,18 110,10' },
    { crop: 'Maize', price: '2,090', change: '-0.8%', up: false, points: '10,15 30,18 50,22 70,28 90,25 110,32' },
    { crop: 'Tomato', price: '1,800', change: 'Volatile', up: null, points: '10,30 30,10 50,42 70,18 90,38 110,25' }
  ];

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#c2c9bf' }}>
          <th style={{ padding: '12px 8px' }}>Crop</th>
          <th style={{ padding: '12px 8px' }}>Mandi Price (Qntl)</th>
          <th style={{ padding: '12px 8px' }}>Weekly Trend</th>
          <th style={{ padding: '12px 8px', textAlign: 'center' }}>Sparkline</th>
        </tr>
      </thead>
      <tbody>
        {priceTrends.map((trend) => (
          <tr key={trend.crop} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <td style={{ padding: '12px 8px', fontWeight: '500' }}>{trend.crop}</td>
            <td style={{ padding: '12px 8px' }}>₹{trend.price}</td>
            <td style={{ 
              padding: '12px 8px', 
              color: trend.up === true ? '#4CAF50' : trend.up === false ? '#FF7043' : '#F9A825' 
            }}>
              {trend.up === true ? '▲ ' : trend.up === false ? '▼ ' : '⬦ '}
              {trend.change}
            </td>
            <td style={{ padding: '12px 8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <svg width="120" height="40" style={{ overflow: 'visible' }}>
                <polyline
                  fill="none"
                  stroke={trend.up === true ? '#4CAF50' : trend.up === false ? '#FF7043' : '#F9A825'}
                  strokeWidth="2"
                  points={trend.points}
                />
              </svg>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

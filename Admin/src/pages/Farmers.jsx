import React, { useState } from 'react';
import { User, Sprout, MapPin, Eye, Compass, CloudRain, Shield } from 'lucide-react';

export default function Farmers() {
  const [farmers, setFarmers] = useState([
    {
      id: 'mock-user-111',
      name: 'Rajesh Kumar',
      phone: '9876543210',
      location: 'Milak, Rampur (UP)',
      gps: '28.6139° N, 77.2090° E',
      landArea: '3.5 Acres',
      soilType: 'Alluvial Loamy',
      crop: 'Paddy',
      waterStress: 'Low',
      twinName: 'Greenacres Ridge',
      metrics: { pH: 6.7, moisture: '52%', N: '125 kg/ha', P: '42 kg/ha', K: '215 kg/ha' },
      growth: 38
    },
    {
      id: 'mock-user-112',
      name: 'Bhagya Rao',
      phone: '9123456789',
      location: 'Kurnool District (AP)',
      gps: '15.8281° N, 78.0373° E',
      landArea: '5.2 Acres',
      soilType: 'Red Soil',
      crop: 'Cotton',
      waterStress: 'Medium',
      twinName: 'Deccan Crest',
      metrics: { pH: 6.2, moisture: '35%', N: '105 kg/ha', P: '30 kg/ha', K: '180 kg/ha' },
      growth: 65
    },
    {
      id: 'mock-user-113',
      name: 'Gurpreet Singh',
      phone: '9005009876',
      location: 'Bathinda Mandi (PB)',
      gps: '30.2110° N, 74.9454° E',
      landArea: '8.0 Acres',
      soilType: 'Sandy Loam',
      crop: 'Wheat',
      waterStress: 'Low',
      twinName: 'Malwa Plains',
      metrics: { pH: 7.2, moisture: '60%', N: '140 kg/ha', P: '50 kg/ha', K: '240 kg/ha' },
      growth: 15
    }
  ]);

  const [selectedFarmer, setSelectedFarmer] = useState(farmers[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', background: 'linear-gradient(90deg, #fff, #81C784)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Farmer Digital Twins
        </h1>
        <p style={{ margin: '4px 0 0 0', color: '#c2c9bf', fontSize: '14px' }}>Analyze land boundary GIS parameters and simulate cultivation scenarios</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Side: Farmers Directory */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Active Farmers</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {farmers.map(f => (
              <div 
                key={f.id} 
                onClick={() => setSelectedFarmer(f)}
                style={{ 
                  padding: '16px', 
                  borderRadius: '16px', 
                  background: selectedFarmer.id === f.id ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255,255,255,0.02)', 
                  border: selectedFarmer.id === f.id ? '1px solid var(--secondary-green)' : '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '700', fontSize: '14px' }}>{f.name}</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: '#81C784' }}>
                    {f.crop}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#c2c9bf' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={12} /> {f.location}</span>
                  <span>•</span>
                  <span>{f.landArea}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Selected Farmer Twin Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Twin Profile header */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#81C784', fontWeight: '800' }}>Active Farm Twin</span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '22px' }}>{selectedFarmer.twinName}</h2>
                <p style={{ margin: '4px 0 0 0', color: '#c2c9bf', fontSize: '12px' }}>Registered Owner: {selectedFarmer.name} ({selectedFarmer.phone})</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#c2c9bf' }}>Coordinates</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: '600' }}>{selectedFarmer.gps}</p>
              </div>
            </div>

            {/* Twin Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '10px', color: '#c2c9bf' }}>Soil Type</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: '700', color: '#81C784' }}>{selectedFarmer.soilType}</p>
              </div>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '10px', color: '#c2c9bf' }}>Soil pH Value</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: '700', color: '#F9A825' }}>{selectedFarmer.metrics.pH} pH</p>
              </div>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '10px', color: '#c2c9bf' }}>Soil Moisture</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: '700', color: '#4CAF50' }}>{selectedFarmer.metrics.moisture}</p>
              </div>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '10px', color: '#c2c9bf' }}>Water Stress</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: '700', color: selectedFarmer.waterStress === 'Low' ? '#4CAF50' : '#F9A825' }}>{selectedFarmer.waterStress}</p>
              </div>
            </div>

            {/* Nutrients NPK Grid */}
            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#c2c9bf' }}>Soil Nutrient Levels (NPK Profile)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700' }}>Nitrogen (N)</span>
                    <span>{selectedFarmer.metrics.N}</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px' }}>
                    <div style={{ height: '100%', width: '75%', background: '#4CAF50', borderRadius: '20px' }} />
                  </div>
                </div>
                <div style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700' }}>Phosphorus (P)</span>
                    <span>{selectedFarmer.metrics.P}</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px' }}>
                    <div style={{ height: '100%', width: '60%', background: '#F9A825', borderRadius: '20px' }} />
                  </div>
                </div>
                <div style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700' }}>Potassium (K)</span>
                    <span>{selectedFarmer.metrics.K}</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px' }}>
                    <div style={{ height: '100%', width: '85%', background: '#81C784', borderRadius: '20px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Crop Growth Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}><Sprout size={16} /> Crop Stage: {selectedFarmer.crop} ({selectedFarmer.growth}% grown)</span>
                <span style={{ color: '#81C784' }}>Est. Yield: 4.5 Tons/Acre</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${selectedFarmer.growth}%`, background: 'linear-gradient(90deg, var(--primary-green), var(--secondary-green))', borderRadius: '10px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Users, Sprout, Droplets, AlertTriangle, TrendingUp, ShieldAlert, Plus } from 'lucide-react';
import CropChart from '../charts/CropChart';
import PriceChart from '../charts/PriceChart';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [alerts, setAlerts] = useState([
    { id: 1, title: 'Heatwave Alert', message: 'Temperatures expected to exceed 42°C in Telangana region.', severity: 'High', type: 'Weather' },
    { id: 2, title: 'Paddy Fungal Blight Outbreak', message: 'Detected in Rangareddy district. Diagnostic alert broadcasted.', severity: 'Critical', type: 'Disease' },
    { id: 3, title: 'PM-KISAN Enrollment Deadline', message: 'Applications close in 2 weeks. Automated SMS reminder queued.', severity: 'Medium', type: 'Scheme' }
  ]);

  const [newAlert, setNewAlert] = useState({ title: '', message: '', severity: 'Medium', type: 'Weather' });
  const [showAddAlert, setShowAddAlert] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/analytics`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.analytics) {
          setAnalytics(data.analytics);
        }
      })
      .catch(err => console.warn('[Admin Dashboard] Analytics fetch fallback:', err.message));
      
    fetch(`${API_BASE_URL}/api/admin/alerts`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.alerts && data.alerts.length > 0) {
          setAlerts(data.alerts);
        }
      })
      .catch(err => console.warn('[Admin Dashboard] Alerts fetch fallback:', err.message));
  }, []);

  const totalFarmers = analytics?.totalFarmers || 128;
  const activeFarms = analytics?.activeFarms || 85;
  const activeSchemes = analytics?.activeSchemes || 14;
  const totalAIEvaluations = analytics?.totalAIEvaluations || 520;


  const handleCreateAlert = (e) => {
    e.preventDefault();
    if (!newAlert.title || !newAlert.message) return;
    setAlerts([{ id: Date.now(), ...newAlert }, ...alerts]);
    setNewAlert({ title: '', message: '', severity: 'Medium', type: 'Weather' });
    setShowAddAlert(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', background: 'linear-gradient(90deg, #fff, #81C784)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Ecosystem Overview
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#c2c9bf', fontSize: '14px' }}>Real-time analytics and alerts monitor for Indian Agriculture</p>
        </div>
        <button className="pill-btn" onClick={() => setShowAddAlert(!showAddAlert)}>
          <Plus size={16} /> Broadcast Emergency Alert
        </button>
      </div>

      {/* Broadcast Alert Modal / Form */}
      {showAddAlert && (
        <div className="glass-panel" style={{ border: '1px solid rgba(249, 168, 37, 0.4)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#F9A825', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} /> Create System-Wide Broadcast
          </h3>
          <form onSubmit={handleCreateAlert} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600' }}>Alert Title</label>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="e.g. Locust Attack Warning"
                value={newAlert.title}
                onChange={e => setNewAlert({...newAlert, title: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600' }}>Alert Type & Severity</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  className="glass-input" 
                  style={{ width: '50%', background: '#1b2e1b' }}
                  value={newAlert.type}
                  onChange={e => setNewAlert({...newAlert, type: e.target.value})}
                >
                  <option>Weather</option>
                  <option>Disease</option>
                  <option>Scheme</option>
                  <option>Market</option>
                </select>
                <select 
                  className="glass-input"
                  style={{ width: '50%', background: '#1b2e1b' }}
                  value={newAlert.severity}
                  onChange={e => setNewAlert({...newAlert, severity: e.target.value})}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600' }}>Detailed Message</label>
              <textarea 
                className="glass-input" 
                rows="3" 
                placeholder="Describe details, recommended action, and regions affected..."
                value={newAlert.message}
                onChange={e => setNewAlert({...newAlert, message: e.target.value})}
                style={{ resize: 'none' }}
              />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button type="button" className="pill-btn secondary" onClick={() => setShowAddAlert(false)}>Cancel</button>
              <button type="submit" className="pill-btn">Broadcast Alert</button>
            </div>
          </form>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '16px', background: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#c2c9bf' }}>Active Farmers</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '700' }}>{totalFarmers}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '16px', background: 'rgba(129, 199, 132, 0.15)', color: '#81C784' }}>
            <Sprout size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#c2c9bf' }}>Active Managed Farms</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '700' }}>{activeFarms}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '16px', background: 'rgba(249, 168, 37, 0.15)', color: '#F9A825' }}>
            <Droplets size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#c2c9bf' }}>Active Government Schemes</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '700' }}>{activeSchemes}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '16px', background: 'rgba(255, 112, 67, 0.15)', color: '#FF7043' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#c2c9bf' }}>AI Model Evaluations</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '700' }}>{totalAIEvaluations}</h3>
          </div>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
        {/* Left Hand: Crop Distribution & Price Monitor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel">
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Crop Distribution Analytics</h3>
            <CropChart />
          </div>

          <div className="glass-panel">
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Market Price Monitor</h3>
            <PriceChart />
          </div>
        </div>

        {/* Right Hand: Emergency Alerts Broadcast Queue */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} style={{ color: '#F9A825' }} /> Emergency Alerts Queue
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                style={{ 
                  padding: '16px', 
                  borderRadius: '16px', 
                  background: 'rgba(255,255,255,0.02)', 
                  borderLeft: `4px solid ${
                    alert.severity === 'Critical' ? '#d32f2f' :
                    alert.severity === 'High' ? '#f57c00' : '#fbc02d'
                  }`,
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>{alert.title}</span>
                  <span style={{ 
                    fontSize: '10px', 
                    padding: '2px 8px', 
                    borderRadius: '20px', 
                    background: 'rgba(255,255,255,0.08)',
                    color: '#c2c9bf'
                  }}>
                    {alert.type}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#c2c9bf', lineHeight: '1.4' }}>{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Landmark, Calendar, ShieldCheck, Trash2, Plus, AlertCircle } from 'lucide-react';

export default function Schemes() {
  const [schemes, setSchemes] = useState([
    {
      id: 'scheme-1',
      name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      benefits: '₹6,000 yearly support in 3 equal installments.',
      maxLand: '5.0 Acres',
      categories: 'All Categories',
      state: 'All India',
      deadline: 'Oct 31, 2026'
    },
    {
      id: 'scheme-2',
      name: 'PM Fasal Bima Yojana (Crop Insurance)',
      benefits: 'Up to 90% insurance premium subsidies.',
      maxLand: 'No Limit',
      categories: 'All Categories',
      state: 'All India',
      deadline: 'Aug 15, 2026'
    },
    {
      id: 'scheme-3',
      name: 'Per Drop More Crop (Drip Irrigation)',
      benefits: '85% to 90% subsidy on micro-irrigation gear.',
      maxLand: '10.0 Acres',
      categories: 'OBC, SC, ST',
      state: 'All India',
      deadline: 'Sep 30, 2026'
    }
  ]);

  const [newScheme, setNewScheme] = useState({ name: '', benefits: '', maxLand: '', categories: '', state: '', deadline: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddScheme = (e) => {
    e.preventDefault();
    if (!newScheme.name || !newScheme.benefits) return;
    setSchemes([...schemes, { id: `scheme-${Date.now()}`, ...newScheme }]);
    setNewScheme({ name: '', benefits: '', maxLand: '', categories: '', state: '', deadline: '' });
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    setSchemes(schemes.filter(s => s.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', background: 'linear-gradient(90deg, #fff, #81C784)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Government Scheme Manager
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#c2c9bf', fontSize: '14px' }}>Publish and manage subsidy programs linked with automated profile-matching</p>
        </div>
        <button className="pill-btn" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} /> Publish New Scheme
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddScheme} className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <h3 style={{ gridColumn: 'span 2', margin: 0, fontSize: '18px', color: '#81C784' }}>New Scheme Specifications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px' }}>Scheme Name</label>
            <input type="text" className="glass-input" placeholder="e.g. PM Tractor Subsidy Scheme" required value={newScheme.name} onChange={e => setNewScheme({...newScheme, name: e.target.value})} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px' }}>Financial Benefits Description</label>
            <input type="text" className="glass-input" placeholder="e.g. 50% subsidy up to ₹1,50,000" required value={newScheme.benefits} onChange={e => setNewScheme({...newScheme, benefits: e.target.value})} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px' }}>Max Land Limit (Acres)</label>
            <input type="text" className="glass-input" placeholder="e.g. 5.0 Acres (Leave blank for no limit)" value={newScheme.maxLand} onChange={e => setNewScheme({...newScheme, maxLand: e.target.value})} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px' }}>Allowed Social Categories</label>
            <input type="text" className="glass-input" placeholder="e.g. SC, ST, OBC (Leave blank for All)" value={newScheme.categories} onChange={e => setNewScheme({...newScheme, categories: e.target.value})} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px' }}>State Applicability</label>
            <input type="text" className="glass-input" placeholder="e.g. Uttar Pradesh (or All India)" value={newScheme.state} onChange={e => setNewScheme({...newScheme, state: e.target.value})} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px' }}>Application Deadline</label>
            <input type="text" className="glass-input" placeholder="e.g. Dec 31, 2026" value={newScheme.deadline} onChange={e => setNewScheme({...newScheme, deadline: e.target.value})} />
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" className="pill-btn secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button type="submit" className="pill-btn">Publish Scheme</button>
          </div>
        </form>
      )}

      {/* Schemes List */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Currently Active Schemes</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#c2c9bf' }}>
                <th style={{ padding: '12px 16px' }}>Scheme details</th>
                <th style={{ padding: '12px 16px' }}>State / Land Limits</th>
                <th style={{ padding: '12px 16px' }}>Target Socials</th>
                <th style={{ padding: '12px 16px' }}>Application Deadline</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schemes.map((scheme) => (
                <tr key={scheme.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Landmark size={20} style={{ color: '#81C784' }} />
                      <div>
                        <span style={{ fontWeight: '700' }}>{scheme.name}</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#c2c9bf' }}>{scheme.benefits}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '13px' }}>
                      <span style={{ fontWeight: '600' }}>{scheme.state}</span>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#c2c9bf' }}>Max Land: {scheme.maxLand || 'No Limit'}</p>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ fontSize: '12px', background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.2)', padding: '4px 10px', borderRadius: '12px', color: '#81C784' }}>
                      {scheme.categories}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <Calendar size={14} style={{ color: '#F9A825' }} /> {scheme.deadline}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleDelete(scheme.id)}
                      style={{ background: 'none', border: 'none', color: '#FF7043', cursor: 'pointer', padding: '6px', borderRadius: '50%' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

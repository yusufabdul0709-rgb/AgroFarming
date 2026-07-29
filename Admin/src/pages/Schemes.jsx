import React, { useState, useEffect } from 'react';
import { Landmark, Calendar, ShieldCheck, Trash2, Plus, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000';

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

  const [queue, setQueue] = useState([
    {
      id: 'q-1',
      name: 'Rythu Bandhu Scheme (Telangana)',
      benefits: '₹5,000 per acre per season to support initial investment.',
      maxLand: '5 Acres',
      docs: 'Pattadar Passbook, Aadhaar',
      source: 'telangana.gov.in',
      categories: 'All',
      state: 'Telangana',
      deadline: 'Upcoming'
    }
  ]);

  const [newScheme, setNewScheme] = useState({ name: '', benefits: '', maxLand: '', categories: '', state: '', deadline: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/schemes/all`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data && data.data.length > 0) {
          setSchemes(data.data);
        }
      })
      .catch(err => console.warn('[Admin Schemes] Schemes fetch fallback:', err.message));

    fetch(`${API_BASE_URL}/api/schemes/ingest/queue`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data) {
          setQueue(data.data);
        }
      })
      .catch(err => console.warn('[Admin Schemes] Queue fetch fallback:', err.message));
  }, []);

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
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="pill-btn secondary" onClick={() => {
            alert('Scraper started in background. New schemes will appear here.');
          }}>
            <Calendar size={16} /> Run Daily Scraper
          </button>
          <button className="pill-btn" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={16} /> Publish New Scheme
          </button>
        </div>
      </div>

      {/* Scraper Approval Queue */}
      {queue.length > 0 && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderColor: '#F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} /> Pending Approval (Automated Scraper)
            </h3>
            <span style={{ fontSize: '12px', background: 'rgba(245, 158, 11, 0.2)', padding: '4px 10px', borderRadius: '12px', color: '#FCD34D' }}>
              {queue.length} New Scheme{queue.length > 1 ? 's' : ''} Detected
            </span>
          </div>
          {queue.map(q => (
            <div key={q.id} style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px dashed #F59E0B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontWeight: '700', fontSize: '16px', color: 'white' }}>{q.name}</span>
                  <p style={{ margin: '6px 0', fontSize: '13px', color: '#c2c9bf' }}>Extracted Benefits: {q.benefits}</p>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', color: '#9CA3AF' }}>
                    <span><b>Max Land:</b> {q.maxLand}</span>
                    <span><b>Required Docs:</b> {q.docs}</span>
                    <span><b>Source:</b> {q.source}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="pill-btn secondary" style={{ borderColor: '#EF4444', color: '#EF4444' }} onClick={() => setQueue(queue.filter(item => item.id !== q.id))}>Reject</button>
                  <button className="pill-btn" style={{ background: '#F59E0B', color: 'white' }} onClick={() => {
                    setSchemes([{
                      id: `scheme-new-${Date.now()}`,
                      name: q.name,
                      benefits: q.benefits,
                      maxLand: q.maxLand,
                      categories: q.categories,
                      state: q.state,
                      deadline: q.deadline
                    }, ...schemes]);
                    setQueue(queue.filter(item => item.id !== q.id));
                    alert('Scheme Approved and Published!');
                  }}>Approve & Publish</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

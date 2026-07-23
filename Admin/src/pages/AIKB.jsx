import React, { useState } from 'react';
import { Database, Search, FileText, UploadCloud, Plus, Check } from 'lucide-react';

export default function AIKB() {
  const [documents, setDocuments] = useState([
    { id: 1, title: 'ICAR Paddy Cultivation Manual 2025', source: 'ICAR Publications', category: 'Crop Guidance', date: '2025-02-12', tokens: '14,200 words' },
    { id: 2, title: 'FAO Water-Saving Irrigation Practices', source: 'FAO Archives', category: 'Water Intelligence', date: '2024-11-05', tokens: '28,500 words' },
    { id: 3, title: 'Indian Soils Grids & Soil Profiles', source: 'SoilGrids API', category: 'Geo Intelligence', date: '2025-06-20', tokens: '8,400 words' },
    { id: 4, title: 'Late Blight Fungal Diagnostic Guide', source: 'Agro University', category: 'Disease Guide', date: '2025-01-30', tokens: '12,900 words' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [testResult, setTestResult] = useState('');
  const [newDoc, setNewDoc] = useState({ title: '', source: 'Local Upload', category: 'Crop Guidance' });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddDoc = (e) => {
    e.preventDefault();
    if (!newDoc.title) return;
    setDocuments([
      { id: Date.now(), ...newDoc, date: new Date().toISOString().split('T')[0], tokens: '1,500 words' },
      ...documents
    ]);
    setNewDoc({ title: '', source: 'Local Upload', category: 'Crop Guidance' });
    setShowAddForm(false);
  };

  const handleSearch = () => {
    if (!searchQuery) {
      setTestResult('');
      return;
    }
    const q = searchQuery.toLowerCase();
    if (q.includes('paddy') || q.includes('water')) {
      setTestResult('Matched ICAR Paddy Cultivation Manual & FAO Archives. Context: "Paddy is a water-intensive crop requiring 1200-1500 mm. AWD (Alternative Wetting Drying) decreases usage by 20-30%."');
    } else if (q.includes('blight') || q.includes('disease')) {
      setTestResult('Matched Late Blight Fungal Diagnostic Guide. Context: "Late Blight is caused by Phytophthora infestans. Spray Copper Oxychloride (2g/L) or neem extract."');
    } else {
      setTestResult('No direct matching article. Generating general context fallback.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', background: 'linear-gradient(90deg, #fff, #81C784)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            RAG Knowledge Base & Embeddings
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#c2c9bf', fontSize: '14px' }}>Manage indexed agricultural documentation used by the Multi-Agent LLM context wrappers</p>
        </div>
        <button className="pill-btn" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} /> Index New Manual
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Side: Indexed Documents Directory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {showAddForm && (
            <form onSubmit={handleAddDoc} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#81C784' }}>Upload & Index Document</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px' }}>Document Name</label>
                  <input type="text" className="glass-input" placeholder="e.g. Tomato Disease Index 2026" required value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px' }}>Category</label>
                  <select className="glass-input" style={{ background: '#1b2e1b' }} value={newDoc.category} onChange={e => setNewDoc({...newDoc, category: e.target.value})}>
                    <option>Crop Guidance</option>
                    <option>Water Intelligence</option>
                    <option>Geo Intelligence</option>
                    <option>Disease Guide</option>
                  </select>
                </div>
              </div>
              <div style={{ border: '2px dashed var(--glass-border)', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.01)' }}>
                <UploadCloud size={32} style={{ color: '#81C784' }} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Drag & Drop PDF or Excel guides</span>
                <span style={{ fontSize: '11px', color: '#c2c9bf' }}>Max file size: 24MB</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="pill-btn secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                <button type="submit" className="pill-btn">Start Embedding Analysis</button>
              </div>
            </form>
          )}

          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Indexed Repositories</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {documents.map(doc => (
                <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={22} style={{ color: '#81C784' }} />
                    <div>
                      <span style={{ fontWeight: '700', fontSize: '14px' }}>{doc.title}</span>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#c2c9bf', marginTop: '4px' }}>
                        <span>Source: {doc.source}</span>
                        <span>•</span>
                        <span>Uploaded: {doc.date}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', background: 'rgba(76,175,80,0.1)', padding: '2px 8px', borderRadius: '10px', color: '#81C784' }}>
                      {doc.category}
                    </span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#c2c9bf' }}>Vector size: {doc.tokens}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: RAG Tester Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} style={{ color: '#81C784' }} /> Semantic RAG Tester
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#c2c9bf', lineHeight: '1.4' }}>
            Test similarity calculations. Enter search queries to preview documentation fragments sent to the Multi-Agent coordinator.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="e.g. paddy water requirements" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="pill-btn" onClick={handleSearch} style={{ padding: '12px' }}>
              <Search size={16} />
            </button>
          </div>

          {testResult && (
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(76,175,80,0.06)', border: '1px solid rgba(76,175,80,0.15)', marginTop: '12px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#81C784', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} /> Semantic Match context
              </span>
              <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#f7f9f4', lineHeight: '1.5' }}>
                {testResult}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

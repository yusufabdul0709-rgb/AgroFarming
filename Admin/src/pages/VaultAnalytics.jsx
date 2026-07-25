import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ShieldCheck, FileText, CheckCircle, Clock } from 'lucide-react';

const mockDocStats = [
  { name: 'Personal', count: 1245 },
  { name: 'Land', count: 856 },
  { name: 'Banking', count: 1102 },
  { name: 'Agriculture', count: 543 },
];

const mockTimeline = [
  { date: 'Mon', applications: 20, successRate: 85 },
  { date: 'Tue', applications: 45, successRate: 88 },
  { date: 'Wed', applications: 60, successRate: 91 },
  { date: 'Thu', applications: 35, successRate: 86 },
  { date: 'Fri', applications: 90, successRate: 95 },
  { date: 'Sat', applications: 110, successRate: 94 },
  { date: 'Sun', applications: 75, successRate: 92 },
];

export default function VaultAnalytics() {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      
      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px' }}>
              <ShieldCheck size={24} color="#38BDF8" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#F8FAFC', marginBottom: '4px' }}>4,250</div>
          <div style={{ color: '#94A3B8', fontSize: '14px' }}>Total Secured Documents</div>
        </div>

        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: 'rgba(52, 211, 153, 0.1)', borderRadius: '12px' }}>
              <CheckCircle size={24} color="#34D399" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#F8FAFC', marginBottom: '4px' }}>94%</div>
          <div style={{ color: '#94A3B8', fontSize: '14px' }}>AI Validation Score</div>
        </div>

        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: 'rgba(167, 139, 250, 0.1)', borderRadius: '12px' }}>
              <FileText size={24} color="#A78BFA" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#F8FAFC', marginBottom: '4px' }}>1,850</div>
          <div style={{ color: '#94A3B8', fontSize: '14px' }}>Missing Docs Detected</div>
        </div>
        
        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: 'rgba(251, 146, 60, 0.1)', borderRadius: '12px' }}>
              <Clock size={24} color="#FB923C" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#F8FAFC', marginBottom: '4px' }}>850+</div>
          <div style={{ color: '#94A3B8', fontSize: '14px' }}>Applications Expedited</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Document Stats Chart */}
        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 24px 0', color: '#F8FAFC', fontSize: '18px' }}>Documents by Category</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDocStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '8px', color: '#F8FAFC' }} />
                <Bar dataKey="count" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Success Trend */}
        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 24px 0', color: '#F8FAFC', fontSize: '18px' }}>Scheme Application Trends</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '8px', color: '#F8FAFC' }} />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#A78BFA" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="successRate" stroke="#34D399" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
    </div>
  );
}

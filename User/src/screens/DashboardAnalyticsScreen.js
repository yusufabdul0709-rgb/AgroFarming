import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, BarChart3, TrendingUp, Waves, Sprout, Sun } from 'lucide-react-native';
import { useProfile } from '../context/ProfileContext';
import useDeviceLocation from '../hooks/useDeviceLocation';

export default function DashboardAnalyticsScreen({ onBack }) {
  const { farmerProfile } = useProfile();
  const location = useDeviceLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lat = location?.latitude || 28.6139;
        const lng = location?.longitude || 77.2090;
        const acres = farmerProfile?.landArea ? parseFloat(farmerProfile.landArea) : 15.4;
        
        const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.42:5000/api';
        const res = await fetch(`${API_URL}/ai/orchestrate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude: lat, longitude: lng, land_acres: acres })
        });
        const result = await res.json();
        
        if (result.status === 'success') {
          setData({
            acres: acres,
            yield: result.data?.yield?.yield_prediction || '30 qtl/acre',
            waterScore: result.data?.water?.water_quality_score || '82',
            crop: result.data?.crop?.recommended_crop || 'Paddy'
          });
        }
      } catch (err) {
        console.warn('Orchestrate fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [location, farmerProfile]);

  const acres = data?.acres || farmerProfile?.landArea || '15.4';
  const projectedYield = data?.yield || '30 qtl/acre';
  const waterScore = data?.waterScore || '82';
  const crop = data?.crop || 'Paddy';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <ArrowLeft size={20} color="#1b4332" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Farm Analytics & Intelligence</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <BarChart3 size={24} color="#2e7d32" />
          <Text style={styles.cardTitle}>Yield & Health Metrics</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#2e7d32" style={{ marginTop: 10, alignSelf: 'flex-start' }} />
          ) : (
            <Text style={styles.cardDesc}>{acres} Acres under active monitoring with 92% {crop} suitability score.</Text>
          )}
        </View>

        <View style={styles.grid}>
          <View style={styles.metric}>
            <Sprout size={18} color="#16a34a" />
            <Text style={styles.val}>{loading ? '...' : projectedYield}</Text>
            <Text style={styles.lbl}>Projected Yield</Text>
          </View>
          <View style={styles.metric}>
            <Waves size={18} color="#0284c7" />
            <Text style={styles.val}>{loading ? '...' : `${waterScore} / 100`}</Text>
            <Text style={styles.lbl}>Water Efficiency</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8faf8' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 14,
    backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e2e8f0'
  },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1b4332' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#1b4332', marginTop: 8 },
  cardDesc: { fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 18 },
  grid: { flexDirection: 'row', gap: 12 },
  metric: { flex: 1, backgroundColor: 'white', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  val: { fontSize: 18, fontWeight: '800', color: '#1b4332', marginTop: 6 },
  lbl: { fontSize: 11, color: '#64748b', marginTop: 2 }
});

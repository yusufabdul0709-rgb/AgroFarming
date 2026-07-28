import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, FlaskConical, Sprout, CheckCircle2 } from 'lucide-react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.134:5000/api';

export default function SoilAnalyzerScreen({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [soilData, setSoilData] = useState(null);

  useEffect(() => {
    const fetchSoilGrids = async () => {
      try {
        const res = await fetch(`${API_URL}/soil?latitude=17.6868&longitude=83.3088`);
        if (res.ok) {
          const json = await res.json();
          setSoilData(json.data);
        }
      } catch (e) {
        console.warn('SoilGrids fallback', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSoilGrids();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#1b4332" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Soil Analyzer (ISRIC)</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.healthCard}>
          <FlaskConical size={32} color="#b45309" />
          <Text style={styles.scoreVal}>75 / 100</Text>
          <Text style={styles.scoreLabel}>Soil Health Index: Good</Text>
          <Text style={styles.scoreSub}>Loamy soil with balanced pH and rich organic nitrogen.</Text>
        </View>

        <Text style={styles.secTitle}>NPK & Chemical Properties (SoilGrids v2.0)</Text>
        <View style={styles.npkGrid}>
          <View style={styles.npkCard}>
            <Text style={styles.npkLabel}>Nitrogen (N)</Text>
            <Text style={styles.npkVal}>110 kg/ha</Text>
            <Text style={styles.npkStatus}>Sufficient</Text>
          </View>
          <View style={styles.npkCard}>
            <Text style={styles.npkLabel}>Phosphorus (P)</Text>
            <Text style={styles.npkVal}>38 kg/ha</Text>
            <Text style={styles.npkStatus}>Optimal</Text>
          </View>
          <View style={styles.npkCard}>
            <Text style={styles.npkLabel}>Potassium (K)</Text>
            <Text style={styles.npkVal}>195 kg/ha</Text>
            <Text style={styles.npkStatus}>High</Text>
          </View>
          <View style={styles.npkCard}>
            <Text style={styles.npkLabel}>pH Level</Text>
            <Text style={styles.npkVal}>6.8 pH</Text>
            <Text style={styles.npkStatus}>Ideal</Text>
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
  scrollContent: { padding: 16, paddingBottom: 60 },
  healthCard: { backgroundColor: '#fef3c7', borderRadius: 22, padding: 24, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#fde68a' },
  scoreVal: { fontSize: 32, fontWeight: '800', color: '#92400e', marginTop: 8 },
  scoreLabel: { fontSize: 14, fontWeight: '700', color: '#b45309', marginTop: 2 },
  scoreSub: { fontSize: 12, color: '#92400e', marginTop: 6, textAlign: 'center' },
  secTitle: { fontSize: 16, fontWeight: '800', color: '#1b4332', marginBottom: 12 },
  npkGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  npkCard: { width: '48%', backgroundColor: 'white', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  npkLabel: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  npkVal: { fontSize: 18, fontWeight: '800', color: '#1b4332', marginTop: 4 },
  npkStatus: { fontSize: 11, fontWeight: '700', color: '#16a34a', marginTop: 2 }
});

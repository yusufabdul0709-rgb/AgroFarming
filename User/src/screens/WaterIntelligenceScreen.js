import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Waves, Droplets, Calendar, AlertTriangle } from 'lucide-react-native';

export default function WaterIntelligenceScreen({ onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#1b4332" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Water Intelligence</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.scoreCard}>
          <Waves size={32} color="#0284c7" />
          <Text style={styles.scoreVal}>82 / 100</Text>
          <Text style={styles.scoreLabel}>Optimal Farm Water Index</Text>
          <Text style={styles.scoreSub}>No water stress detected across Paddy sectors.</Text>
        </View>

        <Text style={styles.secTitle}>Irrigation Advisory Schedule</Text>
        <View style={styles.schedItem}>
          <Calendar size={18} color="#0284c7" />
          <View style={{ flex: 1 }}>
            <Text style={styles.schedTitle}>Tomorrow, 7:00 AM</Text>
            <Text style={styles.schedDesc}>Skip irrigation. Open-Meteo predicts 20% rain probability with 4.5mm precipitation.</Text>
          </View>
        </View>

        <View style={styles.schedItem}>
          <Droplets size={18} color="#0284c7" />
          <View style={{ flex: 1 }}>
            <Text style={styles.schedTitle}>Friday, 6:30 AM</Text>
            <Text style={styles.schedDesc}>Apply 45 mins canal drip irrigation for North Paddy Block.</Text>
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
  scoreCard: { backgroundColor: '#e0f2fe', borderRadius: 22, padding: 24, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#bae6fd' },
  scoreVal: { fontSize: 32, fontWeight: '800', color: '#0369a1', marginTop: 8 },
  scoreLabel: { fontSize: 14, fontWeight: '700', color: '#0284c7', marginTop: 2 },
  scoreSub: { fontSize: 12, color: '#0369a1', marginTop: 6, textAlign: 'center' },
  secTitle: { fontSize: 16, fontWeight: '800', color: '#1b4332', marginBottom: 12 },
  schedItem: { flexDirection: 'row', gap: 12, backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  schedTitle: { fontSize: 14, fontWeight: '700', color: '#1b4332' },
  schedDesc: { fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 18 }
});

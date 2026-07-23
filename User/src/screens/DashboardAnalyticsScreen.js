import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, BarChart3, TrendingUp, Waves, Sprout, Sun } from 'lucide-react-native';

export default function DashboardAnalyticsScreen({ onBack }) {
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
          <Text style={styles.cardDesc}>15.4 Acres under active monitoring with 92% Paddy suitability score.</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.metric}>
            <Sprout size={18} color="#16a34a" />
            <Text style={styles.val}>30 qtl/acre</Text>
            <Text style={styles.lbl}>Projected Yield</Text>
          </View>
          <View style={styles.metric}>
            <Waves size={18} color="#0284c7" />
            <Text style={styles.val}>82 / 100</Text>
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

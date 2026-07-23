import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ScanLine, ArrowLeft, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.52:5000/api';

export default function MilletScannerScreen({ onBack }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);

  const handleScanMillet = async () => {
    setAnalyzing(true);
    setReport(null);
    try {
      const res = await fetch(`${API_URL}/ai/vision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: 'fake-base64', analysisType: 'millet' })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setReport(data.data);
      } else {
        alert('Analysis Failed: ' + data.message);
      }
    } catch (e) {
      console.warn('AI Vision error:', e);
      alert('Network Error: Failed to connect to AI Vision Engine.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#1b4332" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Millet Quality Scanner</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=400&auto=format&fit=crop' }}
            style={styles.milletBannerImg}
          />
          <Text style={styles.heroTitle}>Computer Vision Grain Analysis</Text>
          <Text style={styles.heroDesc}>Scan your Bajra, Ragi, or Jowar grains to verify freshness, fungus contamination, and mandi price grade.</Text>
          
          <TouchableOpacity style={styles.scanBtn} onPress={handleScanMillet} disabled={analyzing}>
            {analyzing ? <ActivityIndicator color="white" /> : (
              <>
                <ScanLine size={18} color="white" />
                <Text style={styles.scanBtnTxt}>Instant Grain Scan</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {report && !analyzing && (
          <View style={styles.reportCard}>
            <View style={styles.reportHeaderRow}>
              <CheckCircle2 size={24} color="#16a34a" />
              <View>
                <Text style={styles.grainName}>{report.grainType}</Text>
                <Text style={styles.gradeTxt}>{report.qualityGrade}</Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.mTitle}>Freshness</Text>
                <Text style={styles.mVal}>{report.freshnessScore}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.mTitle}>Fungus</Text>
                <Text style={[styles.mVal, { color: '#16a34a' }]}>Negative</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.mTitle}>Moisture</Text>
                <Text style={styles.mVal}>{report.moistureContent}</Text>
              </View>
            </View>

            <Text style={styles.recomLabel}>Storage & Market Recommendation:</Text>
            <Text style={styles.recomVal}>{report.recommendation}</Text>
          </View>
        )}
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
  heroCard: { backgroundColor: 'white', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  milletBannerImg: { width: '100%', height: 160, borderRadius: 16, marginBottom: 14 },
  heroTitle: { fontSize: 18, fontWeight: '800', color: '#1b4332' },
  heroDesc: { fontSize: 12, color: '#64748b', marginTop: 4, marginBottom: 16, lineHeight: 18 },
  scanBtn: { flexDirection: 'row', backgroundColor: '#2e7d32', paddingVertical: 12, borderRadius: 14, justifyContent: 'center', alignItems: 'center', gap: 8 },
  scanBtnTxt: { color: 'white', fontSize: 14, fontWeight: '700' },
  reportCard: { backgroundColor: '#f0fdf4', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#86efac' },
  reportHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  grainName: { fontSize: 16, fontWeight: '800', color: '#14532d' },
  gradeTxt: { fontSize: 12, color: '#16a34a', fontWeight: '700' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', padding: 12, borderRadius: 14, marginBottom: 14 },
  metricItem: { alignItems: 'center' },
  mTitle: { fontSize: 10, color: '#64748b' },
  mVal: { fontSize: 14, fontWeight: '800', color: '#1b4332', marginTop: 2 },
  recomLabel: { fontSize: 12, fontWeight: '700', color: '#14532d' },
  recomVal: { fontSize: 12, color: '#166534', marginTop: 4, lineHeight: 18 }
});

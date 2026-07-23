import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { 
  Stethoscope, 
  ArrowLeft, 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  PhoneCall 
} from 'lucide-react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.52:5000/api';

export default function CropDoctorScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);

  const handleRunDiagnosis = async (sampleName) => {
    setLoading(true);
    setDiagnosis(null);
    try {
      const res = await fetch(`${API_URL}/ai/vision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: 'fake-base64', analysisType: sampleName })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setDiagnosis(data.data);
      } else {
        Alert.alert('Analysis Failed', data.message);
      }
    } catch (e) {
      console.warn('AI Vision error:', e);
      Alert.alert('Network Error', 'Failed to connect to AI Vision Engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#1b4332" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crop Doctor AI</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.badgeRow}>
            <Stethoscope size={22} color="#16a34a" />
            <Text style={styles.bannerTitle}>Instant Plant Pathology</Text>
          </View>
          <Text style={styles.bannerDesc}>
            Upload or capture a leaf photo to diagnose diseases, fungus, or nutrient deficiencies instantly powered by Gemini AI.
          </Text>
        </View>

        {/* Scan Actions */}
        <Text style={styles.sectionTitle}>Select Sample to Analyze</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionCard} onPress={() => handleRunDiagnosis('tomato')}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200&auto=format&fit=crop' }} 
              style={styles.sampleImg}
            />
            <Text style={styles.sampleLabel}>Tomato Leaf Sample</Text>
            <Text style={styles.sampleSub}>Blight Detection</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => handleRunDiagnosis('paddy')}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200&auto=format&fit=crop' }} 
              style={styles.sampleImg}
            />
            <Text style={styles.sampleLabel}>Paddy Leaf Sample</Text>
            <Text style={styles.sampleSub}>Blast Detection</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#16a34a" />
            <Text style={styles.loadingTxt}>Analyzing Leaf Cellular Structure with Gemini AI...</Text>
          </View>
        )}

        {/* Diagnosis Report Result */}
        {diagnosis && !loading && (
          <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <AlertTriangle size={24} color="#dc2626" />
              <View style={{ flex: 1 }}>
                <Text style={styles.diseaseName}>{diagnosis.disease}</Text>
                <Text style={styles.cropSub}>{diagnosis.crop} • Confidence {diagnosis.confidence}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.fieldLabel}>Identified Symptoms:</Text>
            <Text style={styles.fieldVal}>{diagnosis.symptom}</Text>

            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>🧪 Chemical Treatment (Recommended):</Text>
            <Text style={styles.fieldVal}>{diagnosis.chemicalTreatment}</Text>

            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>🌿 Organic Alternative:</Text>
            <Text style={styles.fieldVal}>{diagnosis.organicTreatment}</Text>

            <View style={styles.divider} />

            <Text style={styles.fieldLabel}>🏬 Nearby Authorized Agro Shops:</Text>
            {diagnosis.nearbyAgroStores.map((shop, idx) => (
              <View key={idx} style={styles.shopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.shopName}>{shop.name}</Text>
                  <Text style={styles.shopDist}><MapPin size={10} color="#64748b" /> {shop.distance}</Text>
                </View>
                <TouchableOpacity style={styles.callBtn} onPress={() => Alert.alert('Calling Store', `Dialing ${shop.phone}`)}>
                  <PhoneCall size={14} color="white" />
                  <Text style={styles.callTxt}>Call</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8faf8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1b4332' },
  scrollContent: { padding: 16, paddingBottom: 60 },
  bannerCard: {
    backgroundColor: '#dcfce7',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#86efac',
    marginBottom: 20,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  bannerTitle: { fontSize: 17, fontWeight: '800', color: '#14532d' },
  bannerDesc: { fontSize: 12, color: '#166534', lineHeight: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1b4332', marginBottom: 12 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  actionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sampleImg: { width: 70, height: 70, borderRadius: 14, marginBottom: 10 },
  sampleLabel: { fontSize: 13, fontWeight: '700', color: '#1b4332', textAlign: 'center' },
  sampleSub: { fontSize: 10, color: '#64748b', marginTop: 2 },
  loadingBox: { padding: 24, alignItems: 'center', backgroundColor: 'white', borderRadius: 18, gap: 12 },
  loadingTxt: { fontSize: 13, fontWeight: '600', color: '#15803d' },
  reportCard: { backgroundColor: 'white', borderRadius: 22, padding: 18, borderWidth: 1, borderColor: '#fca5a5' },
  reportHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  diseaseName: { fontSize: 16, fontWeight: '800', color: '#991b1b' },
  cropSub: { fontSize: 11, color: '#7f1d1d', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#fecaca', marginVertical: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: '#1b4332' },
  fieldVal: { fontSize: 13, color: '#334155', marginTop: 4, lineHeight: 18 },
  shopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8faf8', padding: 10, borderRadius: 12, marginTop: 8 },
  shopName: { fontSize: 13, fontWeight: '700', color: '#1b4332' },
  shopDist: { fontSize: 11, color: '#64748b', marginTop: 2 },
  callBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16a34a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, gap: 4 },
  callTxt: { color: 'white', fontSize: 11, fontWeight: '700' },
});

import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { Camera } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';

export default function VisionScannerScreen() {
  const [cvResult, setCvResult] = useState(null);
  const [cvScanning, setCvScanning] = useState(false);

  const triggerCVDetection = () => {
    setCvScanning(true);
    setCvResult(null);
    setTimeout(() => {
      setCvResult({
        cropType: 'Tomato',
        disease: 'Late Blight (Fungal Pathogen)',
        confidence: '94.6%',
        treatment: 'Foliar application of Metalaxyl + Mancozeb (2g/L) immediately. Prune heavily affected lower leaves.',
        organic: 'Spray with 5% Neem Seed Kernel Extract (NSKE) or dust soil base with Wood Ash.',
        priceGrade: 'Grade B (Impacts market price by -15%)',
        shops: ['Mandi Agro input agency (1.2 km)', 'Kissan Chemical Depot (3.5 km)']
      });
      setCvScanning(false);
    }, 2500);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.screenHeader}>
        <Camera size={24} color={THEME.primary} />
        <Text style={styles.screenTitle}>Computer Vision Diagnostics</Text>
      </View>
      <Text style={styles.screenIntro}>
        Upload or capture photos of damaged crop leaves to diagnose pests, nutrient deficiencies, or fungal infections.
      </Text>

      <View style={styles.visionUploadCard}>
        <TouchableOpacity style={styles.uploadTrigger} onPress={triggerCVDetection}>
          <Camera size={40} color={THEME.primary} />
          <Text style={{ fontSize: 16, fontWeight: '700', color: THEME.deepForest, marginTop: 12 }}>Diagnose Crop Leaf</Text>
          <Text style={{ fontSize: 12, color: THEME.textMuted, marginTop: 4 }}>Simulate photo capture analyzer</Text>
        </TouchableOpacity>
      </View>

      {cvScanning && (
        <View style={{ marginVertical: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={THEME.primary} />
          <Text style={{ marginTop: 8, color: THEME.textMuted }}>Running YOLOv8 segmentation on leaf image...</Text>
        </View>
      )}

      {cvResult && !cvScanning && (
        <GlassCard>
          <Text style={styles.cvResultHeader}>Diagnostic Report Output</Text>
          
          <View style={{ borderBottomWidth: 1, borderColor: '#e8eae3', paddingBottom: 10, marginBottom: 10 }}>
            <Text style={styles.cvResLabel}>Crop Category</Text>
            <Text style={styles.cvResVal}>{cvResult.cropType}</Text>
            
            <Text style={[styles.cvResLabel, { marginTop: 8 }]}>Detected Disease</Text>
            <Text style={[styles.cvResVal, { color: '#F44336', fontWeight: '800' }]}>
              {cvResult.disease} (Confidence: {cvResult.confidence})
            </Text>
          </View>

          <Text style={styles.cvResLabel}>Prescribed Treatment (Chemical)</Text>
          <Text style={styles.cvResDetail}>{cvResult.treatment}</Text>

          <Text style={[styles.cvResLabel, { marginTop: 10 }]}>Organic Alternatives</Text>
          <Text style={styles.cvResDetail}>{cvResult.organic}</Text>

          <Text style={[styles.cvResLabel, { marginTop: 10 }]}>Estimated Quality Impact</Text>
          <Text style={styles.cvResDetail}>{cvResult.priceGrade}</Text>

          <Text style={[styles.cvResLabel, { marginTop: 10 }]}>Available Shops Nearby</Text>
          {cvResult.shops.map((shop, i) => (
            <Text key={i} style={styles.cvResShop}>📍 {shop}</Text>
          ))}
        </GlassCard>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 90
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.deepForest
  },
  screenIntro: {
    fontSize: 12,
    color: THEME.textMuted,
    lineHeight: 16,
    marginBottom: 20
  },
  visionUploadCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 30,
    borderWidth: 2,
    borderColor: '#e8eae3',
    borderStyle: 'dashed',
    alignItems: 'center',
    marginVertical: 12
  },
  uploadTrigger: {
    alignItems: 'center'
  },
  cvResultHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.deepForest,
    borderBottomWidth: 1,
    borderColor: '#e8eae3',
    paddingBottom: 10,
    marginBottom: 10
  },
  cvResLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2
  },
  cvResVal: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.deepForest,
    marginBottom: 8
  },
  cvResDetail: {
    fontSize: 13,
    color: THEME.deepForest,
    lineHeight: 18,
    marginBottom: 10
  },
  cvResShop: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: '600',
    marginTop: 2
  }
});

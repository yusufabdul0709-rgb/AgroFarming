import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import { Leaf, Camera, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';

export default function CropDoctorScreen({ onBack }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState({
    title: 'Tomato - Early Blight',
    severity: 'Severity: Moderate',
    treatment: 'Treatment: Mancozeb spray',
    time: '2 days ago',
    img: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=150&q=80'
  });

  const handleDiagnose = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setDiagnosis({
        title: 'Tomato - Early Blight',
        severity: 'Severity: Moderate',
        treatment: 'Treatment: Mancozeb spray',
        time: '2 days ago',
        img: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=150&q=80'
      });
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crop Doctor</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.introText}>
          Detect crop diseases and get treatment suggestions.
        </Text>

        {/* Upload Leaf Card */}
        <View style={styles.uploadCard}>
          <View style={styles.leafCircle}>
            <Leaf size={32} color={THEME.primary} />
          </View>
          <Text style={styles.uploadLabel}>Upload Leaf Image</Text>
          <Text style={styles.uploadOr}>or</Text>
          
          <TouchableOpacity style={styles.takePhotoBtn} onPress={handleDiagnose}>
            <Camera size={16} color="white" />
            <Text style={styles.takePhotoBtnText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        {analyzing && (
          <View style={styles.loadingBlock}>
            <ActivityIndicator size="small" color={THEME.primary} />
            <Text style={styles.loadingText}>Running foliar AI disease diagnostics...</Text>
          </View>
        )}

        {/* Recent Diagnosis */}
        <Text style={styles.sectionHeader}>Recent Diagnosis</Text>
        
        {diagnosis && !analyzing && (
          <View style={styles.diagCard}>
            <View style={styles.diagInfoSide}>
              <Text style={styles.diagTitle}>{diagnosis.title}</Text>
              <Text style={styles.diagSub}>{diagnosis.severity}</Text>
              <Text style={styles.diagSub}>{diagnosis.treatment}</Text>
              <Text style={styles.diagTime}>{diagnosis.time}</Text>
            </View>
            <Image source={{ uri: diagnosis.img }} style={styles.leafThumb} />
          </View>
        )}

        {/* View All button */}
        <TouchableOpacity style={styles.actionBtn} onPress={() => alert('Launching historical foliar logs...')}>
          <Text style={styles.actionBtnText}>View All Diagnoses</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.06)'
  },
  backBtn: {
    padding: 8
  },
  backText: {
    fontSize: 16,
    color: THEME.textDark
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.textDark
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100
  },
  introText: {
    fontSize: 13,
    color: THEME.textMuted,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600'
  },
  uploadCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    paddingVertical: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(44, 107, 67, 0.1)',
    borderStyle: 'dashed',
    marginBottom: 24
  },
  leafCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(44, 107, 67, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  uploadLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.textDark
  },
  uploadOr: {
    fontSize: 12,
    color: THEME.textMuted,
    marginVertical: 8
  },
  takePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 6
  },
  takePhotoBtnText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700'
  },
  loadingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20
  },
  loadingText: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: '700'
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.textDark,
    marginBottom: 12
  },
  diagCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  diagInfoSide: {
    flex: 1.2
  },
  diagTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.textDark
  },
  diagSub: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: '600',
    marginTop: 4
  },
  diagTime: {
    fontSize: 10,
    color: THEME.textMuted,
    marginTop: 8
  },
  leafThumb: {
    width: 70,
    height: 70,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.08)'
  },
  actionBtn: {
    height: 52,
    backgroundColor: THEME.primary,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3
  },
  actionBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700'
  }
});

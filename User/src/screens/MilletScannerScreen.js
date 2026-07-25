import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import { Camera, Image as ImageIcon, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import * as ImagePicker from 'expo-image-picker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MilletScannerScreen({ onBack }) {
  const { authToken } = useProfile();
  const [scanning, setScanning] = useState(false);
  const [scannedImgUri, setScannedImgUri] = useState(null);
  const [result, setResult] = useState({
    name: 'Pearl Millet (Bajra)',
    grade: 'Grade: A (Excellent)',
    freshness: '95%',
    fungus: 'Not Detected',
    moisture: '8%'
  });

  const pickImage = async (useCamera = false) => {
    try {
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Camera permission is required to scan millets!');
          return;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Media library permission is required to select images!');
          return;
        }
      }

      const options = {
        mediaTypes: 'images',
        aspect: [1, 1],
        base64: true
      };

      let result;
      if (useCamera) {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setScannedImgUri(asset.uri);
        runMilletScan(asset.fileName || 'millet.jpg', asset.base64);
      }
    } catch (e) {
      console.error('Millet scanning error', e);
      alert('Failed to launch device camera or gallery.');
    }
  };

  const runMilletScan = async (imageName, base64) => {
    setScanning(true);
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.39:5000/api';
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(`${API_URL}/vision/diagnose`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          imageName,
          base64Image: `data:image/jpeg;base64,${base64}`,
          isMillet: true
        })
      });

      const data = await res.json();
      setScanning(false);

      if (data.status === 'success' && data.diagnosis) {
        const diag = data.diagnosis;
        setResult({
          name: diag.name || 'Pearl Millet (Bajra)',
          grade: `Grade: ${diag.grade || 'A (Excellent)'}`,
          freshness: diag.freshness || '95%',
          fungus: diag.fungus || 'Not Detected',
          moisture: diag.moisture || '8%'
        });
      } else {
        alert(data.message || 'Millet scanner AI failed to analyze. Please try a clearer picture of the millet grains.');
      }
    } catch (e) {
      setScanning(false);
      console.error(e);
      alert('Network error. Failed to connect to computer vision scanner.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Millet Quality Scanner</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.introText}>
          Scan your millets and check freshness, fungus and quality instantly.
        </Text>

        {/* Scanner View Container */}
        <View style={styles.scannerWrapper}>
          <Image 
            source={{ uri: scannedImgUri || 'https://images.unsplash.com/photo-1574325131876-aa781f7385fa?auto=format&fit=crop&w=400&q=80' }} 
            style={styles.grainBg} 
          />
          {/* Target Overlay Frame */}
          <View style={styles.targetFrame}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
            
            {/* Center camera trigger */}
            <TouchableOpacity style={styles.camTrigger} onPress={() => pickImage(true)}>
              <Camera size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {scanning && (
          <View style={styles.scanLoading}>
            <ActivityIndicator size="small" color={THEME.primary} />
            <Text style={styles.scanLoadingText}>Analyzing grains composition using computer vision...</Text>
          </View>
        )}

        {/* Scan Results Card */}
        {result && !scanning && (
          <View style={styles.resultsCard}>
            <View style={styles.resHeader}>
              <Text style={styles.resLabel}>Scan Result Analysis</Text>
              <ChevronRight size={16} color={THEME.textMuted} />
            </View>

            <View style={styles.cropTitleRow}>
              <Text style={styles.cropName}>{result.name}</Text>
              <Text style={styles.cropGrade}>{result.grade}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Freshness</Text>
                <Text style={[styles.statVal, { color: THEME.primary }]}>{result.freshness}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Fungus</Text>
                <Text style={[styles.statVal, { color: THEME.primary }]}>{result.fungus}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Moisture</Text>
                <Text style={[styles.statVal, { color: THEME.primary }]}>{result.moisture}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons Row */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => pickImage(true)}>
            <Camera size={16} color="white" style={{ marginRight: 6 }} />
            <Text style={styles.actionBtnText}>Use Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => pickImage(false)}>
            <ImageIcon size={16} color={THEME.primary} style={{ marginRight: 6 }} />
            <Text style={styles.secondaryBtnText}>Select Gallery</Text>
          </TouchableOpacity>
        </View>
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
  scannerWrapper: {
    height: SCREEN_WIDTH - 80,
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
    backgroundColor: THEME.textDark
  },
  grainBg: {
    width: '100%',
    height: '100%',
    opacity: 0.85
  },
  targetFrame: {
    position: 'absolute',
    top: '15%',
    left: '15%',
    width: '70%',
    height: '70%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'white'
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: 'white'
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'white'
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: 'white'
  },
  camTrigger: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white'
  },
  scanLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20
  },
  scanLoadingText: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: '700'
  },
  resultsCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    marginBottom: 24
  },
  resHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.05)',
    paddingBottom: 10,
    marginBottom: 12
  },
  resLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.textMuted
  },
  cropTitleRow: {
    marginBottom: 16
  },
  cropName: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.textDark
  },
  cropGrade: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: '700',
    marginTop: 2
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statBox: {
    flex: 1,
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: '600'
  },
  statVal: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%'
  },
  actionBtn: {
    height: 52,
    backgroundColor: THEME.primary,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3
  },
  actionBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700'
  },
  secondaryBtn: {
    height: 52,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: THEME.primary,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1
  },
  secondaryBtnText: {
    color: THEME.primary,
    fontSize: 14,
    fontWeight: '700'
  }
});

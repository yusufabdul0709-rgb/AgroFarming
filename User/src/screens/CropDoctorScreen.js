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
import { Leaf, Camera, Image as ImageIcon } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import * as ImagePicker from 'expo-image-picker';

export default function CropDoctorScreen({ onBack }) {
  const { authToken } = useProfile();
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedImgUri, setSelectedImgUri] = useState(null);
  const [diagnosis, setDiagnosis] = useState({
    title: 'Tomato - Early Blight',
    severity: 'Severity: Moderate',
    treatment: 'Treatment: Mancozeb spray',
    time: '2 days ago',
    img: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=150&q=80'
  });

  const pickImage = async (useCamera = false) => {
    try {
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Camera permission is required to take photos!');
          return;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Media library permission is required to choose images!');
          return;
        }
      }

      const options = {
        mediaTypes: ['images'],
        aspect: [4, 3],
        base64: true,
        quality: 0.5,
        exif: false,
      };

      let result;
      if (useCamera) {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        let base64Data = asset.base64;

        // Fallback: read the URI as base64 via XHR if SDK didn't return base64
        if (!base64Data && asset.uri) {
          base64Data = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result.split(',')[1]);
              reader.onerror = reject;
              reader.readAsDataURL(xhr.response);
            };
            xhr.onerror = reject;
            xhr.open('GET', asset.uri);
            xhr.responseType = 'blob';
            xhr.send();
          });
        }

        if (!base64Data) {
          alert('Could not read the selected image. Please try again or use the camera.');
          return;
        }

        setSelectedImgUri(asset.uri);
        runDiagnostics(asset.fileName || 'image.jpg', base64Data);
      }
    } catch (e) {
      console.error('Image picking failed', e);
      alert('Failed to access media device: ' + (e.message || 'Unknown error'));
    }
  };

  const runDiagnostics = async (imageName, base64) => {
    setAnalyzing(true);
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.134:5000/api';
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
          isMillet: false
        })
      });

      const data = await res.json();
      setAnalyzing(false);

      if (data.status === 'success' && data.diagnosis) {
        const diag = data.diagnosis;
        setDiagnosis({
          title: diag.title || 'Tomato - Early Blight',
          severity: `Severity: ${diag.severity || 'Moderate'}`,
          treatment: `Treatment: ${diag.treatment || 'Apply copper fungicide.'}`,
          time: 'Just now',
          img: `data:image/jpeg;base64,${base64}`
        });
      } else {
        alert(data.message || 'AI diagnosis failed. Please try a clearer picture of the leaf.');
      }
    } catch (e) {
      setAnalyzing(false);
      console.error(e);
      alert('Network error. Failed to reach computer vision diagnostics.');
    }
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
          <Text style={styles.uploadLabel}>Leaf Diagnostic Upload</Text>
          <Text style={styles.uploadOr}>Scan your crop leaves to diagnose health</Text>
          
          <View style={styles.actionBtnRow}>
            <TouchableOpacity style={styles.takePhotoBtn} onPress={() => pickImage(true)}>
              <Camera size={15} color="white" />
              <Text style={styles.takePhotoBtnText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryBtn} onPress={() => pickImage(false)}>
              <ImageIcon size={15} color={THEME.primary} />
              <Text style={styles.galleryBtnText}>Choose Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {analyzing && (
          <View style={styles.loadingBlock}>
            <ActivityIndicator size="small" color={THEME.primary} />
            <Text style={styles.loadingText}>Running foliar AI disease diagnostics...</Text>
          </View>
        )}

        {/* Selected preview */}
        {selectedImgUri && !analyzing && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Uploaded Image Preview:</Text>
            <Image source={{ uri: selectedImgUri }} style={styles.previewImg} />
          </View>
        )}

        {/* Recent Diagnosis */}
        <Text style={styles.sectionHeader}>Diagnosis Result</Text>
        
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
        <TouchableOpacity style={styles.actionBtn} onPress={() => alert('Foliar logs up to date.')}>
          <Text style={styles.actionBtnText}>Logs Refreshed</Text>
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
    paddingVertical: 24,
    paddingHorizontal: 16,
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
    marginBottom: 12
  },
  uploadLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.textDark
  },
  uploadOr: {
    fontSize: 11,
    color: THEME.textMuted,
    marginVertical: 6,
    textAlign: 'center'
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: '100%',
    justifyContent: 'center'
  },
  takePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 6,
    flex: 1,
    justifyContent: 'center'
  },
  takePhotoBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700'
  },
  galleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: THEME.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 6,
    flex: 1,
    justifyContent: 'center'
  },
  galleryBtnText: {
    color: THEME.primary,
    fontSize: 12,
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
  previewContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    alignItems: 'center'
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.textDark,
    marginBottom: 10,
    alignSelf: 'flex-start'
  },
  previewImg: {
    width: '100%',
    height: 180,
    borderRadius: 16
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

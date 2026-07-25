import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Camera, FileUp, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DocumentUploadScreen({ onBack }) {
  const THEME = useTheme();
  const [imageUri, setImageUri] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [metadata, setMetadata] = useState(null);

  const pickImage = async (useCamera = false) => {
    let result;
    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        base64: true
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need gallery permissions to make this work!');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        base64: true
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      processDocument(result.assets[0].base64);
    }
  };

  const processDocument = async (base64) => {
    setIsProcessing(true);
    
    try {
      const token = await AsyncStorage.getItem('@farmer_token');
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.95.196.31:5000/api';
      
      const res = await fetch(`${API_URL}/vault/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentType: 'Personal Document',
          fileDataUrl: `data:image/jpeg;base64,${base64}`
        })
      });
      
      const data = await res.json();
      
      if (data.status === 'success') {
        setMetadata({
          name: data.metadata.name || 'Unknown',
          documentType: data.metadata.documentType || 'Aadhaar Card',
          documentNumber: data.metadata.documentNumber || 'Unknown',
          validity: data.metadata.expiryDate ? 'Valid' : 'N/A'
        });
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Network error. Could not connect to AI Scanner.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: THEME.bg }]}>
      <View style={[styles.header, { backgroundColor: THEME.primary }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Document</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {!imageUri ? (
          <View style={styles.uploadOptions}>
            <Text style={[styles.instruction, { color: THEME.text }]}>Choose how you want to upload your document. We use AI to automatically read and secure it.</Text>
            
            <TouchableOpacity style={[styles.optionCard, { borderColor: THEME.primary }]} onPress={() => pickImage(true)}>
              <Camera size={40} color={THEME.primary} />
              <Text style={[styles.optionText, { color: THEME.primary }]}>Take a Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.optionCard, { borderColor: THEME.textMuted }]} onPress={() => pickImage(false)}>
              <FileUp size={40} color={THEME.textMuted} />
              <Text style={[styles.optionText, { color: THEME.textMuted }]}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.processingView}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            
            {isProcessing ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color={THEME.primary} />
                <Text style={styles.loadingText}>AI is reading document...</Text>
              </View>
            ) : (
              <View style={styles.successBox}>
                <CheckCircle size={40} color="#10B981" />
                <Text style={styles.successTitle}>Document Secured!</Text>
                
                <View style={styles.metaBox}>
                  <Text style={styles.metaLabel}>Detected Type:</Text>
                  <Text style={styles.metaValue}>{metadata?.documentType}</Text>
                  
                  <Text style={styles.metaLabel}>Name on Doc:</Text>
                  <Text style={styles.metaValue}>{metadata?.name}</Text>

                  <Text style={styles.metaLabel}>Doc Number:</Text>
                  <Text style={styles.metaValue}>{metadata?.documentNumber}</Text>
                </View>

                <View style={styles.encryptedBadge}>
                  <ShieldCheck size={16} color="#10B981" />
                  <Text style={styles.encryptedText}>AES-256 Encrypted</Text>
                </View>

                <TouchableOpacity style={[styles.doneBtn, { backgroundColor: THEME.primary }]} onPress={onBack}>
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: 'white' },
  content: { flex: 1, padding: 20 },
  instruction: { fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 24 },
  uploadOptions: { flex: 1, justifyContent: 'center', gap: 20 },
  optionCard: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    gap: 12
  },
  optionText: { fontSize: 18, fontWeight: '600' },
  processingView: { flex: 1, alignItems: 'center' },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 24
  },
  loadingBox: { alignItems: 'center', marginTop: 30 },
  loadingText: { marginTop: 12, fontSize: 16, fontWeight: '600', color: '#4B5563' },
  successBox: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5
  },
  successTitle: { fontSize: 20, fontWeight: '700', color: '#10B981', marginTop: 12, marginBottom: 20 },
  metaBox: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20
  },
  metaLabel: { fontSize: 12, color: '#6B7280', marginTop: 8 },
  metaValue: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  encryptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 24
  },
  encryptedText: { color: '#10B981', fontWeight: '700', fontSize: 13 },
  doneBtn: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  doneBtnText: { color: 'white', fontWeight: '700', fontSize: 16 }
});

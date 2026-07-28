import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  ScrollView,
  Platform
} from 'react-native';
import { Camera, FileUp, ArrowLeft, CheckCircle, ShieldCheck, ChevronDown, Save, FileText } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as FileSystem from 'expo-file-system/legacy';

const DOC_NAMES = [
  'Aadhaar Card',
  'Land Registry Copy',
  'Ration Card',
  'Registration Certificate',
  'Income Certificate',
  'Caste Certificate',
  'Bank Passbook',
  'Sowing Certificate'
];

const DOC_FORMATS = ['Image', 'PDF', 'Word', 'Excel'];
const DOC_CATEGORIES = ['Personal', 'Land', 'Banking', 'Agriculture'];

export default function DocumentUploadScreen({ onBack }) {
  const THEME = useTheme();
  
  // Basic states
  const [imageUri, setImageUri] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [docId, setDocId] = useState(null);

  // Form states (Dropdown picks)
  const [selectedName, setSelectedName] = useState('Aadhaar Card');
  const [selectedFormat, setSelectedFormat] = useState('Image');
  const [selectedCategory, setSelectedCategory] = useState('Personal');

  // Dropdown open states
  const [showNameList, setShowNameList] = useState(false);
  const [showFormatList, setShowFormatList] = useState(false);
  const [showCategoryList, setShowCategoryList] = useState(false);

  const pickImage = async (useCamera = false) => {
    try {
      let result;
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera permissions to make this work!');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          base64: true,
          quality: 0.5,
          exif: false,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need gallery permissions to make this work!');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          base64: true,
          quality: 0.5,
          exif: false,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        let base64Data = asset.base64;

        // If base64 was not returned directly, read the URI as base64
        if (!base64Data && asset.uri) {
          try {
            base64Data = await readUriAsBase64(asset.uri);
          } catch (readErr) {
            console.warn('Failed to read URI as base64, trying FileSystem:', readErr);
            try {
              const fileContent = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
              base64Data = fileContent;
            } catch (fsErr) {
              console.error('FileSystem fallback also failed:', fsErr);
            }
          }
        }

        if (!base64Data) {
          alert('Could not read the selected image. Please try again or use the camera instead.');
          return;
        }

        setImageUri(asset.uri);
        setFileName(null);
        setSelectedFormat('Image');
        processDocument(base64Data, null, 'Image');
      }
    } catch (e) {
      console.error('Image picker error:', e);
      alert('Upload failed: ' + (e.message || 'Unknown error'));
    }
  };

  const readUriAsBase64 = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result.split(',')[1]);
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = (e) => {
        reject(e);
      };
      xhr.open('GET', uri);
      xhr.responseType = 'blob';
      xhr.send();
    });
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true // Copy to cache so we get a readable file:// URI
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setImageUri(null);
        setFileName(file.name);
        
        // Auto-detect format from extension
        let fileFormat = 'Image';
        const ext = (file.name.split('.').pop() || '').toLowerCase();
        if (ext === 'pdf') {
          fileFormat = 'PDF';
        } else if (ext === 'doc' || ext === 'docx') {
          fileFormat = 'Word';
        } else if (ext === 'xls' || ext === 'xlsx') {
          fileFormat = 'Excel';
        }
        setSelectedFormat(fileFormat);

        setIsProcessing(true);
        
        // Read file content natively using React Native's XMLHttpRequest ContentResolver
        const base64Data = await readUriAsBase64(file.uri);

        processDocument(base64Data, file.name, fileFormat);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to pick document from files.');
    }
  };

  const processDocument = async (base64, nameLabel, detectedFormat) => {
    setIsProcessing(true);
    try {
      const token = await AsyncStorage.getItem('@farmer_token');
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.134:5000/api';
      
      const res = await fetch(`${API_URL}/vault/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentType: nameLabel || 'Uploaded File',
          format: detectedFormat || 'Image',
          fileDataUrl: `data:image/jpeg;base64,${base64}`
        })
      });
      
      const data = await res.json();
      
      if (data.status === 'success') {
        setDocId(data.documentId);
        
        // Auto-extract and populate metadata
        const detectedType = data.metadata.documentType || 'Aadhaar Card';
        setMetadata({
          name: data.metadata.name || 'Unknown',
          documentType: detectedType,
          documentNumber: data.metadata.documentNumber || 'Unknown',
          validity: data.metadata.expiryDate ? 'Valid' : 'N/A'
        });

        // Pre-select Category based on scan detection
        let category = 'Personal';
        const docNameLower = detectedType.toLowerCase();
        
        if (docNameLower.includes('land') || docNameLower.includes('registry') || docNameLower.includes('patta')) {
          category = 'Land';
        } else if (docNameLower.includes('bank') || docNameLower.includes('passbook') || docNameLower.includes('income')) {
          category = 'Banking';
        } else if (docNameLower.includes('crop') || docNameLower.includes('sowing') || docNameLower.includes('agriculture')) {
          category = 'Agriculture';
        }

        // Map AI type to our selection options if matching
        const matchedName = DOC_NAMES.find(n => n.toLowerCase() === docNameLower) || 'Aadhaar Card';
        
        setSelectedName(matchedName);
        setSelectedCategory(category);
      } else {
        alert('Upload failed: ' + data.message);
        setImageUri(null);
        setFileName(null);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Network error. Could not connect to AI Scanner.');
      setImageUri(null);
      setFileName(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToVault = async () => {
    setIsSaving(true);
    try {
      const token = await AsyncStorage.getItem('@farmer_token');
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.134:5000/api';
      
      const res = await fetch(`${API_URL}/vault/document/${docId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentType: selectedName,
          category: selectedCategory,
          format: selectedFormat
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        alert('Document saved in Kissan Secure Vault!');
        onBack();
      } else {
        alert('Failed to save metadata: ' + data.message);
      }
    } catch (e) {
      console.error(e);
      alert('Network error. Failed to save details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: THEME.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: THEME.primary }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Document</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!imageUri && !fileName ? (
          <View style={styles.uploadOptions}>
            <Text style={[styles.instruction, { color: THEME.text }]}>
              Choose how you want to upload your document. We use AI to automatically read and secure it.
            </Text>
            
            <TouchableOpacity style={[styles.optionCard, { borderColor: THEME.primary }]} onPress={() => pickImage(true)}>
              <Camera size={36} color={THEME.primary} />
              <Text style={[styles.optionText, { color: THEME.primary }]}>Take a Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.optionCard, { borderColor: THEME.textMuted }]} onPress={() => pickImage(false)}>
              <FileUp size={36} color={THEME.textMuted} />
              <Text style={[styles.optionText, { color: THEME.textMuted }]}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.optionCard, { borderColor: '#3B82F6' }]} onPress={pickDocument}>
              <FileText size={36} color="#3B82F6" />
              <Text style={[styles.optionText, { color: '#3B82F6' }]}>Browse System Files (PDF, Word, Excel)</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.processingView}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={[styles.filePlaceholderBox, { backgroundColor: THEME.glassBorder }]}>
                <FileText size={64} color={THEME.primary} />
                <Text style={[styles.fileNameText, { color: THEME.text }]} numberOfLines={1}>
                  {fileName}
                </Text>
                <Text style={{ fontSize: 12, color: THEME.textMuted, marginTop: 4, fontWeight: '700' }}>
                  System File Format: {selectedFormat}
                </Text>
              </View>
            )}
            
            {isProcessing ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color={THEME.primary} />
                <Text style={styles.loadingText}>AI is reading document...</Text>
              </View>
            ) : (
              <View style={styles.successBox}>
                <CheckCircle size={32} color="#10B981" />
                <Text style={styles.successTitle}>Scan Complete & Encrypted!</Text>

                {/* AI Extracted Metadata Box */}
                <View style={styles.metaBox}>
                  <Text style={styles.metaTitle}>AI Extracted Details:</Text>
                  
                  <Text style={styles.metaLabel}>Detected Owner Name:</Text>
                  <Text style={styles.metaValue}>{metadata?.name}</Text>

                  <Text style={styles.metaLabel}>Document Number:</Text>
                  <Text style={styles.metaValue}>{metadata?.documentNumber}</Text>
                </View>

                {/* Form fields for User customization */}
                <Text style={styles.formHeader}>Select Vault Categories:</Text>

                {/* 1. Document Name Dropdown */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Document Name:</Text>
                  <TouchableOpacity 
                    style={styles.dropdownTrigger} 
                    onPress={() => {
                      setShowNameList(!showNameList);
                      setShowFormatList(false);
                      setShowCategoryList(false);
                    }}
                  >
                    <Text style={styles.dropdownTriggerText}>{selectedName}</Text>
                    <ChevronDown size={18} color={THEME.textDark} />
                  </TouchableOpacity>
                  {showNameList && (
                    <View style={styles.dropdownOptions}>
                      {DOC_NAMES.map(name => (
                        <TouchableOpacity 
                          key={name} 
                          style={styles.dropdownOption} 
                          onPress={() => {
                            setSelectedName(name);
                            setShowNameList(false);
                          }}
                        >
                          <Text style={styles.dropdownOptionText}>{name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* 2. Document Format Dropdown */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Document Format:</Text>
                  <TouchableOpacity 
                    style={styles.dropdownTrigger} 
                    onPress={() => {
                      setShowFormatList(!showFormatList);
                      setShowNameList(false);
                      setShowCategoryList(false);
                    }}
                  >
                    <Text style={styles.dropdownTriggerText}>{selectedFormat}</Text>
                    <ChevronDown size={18} color={THEME.textDark} />
                  </TouchableOpacity>
                  {showFormatList && (
                    <View style={styles.dropdownOptions}>
                      {DOC_FORMATS.map(f => (
                        <TouchableOpacity 
                          key={f} 
                          style={styles.dropdownOption} 
                          onPress={() => {
                            setSelectedFormat(f);
                            setShowFormatList(false);
                          }}
                        >
                          <Text style={styles.dropdownOptionText}>{f}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* 3. Document Category Dropdown */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Secure Vault Category:</Text>
                  <TouchableOpacity 
                    style={styles.dropdownTrigger} 
                    onPress={() => {
                      setShowCategoryList(!showCategoryList);
                      setShowNameList(false);
                      setShowFormatList(false);
                    }}
                  >
                    <Text style={styles.dropdownTriggerText}>{selectedCategory}</Text>
                    <ChevronDown size={18} color={THEME.textDark} />
                  </TouchableOpacity>
                  {showCategoryList && (
                    <View style={styles.dropdownOptions}>
                      {DOC_CATEGORIES.map(cat => (
                        <TouchableOpacity 
                          key={cat} 
                          style={styles.dropdownOption} 
                          onPress={() => {
                            setSelectedCategory(cat);
                            setShowCategoryList(false);
                          }}
                        >
                          <Text style={styles.dropdownOptionText}>{cat}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.encryptedBadge}>
                  <ShieldCheck size={16} color="#10B981" />
                  <Text style={styles.encryptedText}>AES-256 Encrypted</Text>
                </View>

                <TouchableOpacity 
                  style={[styles.doneBtn, { backgroundColor: THEME.primary }]} 
                  onPress={handleSaveToVault}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Save size={16} color="white" style={{ marginRight: 6 }} />
                      <Text style={styles.doneBtnText}>Save to Secure Vault</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
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
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: 'white' },
  scrollContent: { padding: 20, paddingBottom: 60 },
  instruction: { fontSize: 15, textAlign: 'center', marginBottom: 30, lineHeight: 22, fontWeight: '600' },
  uploadOptions: { flex: 1, justifyContent: 'center', gap: 16, marginTop: 20 },
  optionCard: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    gap: 8
  },
  optionText: { fontSize: 14, fontWeight: '700' },
  processingView: { flex: 1, alignItems: 'center' },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 20
  },
  filePlaceholderBox: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 20,
    marginBottom: 20
  },
  fileNameText: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 10,
    textAlign: 'center',
    width: '80%'
  },
  loadingBox: { alignItems: 'center', marginTop: 30 },
  loadingText: { marginTop: 12, fontSize: 15, fontWeight: '600', color: '#4B5563' },
  successBox: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e8eae3'
  },
  successTitle: { fontSize: 17, fontWeight: '800', color: '#10B981', marginTop: 10, marginBottom: 16 },
  metaBox: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  metaTitle: { fontSize: 13, fontWeight: '800', color: '#374151', marginBottom: 8 },
  metaLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 6, fontWeight: '600' },
  metaValue: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  formHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 12
  },
  inputGroup: {
    width: '100%',
    marginBottom: 14,
    zIndex: 10
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FAFCFA'
  },
  dropdownTriggerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937'
  },
  dropdownOptions: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginTop: 6,
    maxHeight: 180,
    overflow: 'scroll'
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  dropdownOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151'
  },
  encryptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginVertical: 16
  },
  encryptedText: { color: '#10B981', fontWeight: '800', fontSize: 12 },
  doneBtn: {
    width: '100%',
    padding: 14,
    borderRadius: 28,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  doneBtnText: { color: 'white', fontWeight: '800', fontSize: 15 }
});

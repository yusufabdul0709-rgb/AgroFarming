import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { ChevronRight, ShieldCheck, Save, X, Camera, MapPin, Sprout, FileText, Globe, LogOut, ChevronLeft } from 'lucide-react-native';
import MapboxAgriMap from '../components/MapboxAgriMap';
import { THEME } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import useDeviceLocation from '../hooks/useDeviceLocation';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

export default function ProfileScreen({ onBack, onLogout }) {
  const { farmerProfile, farmTwin, saveFarmerProfile, saveFarmTwin } = useProfile();
  const { location, address, errorMsg } = useDeviceLocation();

  let gpsLocation = farmerProfile?.gpsLocation;
  if (typeof gpsLocation === 'string') {
    try {
      gpsLocation = JSON.parse(gpsLocation);
    } catch (e) {
      console.warn('Failed to parse gpsLocation string', e);
      gpsLocation = null;
    }
  }

  const currentLat = gpsLocation?.latitude || location?.latitude || 17.6868;
  const currentLng = gpsLocation?.longitude || location?.longitude || 83.2185;
  const locName = [farmerProfile.village, farmerProfile.district, farmerProfile.state]
    .filter(Boolean)
    .join(', ') || address || 'Visakhapatnam, Andhra Pradesh';

  // Modals visibility
  const [showFarmModal, setShowFarmModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showFullScreenMap, setShowFullScreenMap] = useState(false);

  // Farm Details Form State
  const [farmName, setFarmName] = useState('');
  const [landArea, setLandArea] = useState('');
  const [soilType, setSoilType] = useState('');
  const [irrigationSource, setIrrigationSource] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [waterAvailability, setWaterAvailability] = useState('');

  // Crops Form State
  const [currentCropsText, setCurrentCropsText] = useState('');
  const [cropStage, setCropStage] = useState('');
  const [estimatedYield, setEstimatedYield] = useState('');

  const openFarmModal = () => {
    setFarmName(farmTwin?.name || 'My Farm Twin');
    setLandArea(String(farmerProfile?.landArea || ''));
    setSoilType(farmerProfile?.soilType || 'Loamy');
    setIrrigationSource(farmerProfile?.irrigationSource || 'Tube Well');
    setVillage(farmerProfile?.village || '');
    setDistrict(farmerProfile?.district || '');
    setState(farmerProfile?.state || '');
    setWaterAvailability(farmerProfile?.waterAvailability || 'Moderate');
    setShowFarmModal(true);
  };

  const openCropModal = () => {
    const cropsArr = farmerProfile?.currentCrops || [];
    setCurrentCropsText(Array.isArray(cropsArr) ? cropsArr.join(', ') : String(cropsArr));
    setCropStage(farmTwin?.cropStatus?.stage || 'Vegetative');
    setEstimatedYield(String(farmTwin?.cropStatus?.estimatedYield || ''));
    setShowCropModal(true);
  };

  const handleSaveFarm = async () => {
    await saveFarmerProfile({
      landArea: parseFloat(landArea) || 0,
      soilType,
      irrigationSource,
      waterAvailability,
      village,
      district,
      state
    });

    await saveFarmTwin({
      name: farmName,
      soilProfile: {
        pH: soilType.toLowerCase().includes('sandy') ? 6.2 : 6.8,
        moisture: waterAvailability === 'High' ? 65 : waterAvailability === 'Low' ? 30 : 48,
        nitrogen: 110,
        phosphorus: 38,
        potassium: 195
      }
    });

    setShowFarmModal(false);
    Alert.alert('Success', 'Farm details successfully saved and synced!');
  };

  const handleSaveCrops = async () => {
    const cropsArr = currentCropsText.split(',').map(c => c.trim()).filter(Boolean);
    
    await saveFarmerProfile({
      currentCrops: cropsArr
    });

    await saveFarmTwin({
      cropStatus: {
        cropName: cropsArr[0] || 'Paddy',
        stage: cropStage,
        growthPercentage: cropStage === 'Harvested' ? 100 : cropStage === 'Maturity' ? 85 : cropStage === 'Flowering' ? 60 : 35,
        estimatedYield: parseFloat(estimatedYield) || 0,
        plantedDate: new Date().toISOString()
      }
    });

    setShowCropModal(false);
    Alert.alert('Success', 'Crop details successfully saved and synced!');
  };

  const handlePickAvatar = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission needed', 'Please grant permission to access your photos.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64String = `data:image/jpeg;base64,${result.assets[0].base64}`;
        await saveFarmerProfile({ avatar: base64String });
        Alert.alert('Success', 'Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to update profile picture.');
    }
  };

  const menuItems = [
    { label: 'My Farm Details', sub: farmerProfile.village ? `${farmerProfile.village}, ${farmerProfile.district}` : 'Not set', action: openFarmModal, icon: <MapPin size={20} color={THEME.primary} /> },
    { label: 'My Crops', sub: farmerProfile.currentCrops ? (Array.isArray(farmerProfile.currentCrops) ? farmerProfile.currentCrops.join(', ') : String(farmerProfile.currentCrops)) : 'Not set', action: openCropModal, icon: <Sprout size={20} color={THEME.primary} /> },
    { label: 'Transaction History', sub: 'View past deals', action: () => alert('Launching historical transactions...'), icon: <FileText size={20} color={THEME.primary} /> },
    { label: 'Language', sub: farmerProfile.preferredLanguage || 'English', action: () => alert('Language options...'), icon: <Globe size={20} color={THEME.primary} /> }
  ];

  return (
    <LinearGradient colors={['#F6FAFF', '#E9F5EB']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={24} color={THEME.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']} style={styles.glassmorphismBg} />
          
          <TouchableOpacity onPress={handlePickAvatar} style={styles.avatarContainer}>
            <Image 
              source={{ uri: farmerProfile?.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80' }} 
              style={styles.avatar} 
            />
            <View style={styles.cameraIconContainer}>
              <Camera size={16} color="white" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.name}>{farmerProfile.name || 'Farmer Account'}</Text>
          <Text style={styles.phone}>{farmerProfile.phone || 'Add Phone Number'}</Text>
          
          <View style={styles.badge}>
            <ShieldCheck size={16} color="white" />
            <Text style={styles.badgeText}>Verified Farmer</Text>
          </View>
        </View>

        {/* Map Preview Card */}
        <View style={styles.mapCard}>
          <LinearGradient colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']} style={styles.glassmorphismBg} />
          <View style={styles.mapCardHeader}>
            <MapPin size={18} color={THEME.primary} />
            <Text style={styles.mapCardTitle}>Registered Farm Location</Text>
          </View>
          <View style={styles.mapContainer}>
            <MapboxAgriMap
              latitude={currentLat}
              longitude={currentLng}
              title="Registered Agriculture Farm"
              locationName={locName}
              height={180}
              onExpand={() => setShowFullScreenMap(true)}
            />
          </View>
          <View style={styles.mapDetails}>
            <Text style={styles.mapDetailsText} numberOfLines={1}>
              {locName}
            </Text>
            <Text style={styles.mapCoords}>
              {currentLat.toFixed(4)}°, {currentLng.toFixed(4)}°
            </Text>
          </View>
        </View>

        {/* Menu list options */}
        <View style={styles.menuContainer}>
          <LinearGradient colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']} style={styles.glassmorphismBg} />
          {menuItems.map((item, i) => (
            <TouchableOpacity 
              key={i} 
              style={[styles.menuRow, i === menuItems.length - 1 && styles.menuRowLast]}
              onPress={item.action}
            >
              <View style={styles.menuIconWrapper}>
                {item.icon}
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.sub ? (
                  <Text style={styles.menuSubText} numberOfLines={1}>{item.sub}</Text>
                ) : null}
              </View>
              <ChevronRight size={20} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={onLogout}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal - Full Screen Map */}
      <Modal visible={showFullScreenMap} animationType="slide" transparent={false}>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <MapboxAgriMap
            latitude={currentLat}
            longitude={currentLng}
            title="Registered Agriculture Farm"
            locationName={locName}
            height="100%"
          />
          <TouchableOpacity 
            style={styles.closeMapBtn}
            onPress={() => setShowFullScreenMap(false)}
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal - My Farm Details */}
      <Modal visible={showFarmModal} animationType="slide" transparent={true}>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Farm Details</Text>
              <TouchableOpacity onPress={() => setShowFarmModal(false)} style={styles.closeBtn}>
                <X size={20} color={THEME.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Farm Name</Text>
              <TextInput style={styles.modalInput} value={farmName} onChangeText={setFarmName} placeholder="e.g. South wheat plot" placeholderTextColor="#94A3B8" />

              <View style={styles.inputRow}>
                <View style={styles.inputFlex}>
                  <Text style={styles.inputLabel}>Area (Acres)</Text>
                  <TextInput style={styles.modalInput} value={landArea} onChangeText={setLandArea} keyboardType="numeric" placeholder="e.g. 2.5" placeholderTextColor="#94A3B8" />
                </View>
                <View style={styles.inputFlex}>
                  <Text style={styles.inputLabel}>Soil Type</Text>
                  <TextInput style={styles.modalInput} value={soilType} onChangeText={setSoilType} placeholder="e.g. Alluvial" placeholderTextColor="#94A3B8" />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputFlex}>
                  <Text style={styles.inputLabel}>Irrigation</Text>
                  <TextInput style={styles.modalInput} value={irrigationSource} onChangeText={setIrrigationSource} placeholder="e.g. Tube Well" placeholderTextColor="#94A3B8" />
                </View>
                <View style={styles.inputFlex}>
                  <Text style={styles.inputLabel}>Water Level</Text>
                  <TextInput style={styles.modalInput} value={waterAvailability} onChangeText={setWaterAvailability} placeholder="e.g. Moderate" placeholderTextColor="#94A3B8" />
                </View>
              </View>

              <Text style={styles.inputLabel}>Village</Text>
              <TextInput style={styles.modalInput} value={village} onChangeText={setVillage} placeholder="Village name" placeholderTextColor="#94A3B8" />

              <View style={styles.inputRow}>
                <View style={styles.inputFlex}>
                  <Text style={styles.inputLabel}>District</Text>
                  <TextInput style={styles.modalInput} value={district} onChangeText={setDistrict} placeholder="District" placeholderTextColor="#94A3B8" />
                </View>
                <View style={styles.inputFlex}>
                  <Text style={styles.inputLabel}>State</Text>
                  <TextInput style={styles.modalInput} value={state} onChangeText={setState} placeholder="State" placeholderTextColor="#94A3B8" />
                </View>
              </View>
              <View style={{ height: 20 }} />
            </ScrollView>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveFarm}>
              <LinearGradient colors={[THEME.primary, '#1e5436']} style={styles.saveBtnGradient}>
                <Save size={18} color="white" />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Modal - My Crops */}
      <Modal visible={showCropModal} animationType="slide" transparent={true}>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Crop Details</Text>
              <TouchableOpacity onPress={() => setShowCropModal(false)} style={styles.closeBtn}>
                <X size={20} color={THEME.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Current Crops (comma-separated)</Text>
              <TextInput style={styles.modalInput} value={currentCropsText} onChangeText={setCurrentCropsText} placeholder="e.g. Paddy, Wheat" placeholderTextColor="#94A3B8" />

              <Text style={styles.inputLabel}>Growth Stage</Text>
              <TextInput style={styles.modalInput} value={cropStage} onChangeText={setCropStage} placeholder="e.g. Flowering" placeholderTextColor="#94A3B8" />

              <Text style={styles.inputLabel}>Estimated Yield (tons/hectare)</Text>
              <TextInput style={styles.modalInput} value={estimatedYield} onChangeText={setEstimatedYield} keyboardType="numeric" placeholder="e.g. 4.2" placeholderTextColor="#94A3B8" />
              <View style={{ height: 20 }} />
            </ScrollView>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveCrops}>
              <LinearGradient colors={[THEME.primary, '#1e5436']} style={styles.saveBtnGradient}>
                <Save size={18} color="white" />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.textDark,
    letterSpacing: -0.5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  glassmorphismBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  profileCard: {
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#475e4e',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 4,
    backgroundColor: THEME.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.textDark,
    letterSpacing: -0.5,
  },
  phone: {
    fontSize: 14,
    color: THEME.textMuted,
    marginTop: 6,
    fontWeight: '500',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    marginTop: 16,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
  },
  mapCard: {
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#475e4e',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  mapCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  mapCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.textDark,
  },
  mapContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
  },
  mapDetails: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 12,
    borderRadius: 16,
  },
  mapDetailsText: {
    fontSize: 13,
    color: THEME.textDark,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },
  mapCoords: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: '600',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  menuContainer: {
    borderRadius: 28,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#475e4e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  menuRowLast: {
    borderBottomWidth: 0,
  },
  menuIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textDark,
    marginBottom: 2,
  },
  menuSubText: {
    fontSize: 13,
    color: THEME.textMuted,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 40,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
  closeMapBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 24,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.textDark,
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalForm: {
    maxHeight: '80%',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    marginTop: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: THEME.textDark,
    backgroundColor: '#F8FAFC',
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
  },
  inputFlex: {
    flex: 1,
  },
  saveBtn: {
    marginTop: 16,
    marginBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  saveBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 24,
    gap: 10,
  },
  saveBtnText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
  },
});


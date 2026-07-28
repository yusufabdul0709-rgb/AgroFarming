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
  Platform
} from 'react-native';
import { ChevronRight, ShieldCheck, Save, X } from 'lucide-react-native';
import MapboxAgriMap from '../components/MapboxAgriMap';
import { THEME } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

export default function ProfileScreen({ onBack, onLogout }) {
  const { farmerProfile, farmTwin, saveFarmerProfile, saveFarmTwin } = useProfile();

  let gpsLocation = farmerProfile?.gpsLocation;
  if (typeof gpsLocation === 'string') {
    try {
      gpsLocation = JSON.parse(gpsLocation);
    } catch (e) {
      console.warn('Failed to parse gpsLocation string', e);
      gpsLocation = null;
    }
  }

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
    alert('Farm details successfully saved and synced!');
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
    alert('Crop details successfully saved and synced!');
  };

  const menuItems = [
    { label: 'My Farm Details', sub: farmerProfile.village ? `${farmerProfile.village}, ${farmerProfile.district}` : 'Not set', action: openFarmModal },
    { label: 'My Crops', sub: farmerProfile.currentCrops ? (Array.isArray(farmerProfile.currentCrops) ? farmerProfile.currentCrops.join(', ') : String(farmerProfile.currentCrops)) : 'Not set', action: openCropModal },
    { label: 'Transaction History', sub: '', action: () => alert('Launching historical transactions...') },
    { label: 'Saved Reports', sub: '', action: () => alert('Opening saved diagnostic reports...') },
    { label: 'Language', sub: farmerProfile.preferredLanguage || 'English', action: () => alert('Language options...') }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80' }} 
            style={styles.avatar} 
          />
          <Text style={styles.name}>{farmerProfile.name || 'Farmer Account'}</Text>
          <Text style={styles.phone}>{farmerProfile.phone || 'Phone Number'}</Text>
          
          <View style={styles.badge}>
            <ShieldCheck size={14} color={THEME.primary} />
            <Text style={styles.badgeText}>Verified Farmer</Text>
          </View>
        </View>

        {/* Map Preview Card */}
        <View style={styles.mapCard}>
          <Text style={styles.mapCardTitle}>📍 Registered Farm Location</Text>
          <MapboxAgriMap
            latitude={gpsLocation?.latitude || 17.6868}
            longitude={gpsLocation?.longitude || 83.2185}
            title="Registered Agriculture Farm"
            locationName={
              [farmerProfile.village, farmerProfile.district, farmerProfile.state]
                .filter(Boolean)
                .join(', ') || 'Visakhapatnam, Andhra Pradesh'
            }
            height={240}
            onExpand={() => setShowFullScreenMap(true)}
          />
          <View style={styles.mapDetails}>
            <Text style={styles.mapDetailsText}>
              {farmerProfile.village ? `${farmerProfile.village}, ` : ''}
              {farmerProfile.district ? `${farmerProfile.district}, ` : ''}
              {farmerProfile.state || 'Andhra Pradesh'}
            </Text>
            <Text style={styles.mapCoords}>
              {(gpsLocation?.latitude || 17.6868).toFixed(5)}° N, {(gpsLocation?.longitude || 83.2185).toFixed(5)}° E
            </Text>
          </View>
        </View>


        {/* Menu list options */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, i) => (
            <TouchableOpacity 
              key={i} 
              style={styles.menuRow}
              onPress={item.action}
            >
              <Text style={styles.menuLabel}>{item.label}</Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'flex-end' }}>
                {item.sub ? (
                  <Text style={styles.menuSubText} numberOfLines={1} ellipsizeMode="tail">{item.sub}</Text>
                ) : null}
                <ChevronRight size={16} color={THEME.textMuted} />
              </View>
            </TouchableOpacity>
          ))}

          {/* Logout */}
          <TouchableOpacity 
            style={[styles.menuRow, { borderBottomWidth: 0 }]}
            onPress={onLogout}
          >
            <Text style={[styles.menuLabel, { color: '#F44336' }]}>Logout</Text>
            <ChevronRight size={16} color="#F44336" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal - Full Screen Map */}
      <Modal visible={showFullScreenMap} animationType="slide" transparent={false}>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <MapboxAgriMap
            latitude={gpsLocation?.latitude || 17.6868}
            longitude={gpsLocation?.longitude || 83.2185}
            title="Registered Agriculture Farm"
            locationName={
              [farmerProfile.village, farmerProfile.district, farmerProfile.state]
                .filter(Boolean)
                .join(', ') || 'Visakhapatnam, Andhra Pradesh'
            }
            height="100%"
          />
          <TouchableOpacity 
            style={{ position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 24 }}
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
              <Text style={styles.modalTitle}>Edit Farm Details</Text>
              <TouchableOpacity onPress={() => setShowFarmModal(false)}>
                <X size={20} color={THEME.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Farm Name</Text>
              <TextInput style={styles.modalInput} value={farmName} onChangeText={setFarmName} placeholder="e.g. South wheat plot" />

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Land Area (Acres)</Text>
                  <TextInput style={styles.modalInput} value={landArea} onChangeText={setLandArea} keyboardType="numeric" placeholder="e.g. 2.5" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Soil Type</Text>
                  <TextInput style={styles.modalInput} value={soilType} onChangeText={setSoilType} placeholder="e.g. Alluvial / Clay" />
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Irrigation Source</Text>
                  <TextInput style={styles.modalInput} value={irrigationSource} onChangeText={setIrrigationSource} placeholder="e.g. Tube Well" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Water Level</Text>
                  <TextInput style={styles.modalInput} value={waterAvailability} onChangeText={setWaterAvailability} placeholder="e.g. Moderate" />
                </View>
              </View>

              <Text style={styles.inputLabel}>Village</Text>
              <TextInput style={styles.modalInput} value={village} onChangeText={setVillage} placeholder="Village name" />

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>District</Text>
                  <TextInput style={styles.modalInput} value={district} onChangeText={setDistrict} placeholder="District name" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>State</Text>
                  <TextInput style={styles.modalInput} value={state} onChangeText={setState} placeholder="State name" />
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveFarm}>
              <Save size={16} color="white" />
              <Text style={styles.saveBtnText}>Save and Sync</Text>
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
              <Text style={styles.modalTitle}>Edit Crops Details</Text>
              <TouchableOpacity onPress={() => setShowCropModal(false)}>
                <X size={20} color={THEME.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Current Crops (comma-separated)</Text>
              <TextInput style={styles.modalInput} value={currentCropsText} onChangeText={setCurrentCropsText} placeholder="e.g. Paddy, Wheat, Maize" />

              <Text style={styles.inputLabel}>Growth Stage</Text>
              <TextInput style={styles.modalInput} value={cropStage} onChangeText={setCropStage} placeholder="e.g. Vegetative / Flowering / Maturity" />

              <Text style={styles.inputLabel}>Estimated Yield (tons/hectare)</Text>
              <TextInput style={styles.modalInput} value={estimatedYield} onChangeText={setEstimatedYield} keyboardType="numeric" placeholder="e.g. 4.2" />
            </ScrollView>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveCrops}>
              <Save size={16} color="white" />
              <Text style={styles.saveBtnText}>Save and Sync</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    alignItems: 'center',
    shadowColor: '#1b2e1b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: THEME.primary,
    marginBottom: 12
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.textDark
  },
  phone: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 4,
    fontWeight: '600'
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(44, 107, 67, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    marginTop: 12
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.primary
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.glassBorder
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.05)',
    paddingHorizontal: 8
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textDark
  },
  menuSubText: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: '600',
    maxWidth: 160,
    textAlign: 'right'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: '90%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.textDark
  },
  modalForm: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.textDark,
    marginBottom: 6,
    marginTop: 12
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.1)',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: THEME.textDark,
    backgroundColor: '#fafcfa'
  },
  saveBtn: {
    backgroundColor: THEME.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 30,
    gap: 8,
    marginBottom: Platform.OS === 'ios' ? 24 : 0
  },
  saveBtnText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 15
  },
  mapCard: {
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    shadowColor: '#1b2e1b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20
  },
  mapCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.textDark,
    marginBottom: 10
  },
  mapContainer: {
    height: 150,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.08)'
  },
  map: {
    flex: 1
  },
  mapDetails: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  mapDetailsText: {
    fontSize: 12,
    color: THEME.textDark,
    fontWeight: '750',
    flex: 1
  },
  mapCoords: {
    fontSize: 10.5,
    color: THEME.textMuted,
    fontWeight: '600'
  }
});

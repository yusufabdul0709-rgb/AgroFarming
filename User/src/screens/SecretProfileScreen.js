import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Switch, 
  Alert 
} from 'react-native';
import { 
  User, 
  Lock, 
  Unlock, 
  FileText, 
  ShieldCheck, 
  Save, 
  MapPin, 
  Tractor, 
  Eye, 
  CheckCircle, 
  FileCheck 
} from 'lucide-react-native';
import { useProfile } from '../context/ProfileContext';

export default function SecretProfileScreen() {
  const { farmerProfile, saveFarmerProfile } = useProfile();

  const [name, setName] = useState(farmerProfile.name || 'Ramesh Kumar');
  const [village, setVillage] = useState(farmerProfile.village || 'Razam');
  const [acres, setAcres] = useState(farmerProfile.acres || '15.4');
  const [crop, setCrop] = useState(farmerProfile.crop || 'Wheat & Barley');

  const [isVaultLocked, setIsVaultLocked] = useState(true);
  const [vaultPin, setVaultPin] = useState('');
  const [pinUnlocked, setPinUnlocked] = useState(false);

  const [documents] = useState([
    { id: '1', title: 'Land Record (Khasra 452/B)', type: 'PDF Document', size: '2.4 MB', date: '12 May 2024', verified: true },
    { id: '2', title: 'Aadhaar Card (Encrypted)', type: 'Identity Proof', size: '1.1 MB', date: '08 Jan 2024', verified: true },
    { id: '3', title: 'Soil Health Card 2024', type: 'Lab Report', size: '3.8 MB', date: '20 Mar 2024', verified: true },
    { id: '4', title: 'Kisan Credit Card (Passbook)', type: 'Financial Doc', size: '1.9 MB', date: '02 Feb 2024', verified: true },
  ]);

  const handleSaveProfile = () => {
    saveFarmerProfile({
      name,
      village,
      acres,
      crop
    });
    Alert.alert('Success', 'Farmer profile and vault updated successfully!');
  };

  const handleUnlockVault = () => {
    if (vaultPin === '1234' || vaultPin === '') {
      setPinUnlocked(true);
      setIsVaultLocked(false);
    } else {
      Alert.alert('Invalid PIN', 'Enter 1234 to unlock the secret document locker.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Farmer Vault & Profile</Text>
        <TouchableOpacity style={styles.saveHeaderBtn} onPress={handleSaveProfile}>
          <Save size={16} color="white" />
          <Text style={styles.saveHeaderTxt}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar Card */}
      <View style={styles.profileCard}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
          style={styles.avatarImage} 
        />
        <View style={styles.profileMeta}>
          <Text style={styles.farmerName}>{name || 'Farmer Profile'}</Text>
          <View style={styles.locationBadge}>
            <MapPin size={12} color="#2e7d32" />
            <Text style={styles.locationTxt}>{village}, India</Text>
          </View>
        </View>
      </View>

      {/* Editable Fields */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Farmer Name</Text>
          <TextInput 
            style={styles.fieldInput} 
            value={name} 
            onChangeText={setName} 
          />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Village / Region</Text>
          <TextInput 
            style={styles.fieldInput} 
            value={village} 
            onChangeText={setVillage} 
          />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Land Area (Acres)</Text>
          <TextInput 
            style={styles.fieldInput} 
            value={acres} 
            onChangeText={setAcres} 
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Primary Crop</Text>
          <TextInput 
            style={styles.fieldInput} 
            value={crop} 
            onChangeText={setCrop} 
          />
        </View>
      </View>

      {/* SECRET VAULT SECTION */}
      <View style={[styles.sectionCard, styles.vaultCard]}>
        <View style={styles.vaultHeaderRow}>
          <View style={styles.vaultTitleGrp}>
            <ShieldCheck size={22} color={isVaultLocked ? '#d32f2f' : '#2e7d32'} />
            <Text style={styles.vaultTitle}>Secret Land Vault</Text>
          </View>
          <Switch 
            value={!isVaultLocked} 
            onValueChange={(val) => {
              if (val) {
                if (pinUnlocked || vaultPin === '1234' || vaultPin === '') {
                  setPinUnlocked(true);
                  setIsVaultLocked(false);
                } else {
                  Alert.alert('Unlock Vault', 'Enter default PIN 1234 to view secret land records.');
                }
              } else {
                setIsVaultLocked(true);
              }
            }} 
            trackColor={{ false: '#e0e0e0', true: '#c8e6c9' }}
            thumbColor={!isVaultLocked ? '#2e7d32' : '#9e9e9e'}
          />
        </View>
        <Text style={styles.vaultSub}>AES-256 Encrypted Storage for Land Records & Identity Docs</Text>

        {isVaultLocked ? (
          <View style={styles.lockedContainer}>
            <Lock size={36} color="#d32f2f" />
            <Text style={styles.lockedTxt}>Secret Locker is Locked</Text>
            <Text style={styles.lockedDesc}>Enter Security PIN to access confidential farm documents</Text>
            
            <View style={styles.pinInputRow}>
              <TextInput 
                style={styles.pinInput} 
                placeholder="PIN (1234)" 
                placeholderTextColor="#9e9e9e"
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                value={vaultPin}
                onChangeText={setVaultPin}
              />
              <TouchableOpacity style={styles.unlockBtn} onPress={handleUnlockVault}>
                <Unlock size={16} color="white" />
                <Text style={styles.unlockBtnTxt}>Unlock</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.unlockedDocsList}>
            {documents.map((doc) => (
              <View key={doc.id} style={styles.docItem}>
                <View style={styles.docIconBadge}>
                  <FileText size={20} color="#1b4332" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.docTitle}>{doc.title}</Text>
                    {doc.verified && <CheckCircle size={14} color="#2e7d32" />}
                  </View>
                  <Text style={styles.docMeta}>{doc.type} • {doc.size} • Added {doc.date}</Text>
                </View>
                <TouchableOpacity style={styles.viewDocBtn} onPress={() => Alert.alert('Viewing Document', `Opening ${doc.title}`)}>
                  <Eye size={16} color="#1b4332" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.uploadDocBtn} onPress={() => Alert.alert('Upload Document', 'Select PDF or Land Image to add to Vault.')}>
              <FileCheck size={18} color="#2e7d32" />
              <Text style={styles.uploadDocTxt}>+ Add New Document to Vault</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f4',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1b4332',
  },
  saveHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e7d32',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  saveHeaderTxt: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileMeta: {
    flex: 1,
  },
  farmerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b4332',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationTxt: {
    fontSize: 13,
    color: '#52796f',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b4332',
    marginBottom: 16,
  },
  fieldRow: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#52796f',
    fontWeight: '600',
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: '#f8faf8',
    borderWidth: 1,
    borderColor: '#e0e7e0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1b4332',
    fontWeight: '600',
  },
  vaultCard: {
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  vaultHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vaultTitleGrp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vaultTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1b4332',
  },
  vaultSub: {
    fontSize: 12,
    color: '#52796f',
    marginTop: 4,
    marginBottom: 16,
  },
  lockedContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff5f5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  lockedTxt: {
    fontSize: 16,
    fontWeight: '700',
    color: '#d32f2f',
    marginTop: 8,
  },
  lockedDesc: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
    marginBottom: 16,
  },
  pinInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pinInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ffcdd2',
    borderRadius: 12,
    paddingHorizontal: 14,
    width: 110,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
  },
  unlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  unlockBtnTxt: {
    color: 'white',
    fontWeight: '700',
  },
  unlockedDocsList: {
    gap: 12,
    marginTop: 8,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f7f4',
    padding: 12,
    borderRadius: 14,
    gap: 12,
  },
  docIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1b4332',
  },
  docMeta: {
    fontSize: 11,
    color: '#7f8c8d',
    marginTop: 2,
  },
  viewDocBtn: {
    padding: 8,
  },
  uploadDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#2e7d32',
    borderRadius: 14,
    gap: 8,
    marginTop: 8,
  },
  uploadDocTxt: {
    color: '#2e7d32',
    fontWeight: '700',
    fontSize: 13,
  },
});

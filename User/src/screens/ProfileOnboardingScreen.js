import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import PillButton from '../components/PillButton';

export default function ProfileOnboardingScreen({ onFinish }) {
  const { farmerProfile, saveFarmerProfile } = useProfile();
  
  // Use local state for the form so we can save it all at once on finish
  const [localProfile, setLocalProfile] = React.useState(farmerProfile);

  const handleInitialize = async () => {
    if (!localProfile.name || !localProfile.landArea) {
      alert('Please enter your name and land size.');
      return;
    }
    await saveFarmerProfile(localProfile);
    onFinish();
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.containerWizard} showsVerticalScrollIndicator={false}>
        <Text style={styles.wizardTitle}>Farmer Profile Setup</Text>
        <Text style={styles.wizardSubtitle}>Create your live Farm Digital Twin mapping</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.fieldLabel}>Farmer Full Name</Text>
          <TextInput 
            style={styles.fieldInput} 
            placeholder="e.g. Rajesh Kumar" 
            value={localProfile.name} 
            onChangeText={text => setLocalProfile({ ...localProfile, name: text })}
          />

          <Text style={styles.fieldLabel}>Mobile Number</Text>
          <TextInput 
            style={styles.fieldInput} 
            placeholder="10 digit mobile" 
            keyboardType="phone-pad"
            value={localProfile.phone}
            onChangeText={text => setLocalProfile({ ...localProfile, phone: text })}
          />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Village</Text>
              <TextInput style={styles.fieldInput} placeholder="Village name" value={localProfile.village} onChangeText={t => setLocalProfile({ ...localProfile, village: t })} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>District</Text>
              <TextInput style={styles.fieldInput} placeholder="District name" value={localProfile.district} onChangeText={t => setLocalProfile({ ...localProfile, district: t })} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Land Size (Acres)</Text>
              <TextInput style={styles.fieldInput} placeholder="e.g. 3.5" keyboardType="numeric" value={localProfile.landArea} onChangeText={t => setLocalProfile({ ...localProfile, landArea: t })} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Soil Type</Text>
              <TextInput style={styles.fieldInput} placeholder="e.g. Loamy / Red" value={localProfile.soilType} onChangeText={t => setLocalProfile({ ...localProfile, soilType: t })} />
            </View>
          </View>

          <Text style={styles.fieldLabel}>Irrigation Source</Text>
          <TextInput 
            style={styles.fieldInput} 
            placeholder="e.g. Tube Well / Rainfed / Canal" 
            value={localProfile.irrigationSource}
            onChangeText={text => setLocalProfile({ ...localProfile, irrigationSource: text })}
          />
        </View>

        <PillButton 
          title="Initialize Ecosystem" 
          onPress={handleInitialize} 
          style={styles.submitBtn}
          icon={<ChevronRight color="white" size={20} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: THEME.bg
  },
  containerWizard: {
    padding: 24
  },
  wizardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.deepForest
  },
  wizardSubtitle: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: 4,
    marginBottom: 24
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e8eae3',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.deepForest
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#e8eae3',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    backgroundColor: THEME.bg,
    color: THEME.deepForest
  },
  submitBtn: {
    marginTop: 24
  }
});

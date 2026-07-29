import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Image,
  ImageBackground
} from 'react-native';
import { User, Smartphone, Mail, Lock, Check, ArrowRight } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import * as Location from 'expo-location';

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || process.env.VITE_MAPBOX_TOKEN || process.env.MAPBOX_TOKEN || '';

const reverseGeocodeMapbox = async (latitude, longitude, token) => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}`;
    console.log('[Mapbox Geocode] Request URL:', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('[Mapbox Geocode] Response features count:', data?.features?.length || 0);

    if (data && data.features && data.features.length > 0) {
      let village = '';
      let district = '';
      let state = '';

      // Look through features array for matching types
      const neighborhoodFeature = data.features.find(f => f.place_type.includes('neighborhood') || f.place_type.includes('locality'));
      const addressFeature = data.features.find(f => f.place_type.includes('address') || f.place_type.includes('poi'));
      const districtFeature = data.features.find(f => f.place_type.includes('place') || f.place_type.includes('district'));
      const stateFeature = data.features.find(f => f.place_type.includes('region'));

      if (neighborhoodFeature) {
        village = neighborhoodFeature.text;
      } else if (addressFeature) {
        village = addressFeature.text;
      }

      if (districtFeature) {
        district = districtFeature.text;
      }

      if (stateFeature) {
        state = stateFeature.text;
      }

      // Context fallbacks from the first feature
      const context = data.features[0].context || [];
      
      if (!village) {
        const localityContext = context.find(c => c.id.startsWith('locality') || c.id.startsWith('neighborhood'));
        if (localityContext) {
          village = localityContext.text;
        } else {
          village = data.features[0].text; // Default to top feature name
        }
      }

      if (!district) {
        const districtContext = context.find(c => c.id.startsWith('district') || c.id.startsWith('place'));
        if (districtContext) {
          district = districtContext.text;
        } else if (data.features[0].place_type.includes('place')) {
          district = data.features[0].text;
        }
      }

      if (!state) {
        const stateContext = context.find(c => c.id.startsWith('region'));
        if (stateContext) {
          state = stateContext.text;
        } else if (data.features[0].place_type.includes('region')) {
          state = data.features[0].text;
        }
      }

      console.log('[Mapbox Geocode] Parsed results:', { village, district, state });

      return {
        village: village || 'Kalyanpur',
        district: district || 'Kanpur',
        state: state || ''
      };
    }
  } catch (err) {
    console.warn('[Mapbox Geocode Error]', err);
  }
  return {
    village: 'Kalyanpur',
    district: 'Kanpur',
    state: ''
  };
};

export default function SignUpScreen({ onSignUp, onNavigateToLogin }) {
  const { registerFarmer } = useProfile();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [role, setRole] = useState('Farmer'); // Farmer | Buyer | Distributor
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !phone || !password) {
      alert('Please fill in all mandatory fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (!agreed) {
      alert('Please agree to terms and conditions.');
      return;
    }
    
    setLoading(true);

    let gpsLocation = { latitude: 17.6868, longitude: 83.2185 }; // Default Visakhapatnam farm region fallback
    let village = 'Anakapalle';
    let district = 'Visakhapatnam';
    let state = 'Andhra Pradesh';

    try {
      console.log('[Signup Location] Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('[Signup Location] Permission status:', status);
      if (status === 'granted') {
        let loc = null;
        try {
          console.log('[Signup Location] Fetching current position (Balanced accuracy, 6s timeout)...');
          loc = await Location.getCurrentPositionAsync({ 
            accuracy: Location.Accuracy.Balanced,
            timeout: 6000 
          });
        } catch (timeoutErr) {
          console.warn('[Signup Location] getCurrentPositionAsync failed or timed out, trying getLastKnownPositionAsync...', timeoutErr);
          loc = await Location.getLastKnownPositionAsync({});
        }

        if (loc && loc.coords) {
          gpsLocation = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          console.log('[Signup Location] Successfully captured coordinates:', gpsLocation);
          
          if (MAPBOX_TOKEN) {
            console.log('[Signup Location] Initiating Mapbox reverse geocoding...');
            const address = await reverseGeocodeMapbox(gpsLocation.latitude, gpsLocation.longitude, MAPBOX_TOKEN);
            village = address.village;
            district = address.district;
            state = address.state;
            console.log('[Signup Location] Mapbox geocoding resolved address:', { village, district, state });
          } else {
            console.warn('[Signup Location] MAPBOX_TOKEN is not defined in environment!');
          }
        } else {
          console.warn('[Signup Location] Could not capture any coordinates (loc is null). Using defaults.');
        }
      } else {
        console.warn('[Signup Location] Location permission denied, using default coordinates');
      }
    } catch (e) {
      console.warn('[Signup Location] Error during location resolution:', e);
    }

    try {
      const res = await registerFarmer(phone, password, name, email, {
        gpsLocation,
        village,
        district,
        state
      });
      setLoading(false);
      if (res.success) {
        onSignUp();
      } else {
        alert(res.message);
      }
    } catch (e) {
      setLoading(false);
      alert('Registration failed. Please check network/settings.');
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/login_bg.png')} 
      style={styles.bgContainer}
      resizeMode="cover"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.avoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Top bar with back and language */}
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.backBtn} onPress={onNavigateToLogin}>
              <Text style={styles.backBtnText}>◀</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.langSelector}>
              <Text style={styles.langSelectorText}>🌐 English ▾</Text>
            </TouchableOpacity>
          </View>

          {/* Logo and Brand */}
          <View style={styles.logoSection}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logoImg}
              resizeMode="contain"
            />
            <Text style={styles.brandTitle}>ApnaKissan</Text>
            <Text style={styles.brandTagline}>Smart Farming. Better Tomorrow.</Text>
          </View>

          {/* Header Title */}
          <View style={styles.headerBlock}>
            <Text style={styles.welcomeTitle}>Create Your Account</Text>
            <Text style={styles.welcomeSubtitle}>Join ApnaKissan and start your smart farming journey</Text>
          </View>

          {/* Form Inputs */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <User size={20} color={THEME.textMuted} style={styles.inputIcon} />
              <TextInput 
                style={styles.textInput} 
                placeholder="Full Name" 
                placeholderTextColor={THEME.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Smartphone size={20} color={THEME.textMuted} style={styles.inputIcon} />
              <TextInput 
                style={styles.textInput} 
                placeholder="Mobile Number" 
                placeholderTextColor={THEME.textMuted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Mail size={20} color={THEME.textMuted} style={styles.inputIcon} />
              <TextInput 
                style={styles.textInput} 
                placeholder="Email Address" 
                placeholderTextColor={THEME.textMuted}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Lock size={20} color={THEME.textMuted} style={styles.inputIcon} />
              <TextInput 
                style={styles.textInput} 
                placeholder="Password" 
                placeholderTextColor={THEME.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Lock size={20} color={THEME.textMuted} style={styles.inputIcon} />
              <TextInput 
                style={styles.textInput} 
                placeholder="Confirm Password" 
                placeholderTextColor={THEME.textMuted}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {/* Role selector segmented cards */}
            <Text style={styles.roleLabel}>I am a</Text>
            <View style={styles.roleGrid}>
              <TouchableOpacity 
                style={[styles.roleCard, role === 'Farmer' && styles.roleCardActive]} 
                onPress={() => setRole('Farmer')}
              >
                <View style={[styles.roleDot, role === 'Farmer' && styles.roleDotActive]}>
                  {role === 'Farmer' && <Check size={10} color="white" />}
                </View>
                <Text style={styles.roleEmoji}>👨‍🌾</Text>
                <Text style={styles.roleText}>Farmer</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.roleCard, role === 'Buyer' && styles.roleCardActive]} 
                onPress={() => setRole('Buyer')}
              >
                <View style={[styles.roleDot, role === 'Buyer' && styles.roleDotActive]}>
                  {role === 'Buyer' && <Check size={10} color="white" />}
                </View>
                <Text style={styles.roleEmoji}>🛍️</Text>
                <Text style={styles.roleText}>Buyer</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.roleCard, role === 'Distributor' && styles.roleCardActive]} 
                onPress={() => setRole('Distributor')}
              >
                <View style={[styles.roleDot, role === 'Distributor' && styles.roleDotActive]}>
                  {role === 'Distributor' && <Check size={10} color="white" />}
                </View>
                <Text style={styles.roleEmoji}>🚚</Text>
                <Text style={styles.roleText}>Distributor</Text>
              </TouchableOpacity>
            </View>

            {/* Agreement checkbox */}
            <TouchableOpacity style={styles.agreeRow} onPress={() => setAgreed(!agreed)}>
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Check size={12} color="white" />}
              </View>
              <Text style={styles.agreeText}>
                I agree to the <Text style={styles.greenText}>Terms & Conditions</Text> and <Text style={styles.greenText}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity style={styles.signUpBtn} onPress={handleRegister}>
              <Text style={styles.signUpBtnText}>Sign Up</Text>
              <View style={styles.arrowCircle}>
                <ArrowRight size={16} color={THEME.primary} />
              </View>
            </TouchableOpacity>

            {/* Footer Already Link */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={onNavigateToLogin}>
                <Text style={styles.footerLinkText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1
  },
  avoidingContainer: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 48
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  backBtn: {
    padding: 8
  },
  backBtnText: {
    fontSize: 16,
    color: THEME.textDark,
    fontWeight: '700'
  },
  langSelector: {
    backgroundColor: 'white',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.08)',
    shadowColor: '#1b2e1b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1
  },
  langSelectorText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.textDark
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 10
  },
  logoImg: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: 'rgba(44, 107, 67, 0.1)',
    backgroundColor: 'white'
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.deepForest,
    marginTop: 10,
    letterSpacing: 0.5
  },
  brandTagline: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 2,
    fontWeight: '700'
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 12
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.textDark
  },
  welcomeSubtitle: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center'
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.08)',
    shadowColor: '#1b2e1b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 3
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: 'white',
    marginBottom: 12
  },
  inputIcon: {
    marginRight: 10
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: THEME.textDark,
    fontWeight: '600'
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.textDark,
    marginTop: 8,
    marginBottom: 10
  },
  roleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16
  },
  roleCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.08)',
    backgroundColor: 'white',
    padding: 12,
    alignItems: 'center',
    position: 'relative'
  },
  roleCardActive: {
    borderColor: THEME.primary,
    backgroundColor: 'rgba(44, 107, 67, 0.04)'
  },
  roleDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(44, 107, 67, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  roleDotActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary
  },
  roleEmoji: {
    fontSize: 22,
    marginVertical: 4
  },
  roleText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.textDark
  },
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingRight: 16
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  checkboxChecked: {
    backgroundColor: THEME.primary
  },
  agreeText: {
    fontSize: 11,
    color: THEME.textMuted,
    lineHeight: 16,
    fontWeight: '600'
  },
  greenText: {
    fontWeight: '700',
    color: THEME.primary
  },
  signUpBtn: {
    height: 52,
    backgroundColor: THEME.primary,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3
  },
  signUpBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '850'
  },
  arrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16
  },
  footerText: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: '600'
  },
  footerLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.primary
  }
});

import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground, 
  Animated, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator 
} from 'react-native';
import { Sprout, Phone, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { useProfile } from '../context/ProfileContext';

export default function GlassLoginScreen({ onLoginSuccess }) {
  const { loginFarmer, registerFarmer } = useProfile();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleSubmit = async () => {
    if (phoneNumber.length < 10 || password.length < 4) return;
    if (isRegistering && !name.trim()) return;

    setLoading(true);
    setErrorMsg('');

    let res;
    if (isRegistering) {
      res = await registerFarmer(phoneNumber, password, name);
    } else {
      res = await loginFarmer(phoneNumber, password);
    }

    setLoading(false);
    if (res.success) {
      onLoginSuccess();
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop' }}
      style={styles.backgroundImage}
    >
      <View style={styles.darkOverlay} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <Animated.View style={[styles.glassCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          {/* Header Branding */}
          <View style={styles.brandHeader}>
            <View style={styles.logoBadge}>
              <Sprout size={28} color="#2e7d32" />
            </View>
            <Text style={styles.brandTitle}>ApnaKissan</Text>
            <Text style={styles.brandSubtitle}>
              {isRegistering ? 'Create your Farmer Account' : 'Login to your Farmer Account'}
            </Text>
          </View>

          {/* Form Controls */}
          <View style={styles.formGroup}>
            {isRegistering && (
              <>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your name"
                    placeholderTextColor="#8d99ae"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </>
            )}

            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.inputWrapper}>
              <Phone size={20} color="#2e7d32" style={styles.inputIcon} />
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter 10-digit number"
                placeholderTextColor="#8d99ae"
                keyboardType="phone-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#2e7d32" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter password"
                placeholderTextColor="#8d99ae"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {errorMsg ? (
              <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{errorMsg}</Text>
            ) : null}

            <TouchableOpacity 
              style={[styles.primaryButton, (phoneNumber.length < 10 || password.length < 4 || (isRegistering && !name.trim())) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={phoneNumber.length < 10 || password.length < 4 || (isRegistering && !name.trim()) || loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.buttonText}>{isRegistering ? 'Register' : 'Login'}</Text>
                  <ArrowRight size={18} color="white" />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.changeNumberButton} onPress={() => { setIsRegistering(!isRegistering); setErrorMsg(''); }}>
              <Text style={styles.changeNumberText}>
                {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Security Badge */}
          <View style={styles.securityFooter}>
            <ShieldCheck size={14} color="#2e7d32" />
            <Text style={styles.securityText}>100% Encrypted & Secure Farmer Auth</Text>
          </View>

        </Animated.View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 35, 20, 0.45)',
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  glassCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 15,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1b4332',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#52796f',
    marginTop: 4,
    fontWeight: '500',
  },
  formGroup: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2d6a4f',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#d8f3dc',
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1b4332',
    marginRight: 8,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#d8f3dc',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1b4332',
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    height: 54,
    backgroundColor: '#2e7d32',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  changeNumberButton: {
    alignSelf: 'center',
    marginTop: 16,
  },
  changeNumberText: {
    color: '#2e7d32',
    fontSize: 13,
    fontWeight: '600',
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  securityText: {
    fontSize: 11,
    color: '#52796f',
    fontWeight: '500',
  },
});

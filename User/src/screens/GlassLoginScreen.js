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

export default function GlassLoginScreen({ onLoginSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [loading, setLoading] = useState(false);

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

  const handleSendOTP = () => {
    if (phoneNumber.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1200);
  };

  const handleVerifyOTP = () => {
    if (otp.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 1200);
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
              {step === 'phone' ? 'Smart Farming. Better Tomorrow.' : 'Enter Verification Code'}
            </Text>
          </View>

          {/* Form Controls */}
          {step === 'phone' ? (
            <View style={styles.formGroup}>
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

              <TouchableOpacity 
                style={[styles.primaryButton, phoneNumber.length < 10 && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={phoneNumber.length < 10 || loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Get Verification Code</Text>
                    <ArrowRight size={18} color="white" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Verification OTP sent to +91 {phoneNumber}</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#2e7d32" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter 4-digit OTP"
                  placeholderTextColor="#8d99ae"
                  keyboardType="number-pad"
                  maxLength={4}
                  value={otp}
                  onChangeText={setOtp}
                />
              </View>

              <TouchableOpacity 
                style={[styles.primaryButton, otp.length < 4 && styles.buttonDisabled]}
                onPress={handleVerifyOTP}
                disabled={otp.length < 4 || loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Verify & Login</Text>
                    <CheckCircle2 size={18} color="white" />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.changeNumberButton} onPress={() => setStep('phone')}>
                <Text style={styles.changeNumberText}>Change Mobile Number</Text>
              </TouchableOpacity>
            </View>
          )}

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

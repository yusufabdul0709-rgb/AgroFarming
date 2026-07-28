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
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';

export default function WelcomeLoginScreen({ onLogin, onNavigateToSignUp }) {
  const { loginFarmer } = useProfile();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email address and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await loginFarmer(email, password);
      setLoading(false);
      if (res.success) {
        onLogin();
      } else {
        alert(res.message);
      }
    } catch (e) {
      setLoading(false);
      alert('Login failed. Please check network/settings.');
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
          {/* Language selector at top right */}
          <View style={styles.topRow}>
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
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>Login to continue to your account</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Email */}
            <View style={styles.inputWrapper}>
              <Mail size={20} color={THEME.textMuted} style={styles.inputIcon} />
              <TextInput 
                style={styles.textInput} 
                placeholder="Email Address" 
                placeholderTextColor={THEME.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Lock size={20} color={THEME.textMuted} style={styles.inputIcon} />
              <TextInput 
                style={styles.textInput} 
                placeholder="Password" 
                placeholderTextColor={THEME.textMuted}
                secureTextEntry={securePassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecurePassword(!securePassword)} style={styles.eyeBtn}>
                {securePassword ? <EyeOff size={20} color={THEME.textMuted} /> : <Eye size={20} color={THEME.textMuted} />}
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Pill Button */}
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>Login</Text>
              <View style={styles.arrowCircle}>
                <ArrowRight size={16} color={THEME.primary} />
              </View>
            </TouchableOpacity>

            {/* OR continues with divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Row */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Text style={styles.socialBtnText}>🔴 Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Text style={styles.socialBtnText}>💜 PhonePe</Text>
              </TouchableOpacity>
            </View>

            {/* Footer Sign Up Link */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>New to ApnaKissan? </Text>
              <TouchableOpacity onPress={onNavigateToSignUp}>
                <Text style={styles.footerLinkText}>Sign Up</Text>
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
    justifyContent: 'flex-end',
    marginBottom: 16
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
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: 'rgba(44, 107, 67, 0.1)',
    backgroundColor: 'white'
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: THEME.deepForest,
    marginTop: 10,
    letterSpacing: 0.5
  },
  brandTagline: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 2,
    fontWeight: '700'
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 12
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.textDark
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: THEME.textMuted,
    fontWeight: '600',
    marginTop: 4
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)', // Frosted look
    borderRadius: 30,
    padding: 24,
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
    height: 56,
    backgroundColor: 'white',
    marginBottom: 16
  },
  inputIcon: {
    marginRight: 12
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: THEME.textDark,
    fontWeight: '600'
  },
  otpBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(44, 107, 67, 0.06)'
  },
  otpBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.primary
  },
  eyeBtn: {
    padding: 6
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.primary
  },
  loginBtn: {
    height: 56,
    backgroundColor: THEME.primary,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3
  },
  loginBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '850'
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(44, 107, 67, 0.08)'
  },
  dividerText: {
    fontSize: 12,
    color: THEME.textMuted,
    marginHorizontal: 12,
    fontWeight: '700'
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24
  },
  socialBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textDark
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  footerText: {
    fontSize: 13,
    color: THEME.textMuted,
    fontWeight: '600'
  },
  footerLinkText: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.primary
  }
});

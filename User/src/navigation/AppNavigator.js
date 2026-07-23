import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Home, 
  BarChart3, 
  Camera, 
  ShoppingCart, 
  User
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';

// Core Screens
import SplashScreen from '../screens/SplashScreen';
import GlassLoginScreen from '../screens/GlassLoginScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import ProfileOnboardingScreen from '../screens/ProfileOnboardingScreen';
import HomeDashboardScreen from '../screens/HomeDashboardScreen';
import GISMapScreen from '../screens/GISMapScreen';
import VisionScannerScreen from '../screens/VisionScannerScreen';
import SecretProfileScreen from '../screens/SecretProfileScreen';
import AIFarmerChatScreen from '../screens/AIFarmerChatScreen';

// 10 Dedicated Smart Tool Feature Screens
import CropDoctorScreen from '../screens/CropDoctorScreen';
import MilletScannerScreen from '../screens/MilletScannerScreen';
import MarketIntelligenceScreen from '../screens/MarketIntelligenceScreen';
import SchemeFinderScreen from '../screens/SchemeFinderScreen';
import WaterIntelligenceScreen from '../screens/WaterIntelligenceScreen';
import SoilAnalyzerScreen from '../screens/SoilAnalyzerScreen';
import ProfitCalculatorScreen from '../screens/ProfitCalculatorScreen';
import CommunityScreen from '../screens/CommunityScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import DashboardAnalyticsScreen from '../screens/DashboardAnalyticsScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppNavigator() {
  const THEME = useTheme();
  const { farmerProfile } = useProfile();
  
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [liveCoords, setLiveCoords] = useState(null);

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('@farmer_profile');
        if (storedProfile) {
          setCurrentScreen('dashboard'); // Skip login and onboarding if profile exists
        } else {
          setCurrentScreen('login');
        }
      } catch (e) {
        setCurrentScreen('login');
      }
    };
    
    if (currentScreen === 'splash') {
      // Small delay just to show splash animation
      setTimeout(checkLoginStatus, 1500);
    }
  }, [currentScreen]);

  const handleNavigate = (target, coordsData) => {
    if (coordsData) setLiveCoords(coordsData);
    setActiveTab(target);
  };

  const renderActiveTabScreen = () => {
    switch (activeTab) {
      case 'home': 
        return (
          <HomeDashboardScreen 
            onAvatarPress={() => setActiveTab('profile')} 
            onViewMap={() => setActiveTab('map')} 
            onNavigateTab={handleNavigate}
          />
        );
      case 'dashboard': return <DashboardAnalyticsScreen onBack={() => setActiveTab('home')} />;
      case 'scanner': return <VisionScannerScreen onBack={() => setActiveTab('home')} />;
      case 'market': return <MarketplaceScreen onBack={() => setActiveTab('home')} />;
      case 'profile': return <SecretProfileScreen onBack={() => setActiveTab('home')} />;
      
      // Separate Feature Pages for Smart Tools
      case 'crop_doctor': return <CropDoctorScreen onBack={() => setActiveTab('home')} />;
      case 'millet_scanner': return <MilletScannerScreen onBack={() => setActiveTab('home')} />;
      case 'market_intel': return <MarketIntelligenceScreen onBack={() => setActiveTab('home')} />;
      case 'scheme_finder': return <SchemeFinderScreen onBack={() => setActiveTab('home')} />;
      case 'water_intel': return <WaterIntelligenceScreen onBack={() => setActiveTab('home')} />;
      case 'soil_analyzer': return <SoilAnalyzerScreen onBack={() => setActiveTab('home')} />;
      case 'map': return <GISMapScreen userCoords={liveCoords} onBack={() => setActiveTab('home')} />;
      case 'profit_calc': return <ProfitCalculatorScreen onBack={() => setActiveTab('home')} />;
      case 'community': return <CommunityScreen onBack={() => setActiveTab('home')} />;
      case 'ai': return <AIFarmerChatScreen onBack={() => setActiveTab('home')} />;
      
      default: 
        return (
          <HomeDashboardScreen 
            onAvatarPress={() => setActiveTab('profile')} 
            onViewMap={() => setActiveTab('map')} 
            onNavigateTab={handleNavigate}
          />
        );
    }
  };

  if (currentScreen === 'splash') return <SplashScreen onFinish={() => {}} />;
  if (currentScreen === 'login') return <GlassLoginScreen onLoginSuccess={() => setCurrentScreen('language')} />;
  if (currentScreen === 'language') return <LanguageSelectionScreen onNext={() => setCurrentScreen('onboarding')} />;
  if (currentScreen === 'onboarding') return <ProfileOnboardingScreen onFinish={() => setCurrentScreen('dashboard')} />;

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'scanner', icon: Camera, label: 'Scan', isCenter: true },
    { id: 'market', icon: ShoppingCart, label: 'Market' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <SafeAreaView style={[styles.mainAppContainer, { backgroundColor: THEME.bg || '#f8faf8' }]} edges={['top']}>
      <View style={{ flex: 1 }}>
        {renderActiveTabScreen()}
      </View>

      {/* Mockup Match Bottom Navigation Bar */}
      <View style={styles.navTabBar}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <TouchableOpacity 
                key={tab.id}
                style={styles.centerFloatingBtn} 
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.8}
              >
                <View style={styles.centerBtnInner}>
                  <Camera size={26} color="white" />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity 
              key={tab.id}
              style={styles.navTabItem} 
              onPress={() => setActiveTab(tab.id)}
            >
              <Icon 
                size={22} 
                color={isActive ? '#2e7d32' : '#94a3b8'} 
                strokeWidth={isActive ? 2.5 : 1.8} 
              />
              <Text style={[styles.navTabText, isActive && styles.navTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainAppContainer: {
    flex: 1,
  },
  navTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 15
  },
  navTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 50,
  },
  navTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 4,
  },
  navTabTextActive: {
    color: '#2e7d32',
    fontWeight: '700',
  },
  centerFloatingBtn: {
    top: -24,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    padding: 4,
  },
  centerBtnInner: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

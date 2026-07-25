import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Sprout, 
  Store, 
  MessageSquare, 
  User 
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';

// Import Screens
import SplashScreen from '../screens/SplashScreen';
import WelcomeLoginScreen from '../screens/WelcomeLoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeDashboardScreen from '../screens/HomeDashboardScreen';
import CropRecommendationScreen from '../screens/CropRecommendationScreen';
import SoilHealthScreen from '../screens/SoilHealthScreen';
import WaterIntelligenceScreen from '../screens/WaterIntelligenceScreen';
import WeatherScreen from '../screens/WeatherScreen';
import MarketPricesScreen from '../screens/MarketPricesScreen';
import MilletScannerScreen from '../screens/MilletScannerScreen';
import CropDoctorScreen from '../screens/CropDoctorScreen';
import SchemeFinderScreen from '../screens/SchemeFinderScreen';
import AIChatScreen from '../screens/AIChatScreen';
import MarketProduceScreen from '../screens/MarketProduceScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Vault Screens
import VaultScreen from '../screens/VaultScreen';
import DocumentUploadScreen from '../screens/DocumentUploadScreen';
import VaultSchemeMatchingScreen from '../screens/VaultSchemeMatchingScreen';

export default function AppNavigator() {
  const THEME = useTheme();
  const { farmerProfile } = useProfile();
  
  // Navigation stack state: 'splash' | 'login' | 'signup' | 'dashboard'
  const [currentScreen, setCurrentScreen] = useState('splash');
  
  // Dashboard tab state: 'home' | 'market' | 'chat' | 'profile'
  const [activeTab, setActiveTab] = useState('home');

  // Detail view state within dashboard: null | 'crop-recommendation' | 'soil-health' | ...
  const [currentDetailView, setCurrentDetailView] = useState(null);

  const handleQuickAccessNavigate = (key) => {
    // If it's a primary tab, switch tab, else push to detail stack
    if (key === 'ai-assistant') {
      setActiveTab('chat');
      setCurrentDetailView(null);
    } else if (key === 'market-produce') {
      setActiveTab('market');
      setCurrentDetailView(null);
    } else {
      setCurrentDetailView(key);
    }
  };

  const renderActiveTabScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboardScreen onNavigateTo={handleQuickAccessNavigate} />;
      case 'market':
        return <MarketProduceScreen onBack={() => setActiveTab('home')} />;
      case 'chat':
        return <AIChatScreen onBack={() => setActiveTab('home')} />;
      case 'profile':
        return <ProfileScreen 
          onBack={() => setActiveTab('home')} 
          onLogout={() => {
            setCurrentDetailView(null);
            setCurrentScreen('login');
          }} 
        />;
      default:
        return <HomeDashboardScreen onNavigateTo={handleQuickAccessNavigate} />;
    }
  };

  const renderDetailScreen = () => {
    switch (currentDetailView) {
      case 'crop-recommendation':
        return <CropRecommendationScreen onBack={() => setCurrentDetailView(null)} />;
      case 'soil-health':
        return <SoilHealthScreen onBack={() => setCurrentDetailView(null)} />;
      case 'water-intelligence':
        return <WaterIntelligenceScreen onBack={() => setCurrentDetailView(null)} />;
      case 'weather':
        return <WeatherScreen onBack={() => setCurrentDetailView(null)} />;
      case 'market-prices':
        return <MarketPricesScreen onBack={() => setCurrentDetailView(null)} />;
      case 'millet-scanner':
        return <MilletScannerScreen onBack={() => setCurrentDetailView(null)} />;
      case 'crop-doctor':
        return <CropDoctorScreen onBack={() => setCurrentDetailView(null)} />;
      case 'scheme-finder':
        return <SchemeFinderScreen onBack={() => setCurrentDetailView(null)} />;
      case 'secure-vault':
        return <VaultScreen onBack={() => setCurrentDetailView(null)} onNavigate={(screen, params) => setCurrentDetailView(screen)} />;
      case 'vault-upload':
        return <DocumentUploadScreen onBack={() => setCurrentDetailView('secure-vault')} />;
      case 'vault-scheme-match':
        return <VaultSchemeMatchingScreen onBack={() => setCurrentDetailView('secure-vault')} />;
      default:
        return null;
    }
  };

  // Stack Routing Switch
  if (currentScreen === 'splash') {
    return <SplashScreen onFinish={() => setCurrentScreen(farmerProfile?.phone ? 'dashboard' : 'login')} />;
  }

  if (currentScreen === 'login') {
    return (
      <WelcomeLoginScreen 
        onLogin={() => setCurrentScreen('dashboard')} 
        onNavigateToSignUp={() => setCurrentScreen('signup')} 
      />
    );
  }

  if (currentScreen === 'signup') {
    return (
      <SignUpScreen 
        onSignUp={() => setCurrentScreen('dashboard')} 
        onNavigateToLogin={() => setCurrentScreen('login')} 
      />
    );
  }

  return (
    <SafeAreaView style={[styles.mainAppContainer, { backgroundColor: THEME.bg }]}>
      <View style={{ flex: 1 }}>
        {/* Render detail view if pushed to stack, otherwise active tab */}
        {currentDetailView ? renderDetailScreen() : renderActiveTabScreen()}
      </View>

      {/* Floating Curved Bottom Navigation Bar (only visible when not in detail stack) */}
      {!currentDetailView && (
        <View style={[styles.navTabBar, { borderColor: THEME.glassBorder }]}>
          <TouchableOpacity 
            style={[styles.navTabItem, activeTab === 'home' && [styles.navTabItemActive, { backgroundColor: THEME.primary }]]} 
            onPress={() => setActiveTab('home')}
          >
            <Sprout size={20} color={activeTab === 'home' ? 'white' : THEME.textMuted} />
            <Text style={[styles.navTabText, { color: activeTab === 'home' ? 'white' : THEME.textMuted }, activeTab === 'home' && styles.navTabTextActive]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navTabItem, activeTab === 'market' && [styles.navTabItemActive, { backgroundColor: THEME.primary }]]} 
            onPress={() => setActiveTab('market')}
          >
            <Store size={20} color={activeTab === 'market' ? 'white' : THEME.textMuted} />
            <Text style={[styles.navTabText, { color: activeTab === 'market' ? 'white' : THEME.textMuted }, activeTab === 'market' && styles.navTabTextActive]}>Market</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navTabItem, activeTab === 'chat' && [styles.navTabItemActive, { backgroundColor: THEME.primary }]]} 
            onPress={() => setActiveTab('chat')}
          >
            <MessageSquare size={20} color={activeTab === 'chat' ? 'white' : THEME.textMuted} />
            <Text style={[styles.navTabText, { color: activeTab === 'chat' ? 'white' : THEME.textMuted }, activeTab === 'chat' && styles.navTabTextActive]}>Assistant</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navTabItem, activeTab === 'profile' && [styles.navTabItemActive, { backgroundColor: THEME.primary }]]} 
            onPress={() => setActiveTab('profile')}
          >
            <User size={20} color={activeTab === 'profile' ? 'white' : THEME.textMuted} />
            <Text style={[styles.navTabText, { color: activeTab === 'profile' ? 'white' : THEME.textMuted }, activeTab === 'profile' && styles.navTabTextActive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainAppContainer: {
    flex: 1
  },
  navTabBar: {
    position: 'absolute',
    bottom: 16,
    left: 12,
    right: 12,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    shadowColor: '#1b2e1b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 8
  },
  navTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 24,
    gap: 2
  },
  navTabItemActive: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3
  },
  navTabText: {
    fontSize: 9,
    fontWeight: '700'
  },
  navTabTextActive: {
    fontWeight: '800'
  }
});

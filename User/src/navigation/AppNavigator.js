import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Sprout, 
  Sliders, 
  Map, 
  MessageSquare, 
  Camera 
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';

// Import Screens
import SplashScreen from '../screens/SplashScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import ProfileOnboardingScreen from '../screens/ProfileOnboardingScreen';
import HomeDashboardScreen from '../screens/HomeDashboardScreen';
import TwinSimulatorScreen from '../screens/TwinSimulatorScreen';
import GISMapScreen from '../screens/GISMapScreen';
import AIChatScreen from '../screens/AIChatScreen';
import VisionScannerScreen from '../screens/VisionScannerScreen';

export default function AppNavigator() {
  const THEME = useTheme();
  const { farmerProfile } = useProfile();
  
  // Navigation stack state: 'splash' | 'language' | 'onboarding' | 'dashboard'
  const [currentScreen, setCurrentScreen] = useState('splash');
  
  // Dashboard tab state: 'home' | 'twin' | 'map' | 'chat' | 'vision'
  const [activeTab, setActiveTab] = useState('home');

  const renderActiveTabScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboardScreen />;
      case 'twin':
        return <TwinSimulatorScreen />;
      case 'map':
        return <GISMapScreen />;
      case 'chat':
        return <AIChatScreen />;
      case 'vision':
        return <VisionScannerScreen />;
      default:
        return <HomeDashboardScreen />;
    }
  };

  if (currentScreen === 'splash') {
    return <SplashScreen onFinish={() => setCurrentScreen('language')} />;
  }

  if (currentScreen === 'language') {
    return <LanguageSelectionScreen onNext={() => setCurrentScreen('onboarding')} />;
  }

  if (currentScreen === 'onboarding') {
    return <ProfileOnboardingScreen onFinish={() => setCurrentScreen('dashboard')} />;
  }

  return (
    <SafeAreaView style={[styles.mainAppContainer, { backgroundColor: THEME.bg }]}>
      <View style={{ flex: 1 }}>
        {renderActiveTabScreen()}
      </View>

      {/* Floating Curved Bottom Navigation Bar */}
      <View style={[styles.navTabBar, { borderColor: THEME.glassBorder }]}>
        <TouchableOpacity 
          style={[styles.navTabItem, activeTab === 'home' && [styles.navTabItemActive, { backgroundColor: THEME.primary }]]} 
          onPress={() => setActiveTab('home')}
        >
          <Sprout size={20} color={activeTab === 'home' ? 'white' : THEME.textMuted} />
          <Text style={[styles.navTabText, { color: activeTab === 'home' ? 'white' : THEME.textMuted }, activeTab === 'home' && styles.navTabTextActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navTabItem, activeTab === 'twin' && [styles.navTabItemActive, { backgroundColor: THEME.primary }]]} 
          onPress={() => setActiveTab('twin')}
        >
          <Sliders size={20} color={activeTab === 'twin' ? 'white' : THEME.textMuted} />
          <Text style={[styles.navTabText, { color: activeTab === 'twin' ? 'white' : THEME.textMuted }, activeTab === 'twin' && styles.navTabTextActive]}>Twin</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navTabItem, activeTab === 'map' && [styles.navTabItemActive, { backgroundColor: THEME.primary }]]} 
          onPress={() => setActiveTab('map')}
        >
          <Map size={20} color={activeTab === 'map' ? 'white' : THEME.textMuted} />
          <Text style={[styles.navTabText, { color: activeTab === 'map' ? 'white' : THEME.textMuted }, activeTab === 'map' && styles.navTabTextActive]}>GIS Map</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navTabItem, activeTab === 'chat' && [styles.navTabItemActive, { backgroundColor: THEME.primary }]]} 
          onPress={() => setActiveTab('chat')}
        >
          <MessageSquare size={20} color={activeTab === 'chat' ? 'white' : THEME.textMuted} />
          <Text style={[styles.navTabText, { color: activeTab === 'chat' ? 'white' : THEME.textMuted }, activeTab === 'chat' && styles.navTabTextActive]}>Assistant</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navTabItem, activeTab === 'vision' && [styles.navTabItemActive, { backgroundColor: THEME.primary }]]} 
          onPress={() => setActiveTab('vision')}
        >
          <Camera size={20} color={activeTab === 'vision' ? 'white' : THEME.textMuted} />
          <Text style={[styles.navTabText, { color: activeTab === 'vision' ? 'white' : THEME.textMuted }, activeTab === 'vision' && styles.navTabTextActive]}>Scanner</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainAppContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
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
    fontWeight: '500'
  },
  navTabTextActive: {
    fontWeight: '700'
  }
});

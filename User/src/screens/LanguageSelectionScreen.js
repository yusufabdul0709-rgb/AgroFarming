import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Sprout } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LanguageSelectionScreen({ onNext }) {
  const { farmerProfile, saveFarmerProfile } = useProfile();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'kn', name: 'Kannada', native: 'కನ್ನಡ' },
    { code: 'pb', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Sprout size={48} color={THEME.primary} />
        <Text style={styles.title}>Choose Language</Text>
        <Text style={styles.subtitle}>अपना कीमती भाषा का चयन करें</Text>
      </View>
      <ScrollView contentContainerStyle={styles.langGrid} showsVerticalScrollIndicator={false}>
        {languages.map((l) => (
          <TouchableOpacity 
            key={l.code} 
            style={[styles.langCard, farmerProfile.preferredLanguage === l.name && styles.langCardSelected]}
            onPress={async () => {
              await saveFarmerProfile({ ...farmerProfile, preferredLanguage: l.name });
              onNext();
            }}
          >
            <Text style={styles.langNative}>{l.native}</Text>
            <Text style={styles.langLabel}>{l.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    padding: 24,
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.deepForest,
    marginTop: 12
  },
  subtitle: {
    fontSize: 14,
    color: THEME.textMuted,
    marginTop: 4
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    paddingBottom: 24
  },
  langCard: {
    width: (SCREEN_WIDTH - 64) / 2,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e8eae3',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  langCardSelected: {
    borderColor: THEME.primary,
    backgroundColor: 'rgba(76, 175, 80, 0.05)'
  },
  langNative: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.deepForest
  },
  langLabel: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 4
  }
});

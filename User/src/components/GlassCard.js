import React from 'react';
import { StyleSheet, View } from 'react-native';
import { THEME } from '../context/ThemeContext';

export default function GlassCard({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 24, // Large rounded corners (20-30px radius)
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.12)', // Thin low-opacity borders
    shadowColor: '#1b2e1b', // Soft organic shadows
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden'
  }
});

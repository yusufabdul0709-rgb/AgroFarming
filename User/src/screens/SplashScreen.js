import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { ExpoStatusBar } from 'expo-status-bar';
import { THEME } from '../context/ThemeContext';

export default function SplashScreen({ onFinish }) {
  const seedScale = useRef(new Animated.Value(0.1)).current;
  const plantHeight = useRef(new Animated.Value(0)).current;
  const splashFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(seedScale, {
        toValue: 1.5,
        duration: 1200,
        useNativeDriver: true
      }),
      Animated.timing(plantHeight, {
        toValue: 80,
        duration: 1500,
        useNativeDriver: false
      }),
      Animated.delay(800),
      Animated.timing(splashFade, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: splashFade }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.seedCircle, { transform: [{ scale: seedScale }] }]}>
          <Animated.View style={[styles.plantSprout, { height: plantHeight }]} />
        </Animated.View>
        <Text style={styles.logo}>ApnaKissan</Text>
        <Text style={styles.tagline}>Your Intelligent Farming Companion</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    alignItems: 'center'
  },
  seedCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.earthBrown,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 24
  },
  plantSprout: {
    width: 6,
    backgroundColor: THEME.secondary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: THEME.deepForest,
    letterSpacing: 0.5
  },
  tagline: {
    fontSize: 14,
    color: THEME.textMuted,
    marginTop: 8,
    fontWeight: '500'
  }
});

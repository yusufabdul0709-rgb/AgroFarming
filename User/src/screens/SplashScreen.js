import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  // Animation Values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Logo fade in & scale up
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Text fade in & slide up
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);

    // 3. Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2500, // Duration matches the requested splash time
      useNativeDriver: false, // width animation doesn't support native driver
    }).start(() => {
      // Call onFinish after the animations complete
      if (onFinish) {
        setTimeout(() => {
          onFinish();
        }, 300); // slight buffer before transitioning
      }
    });
  }, [logoOpacity, logoScale, textOpacity, textTranslateY, progressAnim, onFinish]);

  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Animated Logo */}
        <Animated.Image 
          source={require('../../assets/splash.png')} 
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }]
            }
          ]}
          resizeMode="contain"
        />

        {/* Animated Text */}
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }]
          }}
        >
          <Text style={styles.brandText}>ApnaKissan</Text>
        </Animated.View>
      </View>

      {/* Progress Bar at the bottom */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: widthInterpolate }]} />
        </View>
        <Text style={styles.loadingText}>LOADING...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F4', // Brand background color
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 20,
  },
  brandText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2E7D32', // Deep green color
    letterSpacing: 1.5,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  progressTrack: {
    width: '60%',
    height: 6,
    backgroundColor: 'rgba(46, 125, 50, 0.2)', // Light green track
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50', // Vibrant green
    borderRadius: 3,
  },
  loadingText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '700',
    letterSpacing: 2,
  }
});

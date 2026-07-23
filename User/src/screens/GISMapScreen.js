import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { THEME } from '../context/ThemeContext';

export default function GISMapScreen() {
  const [activeGisLayer, setActiveGisLayer] = useState('Satellite');
  const layers = ['Satellite', 'Soil Moisture', 'Crop Density', 'Flood Risk'];

  return (
    <View style={{ flex: 1, backgroundColor: '#0f170f' }}>
      {/* Floating Layer Selector */}
      <View style={styles.mapLayersFloating}>
        {layers.map(layer => (
          <TouchableOpacity 
            key={layer} 
            style={[styles.mapLayerBtn, activeGisLayer === layer && styles.mapLayerBtnActive]}
            onPress={() => setActiveGisLayer(layer)}
          >
            <Text style={[styles.mapLayerBtnText, activeGisLayer === layer && styles.mapLayerBtnTextActive]}>
              {layer}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Simulated Map */}
      <View style={styles.mapSimContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80' }} 
          style={styles.mapSimImage} 
        />
        
        {/* Layer Overlays */}
        {activeGisLayer === 'Soil Moisture' && (
          <View style={[styles.mapOverlay, { backgroundColor: 'rgba(33, 150, 243, 0.35)' }]}>
            <Text style={styles.overlayLayerName}>💧 Soil Moisture Overlay Active</Text>
            <Text style={styles.overlayLayerSub}>Blue indicates moisture levels &gt; 50% (Saturated Fields)</Text>
          </View>
        )}

        {activeGisLayer === 'Crop Density' && (
          <View style={[styles.mapOverlay, { backgroundColor: 'rgba(76, 175, 80, 0.35)' }]}>
            <Text style={styles.overlayLayerName}>🌱 Crop Density Index (NDVI)</Text>
            <Text style={styles.overlayLayerSub}>Dark green indicates healthy dense vegetation growth.</Text>
          </View>
        )}

        {activeGisLayer === 'Flood Risk' && (
          <View style={[styles.mapOverlay, { backgroundColor: 'rgba(244, 67, 54, 0.35)' }]}>
            <Text style={styles.overlayLayerName}>⚠️ Flood Risk Indicator</Text>
            <Text style={styles.overlayLayerSub}>Red outlines drainage zones vulnerable to &gt; 100mm rainfall events.</Text>
          </View>
        )}

        {activeGisLayer === 'Satellite' && (
          <View style={[styles.mapOverlay, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
            <Text style={styles.overlayLayerName}>🛰️ Sentinel Satellite Imagery</Text>
            <Text style={styles.overlayLayerSub}>Resolution: 10m bands. Live farm boundary mapped.</Text>
          </View>
        )}

        {/* Mapped boundary dash line */}
        <View style={styles.mapBoundaryOutline} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapLayersFloating: {
    position: 'absolute',
    top: 16,
    left: 12,
    right: 12,
    zIndex: 10,
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(10,20,10,0.8)',
    borderRadius: 50,
    padding: 4
  },
  mapLayerBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 50
  },
  mapLayerBtnActive: {
    backgroundColor: THEME.primary
  },
  mapLayerBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#c2c9bf'
  },
  mapLayerBtnTextActive: {
    color: 'white'
  },
  mapSimContainer: {
    flex: 1,
    position: 'relative'
  },
  mapSimImage: {
    width: '100%',
    height: '100%'
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)'
  },
  overlayLayerName: {
    fontSize: 15,
    fontWeight: '800',
    color: 'white'
  },
  overlayLayerSub: {
    fontSize: 11,
    color: 'white',
    marginTop: 4,
    opacity: 0.9
  },
  mapBoundaryOutline: {
    position: 'absolute',
    top: '30%',
    left: '25%',
    width: '50%',
    height: '30%',
    borderWidth: 2,
    borderColor: THEME.secondary,
    borderRadius: 16,
    borderStyle: 'dashed'
  }
});

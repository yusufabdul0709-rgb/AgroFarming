import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Button } from 'react-native';
import { ArrowLeft, Leaf, Activity, Beaker, Sprout } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function VisionScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.cameraBackground}
        facing="back"
      />
      
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton}>
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scanner</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.reticleContainer}>
          <View style={[styles.reticleCorner, styles.topLeft]} />
          <View style={[styles.reticleCorner, styles.topRight]} />
          <View style={[styles.reticleCorner, styles.bottomLeft]} />
          <View style={[styles.reticleCorner, styles.bottomRight]} />
        </View>

        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          
          <Text style={styles.sheetTitle}>Plant analysis</Text>
          <Text style={styles.sheetSubtitle}>Wheat (Triticum aestivum)</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
            <View style={styles.tabActive}>
              <Sprout size={14} color="#1e3b2e" />
              <Text style={styles.tabTextActive}>Growth stage</Text>
            </View>
            <View style={styles.tabInactive}>
              <Activity size={14} color="#7f8c8d" />
              <Text style={styles.tabTextInactive}>Plant health</Text>
            </View>
            <View style={styles.tabInactive}>
              <Beaker size={14} color="#7f8c8d" />
              <Text style={styles.tabTextInactive}>Nutrition</Text>
            </View>
          </ScrollView>

          <View style={styles.statsArea}>
            <View style={styles.statBox}>
              <View style={styles.statHeaderRow}>
                <TrendingUpIcon />
                <Text style={styles.statLabel}>Maturity Level</Text>
              </View>
              <Text style={styles.statValue}>68%</Text>
              <Text style={styles.statDesc}>Milking stage</Text>
            </View>
            
            <View style={styles.statBox}>
              <View style={styles.statHeaderRow}>
                <Leaf size={12} color="#7f8c8d" />
                <Text style={styles.statLabel}>Leaf Moisture</Text>
              </View>
              <Text style={styles.statValue}>Optimal</Text>
              <Text style={styles.statDesc}>No water stress</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// Helper icon component for trending up since we didn't import it at top
const TrendingUpIcon = () => (
  <View style={{ transform: [{ rotate: '-45deg' }] }}>
    <ArrowLeft size={12} color="#7f8c8d" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20
  },
  cameraBackground: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700'
  },
  reticleContainer: {
    position: 'absolute',
    top: '30%',
    left: '15%',
    width: '70%',
    height: '35%',
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  reticleCorner: {
    width: 40,
    height: 40,
    borderColor: 'rgba(255,255,255,0.7)',
    position: 'absolute'
  },
  topLeft: {
    top: 0, left: 0,
    borderTopWidth: 4, borderLeftWidth: 4,
    borderTopLeftRadius: 16
  },
  topRight: {
    top: 0, right: 0,
    borderTopWidth: 4, borderRightWidth: 4,
    borderTopRightRadius: 16
  },
  bottomLeft: {
    bottom: 0, left: 0,
    borderBottomWidth: 4, borderLeftWidth: 4,
    borderBottomLeftRadius: 16
  },
  bottomRight: {
    bottom: 0, right: 0,
    borderBottomWidth: 4, borderRightWidth: 4,
    borderBottomRightRadius: 16
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 90, // Above bottom nav tab
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 20
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e1e5dd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e3b2e',
    marginBottom: 4
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 20
  },
  tabsContainer: {
    gap: 12,
    marginBottom: 24
  },
  tabActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6
  },
  tabTextActive: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e3b2e'
  },
  tabInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6
  },
  tabTextInactive: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7f8c8d'
  },
  statsArea: {
    flexDirection: 'row',
    gap: 16
  },
  statBox: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: '#f0f4f0',
    paddingTop: 16
  },
  statHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500'
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e3b2e',
    marginBottom: 2
  },
  statDesc: {
    fontSize: 11,
    color: '#a3b1aa'
  }
});

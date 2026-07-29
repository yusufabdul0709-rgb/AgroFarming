import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, MoreHorizontal, MapPin } from 'lucide-react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import FieldDetailsScreen from './FieldDetailsScreen';

import useDeviceLocation from '../hooks/useDeviceLocation';
import { useProfile } from '../context/ProfileContext';

// Use Mapbox token from environment
import MapboxAgriMap from '../components/MapboxAgriMap';

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || process.env.VITE_MAPBOX_TOKEN || process.env.MAPBOX_TOKEN || '';

export default function GISMapScreen({ userCoords, onBack }) {
  const { location } = useDeviceLocation();
  const { farmerProfile } = useProfile();
  const [showDetails, setShowDetails] = useState(false);
  const [currentCoords, setCurrentCoords] = useState(userCoords || { latitude: 17.6868, longitude: 83.2185 });

  React.useEffect(() => {
    if (userCoords) {
      setCurrentCoords(userCoords);
    } else if (location) {
      setCurrentCoords(location);
    }
  }, [userCoords, location]);

  const plotName = farmerProfile?.name ? `${farmerProfile.name}'s Farm` : 'South wheat plot';
  const plotCoord = `${currentCoords.latitude.toFixed(4)}° N, ${currentCoords.longitude.toFixed(4)}° E`;
  const plotArea = farmerProfile?.landArea ? `${farmerProfile.landArea} Acres` : '15.4 ha';

  if (showDetails) {
    return <FieldDetailsScreen onBack={() => setShowDetails(false)} />;
  }

  return (
    <View style={styles.container}>
      <MapboxAgriMap
        latitude={currentCoords.latitude}
        longitude={currentCoords.longitude}
        title="Live GPS Farm Field"
        height="100%"
      />


      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton}>
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My field</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MoreHorizontal size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerPin}>
          <View style={styles.pinDot} />
        </View>

        <View style={styles.floatingCard}>
          <View style={styles.cardTop}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1628187848417-640fb64eb535?q=80&w=150&auto=format&fit=crop' }} 
              style={styles.plotThumbnail}
            />
            <View style={styles.plotInfo}>
              <Text style={styles.plotTitle}>{plotName}</Text>
              <Text style={styles.plotCoord}>{plotCoord}</Text>
              
              <View style={styles.plotStats}>
                <View style={styles.tag}>
                  <MapPin size={12} color="#1e3b2e" />
                  <Text style={styles.tagText}>{plotArea}</Text>
                </View>
                <TouchableOpacity onPress={() => setShowDetails(true)}>
                  <Text style={styles.fieldDetailsLink}>Field details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  mapBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60, // Adjust for safe area
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700'
  },
  centerPin: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    marginLeft: -15,
    marginTop: -15,
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5
  },
  pinDot: {
    width: 12,
    height: 12,
    backgroundColor: '#1e3b2e',
    borderRadius: 6
  },
  floatingCard: {
    position: 'absolute',
    bottom: 110, // Above bottom tab bar
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8
  },
  cardTop: {
    flexDirection: 'row',
    gap: 16
  },
  plotThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 16
  },
  plotInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  plotTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3b2e',
    marginBottom: 4
  },
  plotCoord: {
    fontSize: 11,
    color: '#7f8c8d',
    marginBottom: 12
  },
  plotStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e3b2e'
  },
  fieldDetailsLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4caf50'
  }
});

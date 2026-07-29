import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Plus, 
  CalendarDays,
  LayoutGrid,
  Droplet,
  TrendingUp,
  TrendingUp,
  MapPin
} from 'lucide-react-native';
import { useProfile } from '../context/ProfileContext';

export default function FieldDetailsScreen({ onBack }) {
  const { farmerProfile, farmTwin } = useProfile();
  
  const fieldName = farmTwin?.name || 'South wheat plot';
  const gps = farmerProfile?.gpsLocation;
  const lat = typeof gps === 'string' ? JSON.parse(gps)?.latitude : gps?.latitude;
  const lng = typeof gps === 'string' ? JSON.parse(gps)?.longitude : gps?.longitude;
  const latStr = lat ? `${lat.toFixed(4)}° N` : '49.5881° N';
  const lngStr = lng ? `${lng.toFixed(4)}° E` : '34.5514° E';
  const area = farmerProfile?.landArea ? `${farmerProfile.landArea} ha` : '15.4 ha';
  const soilMoisture = farmTwin?.soilProfile?.moisture ? `${farmTwin.soilProfile.moisture}%` : '54%';
  const maturity = farmTwin?.cropStatus?.growthPercentage ? `${farmTwin.cropStatus.growthPercentage}%` : '68%';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={onBack}>
            <ArrowLeft size={20} color="#1e3b2e" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>{fieldName}</Text>
            <Text style={styles.subtitle}>{latStr}, {lngStr}</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <MoreHorizontal size={20} color="#1e3b2e" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.btnDark}>
            <Plus size={16} color="white" />
            <Text style={styles.btnDarkText}>Add task</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.btnLight}>
            <CalendarDays size={16} color="#1e3b2e" />
            <Text style={styles.btnLightText}>Plan next activity</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.btnSquare}>
            <LayoutGrid size={16} color="#1e3b2e" />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <View style={styles.statLabelRow}>
              <MapPin size={10} color="#7f8c8d" />
              <Text style={styles.statLabel}>Field area</Text>
            </View>
            <Text style={styles.statValue}>{area}</Text>
          </View>
          <View style={styles.statCol}>
            <View style={styles.statLabelRow}>
              <Droplet size={10} color="#7f8c8d" />
              <Text style={styles.statLabel}>Soil moisture</Text>
            </View>
            <Text style={styles.statValue}>{soilMoisture}</Text>
          </View>
          <View style={styles.statCol}>
            <View style={styles.statLabelRow}>
              <TrendingUp size={10} color="#7f8c8d" />
              <Text style={styles.statLabel}>Maturity level</Text>
            </View>
            <Text style={styles.statValue}>{maturity}</Text>
          </View>
        </View>

        {/* Image Card */}
        <View style={styles.imageCard}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1574326127117-64df753b53c7?q=80&w=800&auto=format&fit=crop' }}
            style={styles.fieldImage}
            imageStyle={{ borderRadius: 24 }}
          >
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Active</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Upcoming Tasks */}
        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming tasks</Text>
            <TouchableOpacity>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            <View style={[styles.taskCard, { backgroundColor: '#f0f4f8' }]}>
              <View style={styles.taskHeader}>
                <CalendarDays size={12} color="#5a6245" />
                <Text style={styles.taskTime}>9:20 AM</Text>
              </View>
              <Text style={styles.taskTitle}>Irrigation{"\n"}completed</Text>
            </View>
            
            <View style={[styles.taskCard, { backgroundColor: '#fdf3e7' }]}>
              <View style={styles.taskHeader}>
                <CalendarDays size={12} color="#5a6245" />
                <Text style={styles.taskTime}>11:00 AM</Text>
              </View>
              <Text style={styles.taskTitle}>Soil sampling{"\n"}planned</Text>
            </View>

            <View style={[styles.taskCard, { backgroundColor: '#eaf4e0' }]}>
              <View style={styles.taskHeader}>
                <CalendarDays size={12} color="#5a6245" />
                <Text style={styles.taskTime}>18:00 PM</Text>
              </View>
              <Text style={styles.taskTitle}>Drone{"\n"}monitor</Text>
            </View>
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  scrollContent: {
    paddingTop: 60, // for safe area
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0f4f0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  headerTitles: {
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3b2e',
    marginBottom: 2
  },
  subtitle: {
    fontSize: 11,
    color: '#7f8c8d'
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24
  },
  btnDark: {
    flex: 1,
    backgroundColor: '#1e3b2e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 6
  },
  btnDarkText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13
  },
  btnLight: {
    flex: 1.2,
    backgroundColor: '#d8efc5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 6
  },
  btnLightText: {
    color: '#1e3b2e',
    fontWeight: '600',
    fontSize: 13
  },
  btnSquare: {
    width: 44,
    height: 44,
    backgroundColor: '#f0f4f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8
  },
  statCol: {
    alignItems: 'flex-start'
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4
  },
  statLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    fontWeight: '500'
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e3b2e'
  },
  imageCard: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8
  },
  fieldImage: {
    width: '100%',
    height: '100%',
    padding: 16
  },
  activeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6
  },
  activeDot: {
    width: 6,
    height: 6,
    backgroundColor: '#4caf50',
    borderRadius: 3
  },
  activeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1e3b2e'
  },
  tasksSection: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3b2e'
  },
  editLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3498db'
  },
  taskCard: {
    width: 120,
    padding: 16,
    borderRadius: 20
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12
  },
  taskTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5a6245'
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e3b2e',
    lineHeight: 18
  }
});

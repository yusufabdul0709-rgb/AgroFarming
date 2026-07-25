import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions 
} from 'react-native';
import { 
  Bell, 
  MapPin, 
  Mic, 
  Sprout, 
  Sliders, 
  Map, 
  MessageSquare, 
  Camera, 
  TrendingUp, 
  Search, 
  CloudSun, 
  Droplet, 
  Activity, 
  Coins 
} from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import GlassCard from '../components/GlassCard';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeDashboardScreen({ onNavigateTo }) {
  const { farmerProfile } = useProfile();

  const overviewStats = [
    { key: 'weather', title: 'Weather', val: '28°C', sub: 'Partly Cloudy', icon: <CloudSun size={20} color="#EAA013" />, bg: '#FFF9EB' },
    { key: 'water-intelligence', title: 'Water Score', val: '82/100', sub: 'Good', icon: <Droplet size={20} color="#2196F3" />, bg: '#EBF5FF' },
    { key: 'soil-health', title: 'Soil Health', val: '75/100', sub: 'Good', icon: <Activity size={20} color="#4CAF50" />, bg: '#ECFDF0' },
    { key: 'market-prices', title: 'Market Price', val: '₹2,450/qtl', sub: 'Paddy', icon: <Coins size={20} color="#795548" />, bg: '#F7F0EC' }
  ];

  const quickAccessItems = [
    { key: 'secure-vault', title: 'Secure Vault', emoji: '🔐', color: '#F0F4FF' },
    { key: 'crop-recommendation', title: 'AI Crop Recommendation', emoji: '🌾', color: '#EAF8EE' },
    { key: 'soil-health', title: 'Soil Health', emoji: '🧪', color: '#FDF6EC' },
    { key: 'water-intelligence', title: 'Water Intelligence', emoji: '💧', color: '#EBF6FD' },
    { key: 'market-prices', title: 'Market Prices', emoji: '📈', color: '#F7F1EE' },
    { key: 'millet-scanner', title: 'Millet Scanner', emoji: '🌾', color: '#F3F8F2' },
    { key: 'crop-doctor', title: 'Crop Doctor', emoji: '🐛', color: '#FEF4F4' },
    { key: 'scheme-finder', title: 'Scheme Finder', emoji: '🏛️', color: '#F5F5FA' }
  ];

  return (
    <View style={styles.container}>
      {/* 1. Header Bar */}
      <View style={styles.headerBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={{ width: 36, height: 36, borderRadius: 18 }} 
          />
          <View>
            <Text style={styles.headerLogo}>ApnaKissan</Text>
            <Text style={styles.headerTagline}>Smart Farming. Better Tomorrow.</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconCircle} onPress={() => alert('No new notifications')}>
            <Bell size={20} color={THEME.textDark} />
            <View style={styles.redDot} />
          </TouchableOpacity>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80' }} 
            style={styles.avatarImg}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 2. Location Banner */}
        <View style={styles.locationContainer}>
          <MapPin size={14} color={THEME.primary} />
          <Text style={styles.locationText}>Rajapur, Warangal</Text>
          <Text style={styles.locationSubText}>• Telangana, India</Text>
        </View>

        {/* 3. Farmer Banner greeting card */}
        <View style={styles.farmerBanner}>
          <View style={styles.farmerBannerLeft}>
            <Text style={styles.greetingText}>Good Morning, {farmerProfile.name || 'Ramesh'}!</Text>
            <Text style={styles.subGreetingText}>Let's make today productive.</Text>
            <TouchableOpacity 
              style={styles.askAiBtn} 
              onPress={() => onNavigateTo('ai-assistant')}
            >
              <Mic size={14} color="white" />
              <Text style={styles.askAiBtnText}>Ask AI Assistant</Text>
              <Text style={styles.waveText}>| | |</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.farmerBannerRight}>
            <View style={styles.farmerPhotoWrapper}>
              <Text style={styles.farmerPhotoEmoji}>👨‍🌾</Text>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1595273670150-db0a3e39843c?auto=format&fit=crop&w=300&q=80' }} 
                style={styles.farmerPhoto}
              />
            </View>
          </View>
        </View>

        {/* 4. Today's Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <TouchableOpacity onPress={() => alert('Customize widgets coming soon!')}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable overview cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.overviewScroll}
        >
          {overviewStats.map(stat => (
            <TouchableOpacity 
              key={stat.key} 
              style={[styles.statCard, { backgroundColor: stat.bg }]}
              onPress={() => onNavigateTo(stat.key)}
            >
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>{stat.title}</Text>
                {stat.icon}
              </View>
              <Text style={styles.statVal}>{stat.val}</Text>
              <Text style={styles.statSub}>{stat.sub}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Mapbox: Set Land Location */}
        <View style={styles.sectionHeaderGrid}>
          <Text style={styles.sectionTitle}>Farm Location</Text>
        </View>
        <View style={styles.mapContainer}>

          <TouchableOpacity 
            style={styles.setLocationBtn}
            onPress={() => alert('Opening full map to set location...')}
          >
            <MapPin size={18} color="white" />
            <Text style={styles.setLocationBtnText}>Set Land Location</Text>
          </TouchableOpacity>
        </View>


        {/* 5. Quick Access Grid */}
        <Text style={[styles.sectionTitleGrid, { marginTop: 24 }]}>Quick Access</Text>
        <View style={styles.gridContainer}>
          {quickAccessItems.map(item => (
            <TouchableOpacity 
              key={item.key} 
              style={[styles.gridCell]}
              onPress={() => onNavigateTo(item.key)}
            >
              <View style={[styles.gridCellIcon, { backgroundColor: item.color }]}>
                <Text style={styles.gridEmoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.gridCellText} numberOfLines={2}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.06)'
  },
  headerLogo: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.primary
  },
  headerTagline: {
    fontSize: 10,
    color: THEME.textMuted,
    fontWeight: '600',
    marginTop: 1
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7F3',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  redDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'red'
  },
  avatarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.15)'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF0EB',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    marginBottom: 16
  },
  locationText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.primary,
    marginLeft: 4
  },
  locationSubText: {
    fontSize: 11,
    color: THEME.textMuted,
    marginLeft: 2
  },
  farmerBanner: {
    backgroundColor: '#E6EFEA',
    borderRadius: 28,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.08)'
  },
  farmerBannerLeft: {
    flex: 1.2
  },
  farmerBannerRight: {
    flex: 0.8,
    alignItems: 'flex-end'
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.deepForest
  },
  subGreetingText: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 4,
    marginBottom: 16
  },
  askAiBtn: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6
  },
  askAiBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700'
  },
  waveText: {
    color: 'white',
    fontSize: 8,
    opacity: 0.7,
    marginLeft: 4
  },
  farmerPhotoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#C1DFC9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
    overflow: 'hidden',
    position: 'relative'
  },
  farmerPhotoEmoji: {
    fontSize: 44,
    position: 'absolute'
  },
  farmerPhoto: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.textDark
  },
  editLink: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.primary
  },
  overviewScroll: {
    gap: 12,
    paddingBottom: 6
  },
  statCard: {
    width: (SCREEN_WIDTH - 52) / 2.3,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.05)'
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.textMuted
  },
  statVal: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.textDark
  },
  statSub: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 2,
    fontWeight: '600'
  },
  sectionTitleGrid: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.textDark,
    marginBottom: 14
  },
  sectionHeaderGrid: {
    marginTop: 24,
    marginBottom: 14
  },
  mapContainer: {
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#EAEAEA',
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.08)'
  },
  map: {
    flex: 1
  },
  setLocationBtn: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: THEME.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5
  },
  setLocationBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16
  },
  gridCell: {
    width: (SCREEN_WIDTH - 60) / 4,
    alignItems: 'center'
  },
  gridCellIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#1b2e1b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1
  },
  gridEmoji: {
    fontSize: 22
  },
  gridCellText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.textDark,
    textAlign: 'center',
    lineHeight: 13
  }
});

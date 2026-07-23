import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ImageBackground, 
  Platform 
} from 'react-native';
import { 
  Menu, 
  Bell, 
  MapPin, 
  ChevronDown, 
  Sun, 
  CloudRain, 
  Droplets, 
  Sprout, 
  TrendingUp, 
  Bot, 
  Stethoscope, 
  ScanLine, 
  BarChart3, 
  Building2, 
  Waves, 
  FlaskConical, 
  Map as MapIcon, 
  Calculator, 
  Users, 
  ArrowRight,
  Sparkles,
  Clock,
  Coins
} from 'lucide-react-native';
import * as Location from 'expo-location';
import { useProfile } from '../context/ProfileContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://172.30.88.52:5000/api' : 'http://localhost:5000/api');

export default function HomeDashboardScreen({ onAvatarPress, onViewMap, onNavigateTab }) {
  const { farmerProfile } = useProfile();
  
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('Fetching GPS...');
  const [subLocation, setSubLocation] = useState('Locating...');
  const [coords, setCoords] = useState({ latitude: 17.6868, longitude: 83.3088 });

  useEffect(() => {
    const initLocationAndWeather = async () => {
      let lat = 17.6868;
      let lon = 83.3088;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const userLoc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          lat = userLoc.coords.latitude;
          lon = userLoc.coords.longitude;
          setCoords({ latitude: lat, longitude: lon });
        }
      } catch (e) {
        console.warn('GPS location fallback:', e.message);
      }

      // Fetch Geocode & Weather for detected GPS coordinates
      try {
        const geoRes = await fetch(`${API_URL}/geocode?latitude=${lat}&longitude=${lon}`);
        if (geoRes.ok) {
          const geoJson = await geoRes.json();
          const addr = geoJson.data?.address;
          if (addr) {
            setLocation(`${addr.city || addr.town || addr.county || 'Rajapur'}, ${addr.state_district || 'Warangal'}`);
            setSubLocation(`${addr.state || 'Telangana'}, ${addr.country || 'India'}`);
          }
        }
      } catch (e) {
        setLocation('Rajapur, Warangal');
        setSubLocation('Telangana, India');
      }

      try {
        const weatherRes = await fetch(`${API_URL}/weather?latitude=${lat}&longitude=${lon}`);
        if (weatherRes.ok) {
          const wData = await weatherRes.json();
          setWeather(wData.weather || wData.data || null);
        }
      } catch (e) {
        console.warn('Weather fetch error:', e.message);
      }
    };

    initLocationAndWeather();
  }, []);

  const smartTools = [
    { id: 'ai', name: 'AI Assistant', desc: 'Ask Anything', icon: Bot, color: '#e0f2fe', iconColor: '#0284c7', target: 'ai' },
    { id: 'doctor', name: 'Crop Doctor', desc: 'Detect Disease', icon: Stethoscope, color: '#dcfce7', iconColor: '#16a34a', target: 'crop_doctor' },
    { id: 'millet', name: 'Millet Scanner', desc: 'Check Quality', icon: ScanLine, color: '#fef3c7', iconColor: '#d97706', target: 'millet_scanner' },
    { id: 'market', name: 'Market Intelligence', desc: 'Price Prediction', icon: BarChart3, color: '#f3e8ff', iconColor: '#9333ea', target: 'market_intel' },
    { id: 'scheme', name: 'Scheme Finder', desc: 'Check Eligibility', icon: Building2, color: '#ffe4e6', iconColor: '#e11d48', target: 'scheme_finder' },
    { id: 'water', name: 'Water Intelligence', desc: 'Water Insights', icon: Waves, color: '#e0f2fe', iconColor: '#0284c7', target: 'water_intel' },
    { id: 'soil', name: 'Soil Analyzer', desc: 'Soil Health', icon: FlaskConical, color: '#fef3c7', iconColor: '#b45309', target: 'soil_analyzer' },
    { id: 'farm', name: 'Farm Map', desc: 'Geo Insights', icon: MapIcon, color: '#dcfce7', iconColor: '#15803d', target: 'map' },
    { id: 'calc', name: 'Profit Calculator', desc: 'Plan Better', icon: Calculator, color: '#e0e7ff', iconColor: '#4338ca', target: 'profit_calc' },
    { id: 'community', name: 'Community', desc: 'Farmers Connect', icon: Users, color: '#d1fae5', iconColor: '#059669', target: 'community' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      
      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn}>
          <Menu size={22} color="#1b4332" />
        </TouchableOpacity>

        <View style={styles.brandContainer}>
          <View style={styles.logoRow}>
            <Sprout size={24} color="#2e7d32" />
            <Text style={styles.brandName}>Apna<Text style={{ color: '#2e7d32' }}>Kissan</Text></Text>
          </View>
          <Text style={styles.brandTagline}>Smart Farming. Better Tomorrow.</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Bell size={20} color="#1b4332" />
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onAvatarPress}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
              style={styles.avatarImage} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* LOCATION & WEATHER QUICK BAR (GPS LIVE) */}
      <View style={styles.locationBar}>
        <View style={styles.locationLeft}>
          <View style={styles.locIconBadge}>
            <MapPin size={18} color="#2e7d32" />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.locTitle}>{farmerProfile.village ? `${farmerProfile.village}, Warangal` : location}</Text>
              <ChevronDown size={14} color="#1b4332" />
            </View>
            <Text style={styles.locSub}>{subLocation}</Text>
          </View>
        </View>

        <View style={styles.weatherQuickRight}>
          <Sun size={26} color="#f59e0b" />
          <View>
            <Text style={styles.quickTemp}>
              {weather?.current?.temperature_2m ? `${Math.round(weather.current.temperature_2m)}°C` : '28°C'}
            </Text>
            <Text style={styles.quickCondition}>Partly Cloudy</Text>
          </View>
          <View style={styles.rainBadge}>
            <CloudRain size={12} color="#0284c7" />
            <Text style={styles.rainTxt}>Rain 20%</Text>
          </View>
        </View>
      </View>

      {/* GREETING HERO BANNER */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop' }}
        style={styles.heroBanner}
        imageStyle={{ borderRadius: 24 }}
      >
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.greetingText}>
            Good Morning, <Text style={{ color: '#81c784' }}>{farmerProfile.name || 'Ramesh'}!</Text>
          </Text>
          <Text style={styles.greetingSub}>Let's make today productive and profitable.</Text>

          <TouchableOpacity 
            style={styles.aiAssistantBtn}
            onPress={() => onNavigateTab ? onNavigateTab('ai') : null}
          >
            <Text style={styles.aiBtnText}>Ask AI Assistant</Text>
            <Sparkles size={16} color="white" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* METRICS 4-GRID */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricTitle}>Weather</Text>
            <Sun size={16} color="#f59e0b" />
          </View>
          <Text style={styles.metricValue}>
            {weather?.current?.temperature_2m ? `${Math.round(weather.current.temperature_2m)}°C` : '28°C'}
          </Text>
          <Text style={styles.metricSub}>🌧️ 20% Rain</Text>
          <Text style={styles.metricSub}>Humidity 65%</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricTitle}>Water Score</Text>
            <Droplets size={16} color="#0284c7" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
            <Text style={styles.metricValue}>82</Text>
            <Text style={styles.metricDenom}>/100</Text>
          </View>
          <Text style={styles.statusGood}>Good</Text>
          <View style={styles.sparklinePlaceholder}>
            <View style={styles.sparkLine} />
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricTitle}>Soil Health</Text>
            <Sprout size={16} color="#2e7d32" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
            <Text style={styles.metricValue}>75</Text>
            <Text style={styles.metricDenom}>/100</Text>
          </View>
          <Text style={styles.statusGood}>Good</Text>
          <View style={styles.sparklinePlaceholder}>
            <View style={[styles.sparkLine, { backgroundColor: '#f59e0b' }]} />
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricTitle}>Market Price</Text>
            <TrendingUp size={16} color="#16a34a" />
          </View>
          <Text style={styles.metricValue}>₹2,450 <Text style={styles.qtlTxt}>/qtl</Text></Text>
          <Text style={styles.cropName}>Paddy</Text>
          <Text style={styles.trendUp}>↑ 4.2%</Text>
        </View>
      </View>

      {/* AI CROP RECOMMENDATION CARD */}
      <View style={styles.recommendCard}>
        <View style={styles.recommendHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Sprout size={20} color="#2e7d32" />
            <Text style={styles.recommendSectionTitle}>AI Crop Recommendation</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cropMainRow}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200&auto=format&fit=crop' }}
            style={styles.cropImg}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.cropTitle}>Paddy (Swarna)</Text>
            <View style={styles.tagRow}>
              <View style={styles.bestMatchTag}>
                <Text style={styles.bestMatchTxt}>Best Match</Text>
              </View>
              <View style={styles.highProfitTag}>
                <Text style={styles.highProfitTxt}>High Profit</Text>
              </View>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.scoreLabel}>Suitability Score</Text>
            <Text style={styles.scoreVal}>92%</Text>
          </View>
        </View>

        <View style={styles.cropStatsGrid}>
          <View style={styles.cropStatItem}>
            <BarChart3 size={14} color="#2e7d32" />
            <View>
              <Text style={styles.statMiniTitle}>Expected Yield</Text>
              <Text style={styles.statMiniVal}>28-32 qtl/acre</Text>
            </View>
          </View>

          <View style={styles.cropStatItem}>
            <Coins size={14} color="#2e7d32" />
            <View>
              <Text style={styles.statMiniTitle}>Est. Profit</Text>
              <Text style={styles.statMiniVal}>₹45,000/acre</Text>
            </View>
          </View>

          <View style={styles.cropStatItem}>
            <Droplets size={14} color="#0284c7" />
            <View>
              <Text style={styles.statMiniTitle}>Water Need</Text>
              <Text style={styles.statMiniVal}>Medium</Text>
            </View>
          </View>

          <View style={styles.cropStatItem}>
            <Clock size={14} color="#f59e0b" />
            <View>
              <Text style={styles.statMiniTitle}>Duration</Text>
              <Text style={styles.statMiniVal}>120-130 days</Text>
            </View>
          </View>
        </View>
      </View>

      {/* SMART TOOLS GRID - SEPARATE DEDICATED PAGES */}
      <View style={styles.smartToolsSection}>
        <Text style={styles.sectionTitle}>Smart Tools</Text>
        
        <View style={styles.toolsGrid}>
          {smartTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <TouchableOpacity 
                key={tool.id} 
                style={styles.toolCard}
                onPress={() => onNavigateTab ? onNavigateTab(tool.target, coords) : null}
              >
                <View style={[styles.toolIconBadge, { backgroundColor: tool.color }]}>
                  <IconComponent size={22} color={tool.iconColor} />
                </View>
                <Text style={styles.toolName}>{tool.name}</Text>
                <Text style={styles.toolDesc}>{tool.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* MILLET QUALITY SCANNER BANNER */}
      <View style={styles.milletBannerCard}>
        <View style={styles.milletContent}>
          <Text style={styles.milletTitle}>Millet Quality Scanner</Text>
          <Text style={styles.milletDesc}>
            Scan your millets and check freshness, fungus, and quality instantly.
          </Text>
          <TouchableOpacity 
            style={styles.scanNowBtn}
            onPress={() => onNavigateTab ? onNavigateTab('millet_scanner') : null}
          >
            <Text style={styles.scanNowTxt}>Scan Now</Text>
            <ArrowRight size={16} color="white" />
          </TouchableOpacity>
        </View>

        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=300&auto=format&fit=crop' }}
          style={styles.milletImg}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8faf8' },
  scrollContent: { padding: 16, paddingTop: 50, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  brandContainer: { alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandName: { fontSize: 20, fontWeight: '800', color: '#1b4332' },
  brandTagline: { fontSize: 10, color: '#52796f', fontWeight: '600', marginTop: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bellBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: '#ef4444', width: 14, height: 14, borderRadius: 7, justifyContent: 'center', alignItems: 'center' },
  bellBadgeText: { color: 'white', fontSize: 8, fontWeight: '800' },
  avatarImage: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: '#2e7d32' },
  locationBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 12, borderRadius: 18, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  locationLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  locIconBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center' },
  locTitle: { fontSize: 14, fontWeight: '700', color: '#1b4332' },
  locSub: { fontSize: 11, color: '#64748b', fontWeight: '500' },
  weatherQuickRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  quickTemp: { fontSize: 15, fontWeight: '800', color: '#1b4332' },
  quickCondition: { fontSize: 10, color: '#64748b' },
  rainBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#f0f9ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  rainTxt: { fontSize: 10, fontWeight: '700', color: '#0284c7' },
  heroBanner: { width: '100%', height: 180, borderRadius: 24, marginBottom: 16, overflow: 'hidden', justifyContent: 'flex-end' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 45, 25, 0.45)' },
  heroContent: { padding: 20 },
  greetingText: { fontSize: 22, fontWeight: '800', color: 'white' },
  greetingSub: { fontSize: 12, color: '#e2e8f0', marginTop: 4, marginBottom: 14 },
  aiAssistantBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2e7d32', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 8 },
  aiBtnText: { color: 'white', fontSize: 13, fontWeight: '700' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  metricCard: { width: '48%', backgroundColor: 'white', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  metricTitle: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  metricValue: { fontSize: 20, fontWeight: '800', color: '#1b4332' },
  metricSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  metricDenom: { fontSize: 12, fontWeight: '600', color: '#94a3b8' },
  statusGood: { fontSize: 11, fontWeight: '700', color: '#16a34a', marginTop: 2 },
  sparklinePlaceholder: { height: 4, backgroundColor: '#f1f5f9', borderRadius: 2, marginTop: 8, overflow: 'hidden' },
  sparkLine: { width: '75%', height: '100%', backgroundColor: '#16a34a' },
  qtlTxt: { fontSize: 11, fontWeight: '500', color: '#64748b' },
  cropName: { fontSize: 11, color: '#64748b', marginTop: 2 },
  trendUp: { fontSize: 12, fontWeight: '700', color: '#16a34a', marginTop: 2 },
  recommendCard: { backgroundColor: 'white', borderRadius: 22, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  recommendHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  recommendSectionTitle: { fontSize: 15, fontWeight: '700', color: '#1b4332' },
  viewAllText: { fontSize: 12, fontWeight: '700', color: '#2e7d32' },
  cropMainRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  cropImg: { width: 50, height: 50, borderRadius: 25 },
  cropTitle: { fontSize: 16, fontWeight: '800', color: '#1b4332' },
  tagRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  bestMatchTag: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  bestMatchTxt: { color: '#15803d', fontSize: 10, fontWeight: '700' },
  highProfitTag: { backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  highProfitTxt: { color: '#b45309', fontSize: 10, fontWeight: '700' },
  scoreLabel: { fontSize: 10, color: '#64748b' },
  scoreVal: { fontSize: 20, fontWeight: '800', color: '#16a34a' },
  cropStatsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cropStatItem: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f8faf8', padding: 10, borderRadius: 12 },
  statMiniTitle: { fontSize: 10, color: '#64748b' },
  statMiniVal: { fontSize: 12, fontWeight: '700', color: '#1b4332' },
  smartToolsSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1b4332', marginBottom: 14 },
  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  toolCard: { width: '30.5%', backgroundColor: 'white', borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  toolIconBadge: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  toolName: { fontSize: 11, fontWeight: '700', color: '#1b4332', textAlign: 'center' },
  toolDesc: { fontSize: 9, color: '#64748b', textAlign: 'center', marginTop: 2 },
  milletBannerCard: { flexDirection: 'row', backgroundColor: '#e8f5e9', borderRadius: 22, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#c8e6c9' },
  milletContent: { flex: 1, paddingRight: 10 },
  milletTitle: { fontSize: 16, fontWeight: '800', color: '#1b4332', marginBottom: 4 },
  milletDesc: { fontSize: 11, color: '#374151', lineHeight: 16, marginBottom: 12 },
  scanNowBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2e7d32', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, gap: 6 },
  scanNowTxt: { color: 'white', fontSize: 12, fontWeight: '700' },
  milletImg: { width: 85, height: 85, borderRadius: 18 },
});

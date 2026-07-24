import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { CloudSun, Sun, CloudRain, Wind, Droplet, Compass } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';

export default function WeatherScreen({ onBack }) {
  const forecast = [
    { day: 'Tue', date: '21 May', temp: '30° / 22°', rainChance: '10%', icon: <Sun size={18} color="#EAA013" /> },
    { day: 'Wed', date: '22 May', temp: '31° / 23°', rainChance: '20%', icon: <CloudSun size={18} color="#EAA013" /> },
    { day: 'Thu', date: '23 May', temp: '29° / 22°', rainChance: '40%', icon: <CloudRain size={18} color="#2196F3" /> },
    { day: 'Fri', date: '24 May', temp: '28° / 21°', rainChance: '60%', icon: <CloudRain size={18} color="#2196F3" /> },
    { day: 'Sat', date: '25 May', temp: '30° / 22°', rainChance: '10%', icon: <Sun size={18} color="#EAA013" /> },
    { day: 'Sun', date: '26 May', temp: '32° / 23°', rainChance: '5%', icon: <Sun size={18} color="#EAA013" /> },
    { day: 'Mon', date: '27 May', temp: '33° / 24°', rainChance: '5%', icon: <Sun size={18} color="#EAA013" /> }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weather</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Location & Date */}
        <View style={styles.locRow}>
          <Text style={styles.locText}>Rajapur, Warangal</Text>
          <Text style={styles.dateText}>Today, 20 May</Text>
        </View>

        {/* Large Weather Card */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherCardTop}>
            <View>
              <Text style={styles.weatherTemp}>28°C</Text>
              <Text style={styles.weatherCond}>Partly Cloudy</Text>
            </View>
            <CloudSun size={56} color="white" />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.weatherCardBottom}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Rain Chance</Text>
              <Text style={styles.statVal}>20%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Humidity</Text>
              <Text style={styles.statVal}>65%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Wind</Text>
              <Text style={styles.statVal}>12 km/h</Text>
            </View>
          </View>
        </View>

        {/* 7-Day Forecast */}
        <Text style={styles.sectionHeader}>7-Day Forecast</Text>
        <View style={styles.forecastCard}>
          {forecast.map((item, i) => (
            <View key={i} style={styles.forecastRow}>
              <View style={{ width: 45 }}>
                <Text style={styles.dayText}>{item.day}</Text>
              </View>
              <View style={{ width: 55 }}>
                <Text style={styles.dateTextLabel}>{item.date}</Text>
              </View>
              <View style={styles.forecastIconCol}>
                {item.icon}
                <Text style={styles.forecastTemp}>{item.temp}</Text>
              </View>
              <View style={styles.rainChanceCol}>
                <Droplet size={10} color="#2196F3" />
                <Text style={styles.rainChanceText}>{item.rainChance}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={() => alert('Launching rain radar map overlay...')}>
          <Text style={styles.actionBtnText}>View Weather Map</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.06)'
  },
  backBtn: {
    padding: 8
  },
  backText: {
    fontSize: 16,
    color: THEME.textDark
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.textDark
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100
  },
  locRow: {
    marginBottom: 16
  },
  locText: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.textDark
  },
  dateText: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 2,
    fontWeight: '600'
  },
  weatherCard: {
    backgroundColor: '#6FA4DF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24
  },
  weatherCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white'
  },
  weatherCond: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    opacity: 0.9,
    marginTop: 2
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16
  },
  weatherCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statLabel: {
    fontSize: 11,
    color: 'white',
    opacity: 0.7,
    fontWeight: '600'
  },
  statVal: {
    fontSize: 14,
    fontWeight: '800',
    color: 'white',
    marginTop: 4
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.textDark,
    marginBottom: 12
  },
  forecastCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    marginBottom: 24
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.05)'
  },
  dayText: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.textDark
  },
  dateTextLabel: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: '600'
  },
  forecastIconCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  forecastTemp: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textDark
  },
  rainChanceCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  rainChanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2196F3'
  },
  actionBtn: {
    height: 52,
    backgroundColor: THEME.primary,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3
  },
  actionBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700'
  }
});

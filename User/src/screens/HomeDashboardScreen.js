import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Sprout, 
  CloudSun, 
  Droplet, 
  TrendingUp, 
  Landmark, 
  MapPin, 
  RefreshCw 
} from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import GlassCard from '../components/GlassCard';

export default function HomeDashboardScreen() {
  const { farmerProfile } = useProfile();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Farm Twin Header Card */}
      <View style={styles.twinHeaderCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.twinCardLabel}>ACTIVE DIGITAL TWIN</Text>
            <Text style={styles.twinCardTitle}>🌾 {farmerProfile.name}'s Plot</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
              <MapPin size={12} color={THEME.lightGreen} />
              <Text style={styles.twinCardGeo}>{farmerProfile.village || 'Milak'}, {farmerProfile.district || 'Rampur'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.twinSyncBtn} onPress={() => alert('Syncing satellite telemetry values...')}>
            <RefreshCw size={14} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid Widgets */}
      <View style={styles.gridRow}>
        <View style={styles.gridHalf}>
          <GlassCard>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
              <CloudSun size={18} color={THEME.primary} />
              <Text style={styles.widgetHeader}>Weather</Text>
            </View>
            <Text style={styles.weatherTemp}>29.5°C</Text>
            <Text style={styles.weatherCondition}>Humid / Sowing OK</Text>
            <View style={{ borderTopWidth: 1, borderColor: '#e1e5dd', marginTop: 8, paddingTop: 4 }}>
              <Text style={styles.widgetFooter}>Rain Prob: 30%</Text>
            </View>
          </GlassCard>
        </View>

        <View style={styles.gridHalf}>
          <GlassCard>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
              <Droplet size={18} color="#2196F3" />
              <Text style={styles.widgetHeader}>Water Score</Text>
            </View>
            <Text style={[styles.weatherTemp, { color: '#2196F3' }]}>85/100</Text>
            <Text style={styles.weatherCondition}>Stress: Low</Text>
            <View style={{ borderTopWidth: 1, borderColor: '#e1e5dd', marginTop: 8, paddingTop: 4 }}>
              <Text style={styles.widgetFooter}>Reservoir: Stable</Text>
            </View>
          </GlassCard>
        </View>
      </View>

      {/* Soil Health profile */}
      <GlassCard style={{ marginBottom: 12 }}>
        <Text style={styles.widgetHeader}>Soil NPK Nutrient Index</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          <View style={styles.npkCol}>
            <Text style={styles.npkVal}>125</Text>
            <Text style={styles.npkLabel}>Nitrogen (N)</Text>
          </View>
          <View style={styles.npkCol}>
            <Text style={[styles.npkVal, { color: THEME.goldenCrop }]}>42</Text>
            <Text style={styles.npkLabel}>Phosphorus (P)</Text>
          </View>
          <View style={styles.npkCol}>
            <Text style={[styles.npkVal, { color: THEME.lightGreen }]}>215</Text>
            <Text style={styles.npkLabel}>Potassium (K)</Text>
          </View>
        </View>
      </GlassCard>

      {/* Crop Recommendation AI output */}
      <GlassCard style={{ backgroundColor: '#eef8ee', borderColor: THEME.lightGreen, marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 10, fontWeight: '800', color: THEME.primary, letterSpacing: 0.5 }}>AI RECOMMENDED SWAP</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: THEME.deepForest, marginTop: 2 }}>Maize (Corn)</Text>
          </View>
          <View style={styles.suitBadge}>
            <Text style={styles.suitText}>92% match</Text>
          </View>
        </View>
        <Text style={{ fontSize: 12, color: THEME.textMuted, marginTop: 8, lineHeight: 16 }}>
          Swapping Paddy to Maize reduces water needs by 55%, predicting an expected profit increase of ₹12,500/acre.
        </Text>
      </GlassCard>

      {/* Market Pricing details */}
      <GlassCard style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginBottom: 10 }}>
          <TrendingUp size={18} color={THEME.goldenCrop} />
          <Text style={styles.widgetHeader}>Market Mandi Price</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 12, color: THEME.textMuted }}>Paddy Today</Text>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>₹2,183/Qntl</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 12, color: '#4CAF50', fontWeight: '600' }}>▲ +2.4% Up</Text>
            <Text style={{ fontSize: 11, color: THEME.textMuted, marginTop: 2 }}>Best selling: 12 days</Text>
          </View>
        </View>
      </GlassCard>

      {/* Government Schemes Matching */}
      <GlassCard style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginBottom: 10 }}>
          <Landmark size={18} color={THEME.primary} />
          <Text style={styles.widgetHeader}>Government Subsidies</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600' }}>PM-KISAN Scheme</Text>
            <Text style={{ fontSize: 11, color: THEME.textMuted, marginTop: 2 }}>Eligibility: 95% Approval Probability</Text>
          </View>
          <TouchableOpacity style={styles.applyBtn} onPress={() => alert('Direct application launched!')}>
            <Text style={styles.applyBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 90
  },
  twinHeaderCard: {
    backgroundColor: THEME.deepForest,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5
  },
  twinCardLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.lightGreen,
    letterSpacing: 1
  },
  twinCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    marginTop: 4
  },
  twinCardGeo: {
    fontSize: 12,
    color: '#c2c9bf'
  },
  twinSyncBtn: {
    backgroundColor: THEME.primary,
    padding: 12,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  gridHalf: {
    flex: 1
  },
  widgetHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.deepForest
  },
  weatherTemp: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.deepForest,
    marginVertical: 6
  },
  weatherCondition: {
    fontSize: 11,
    color: THEME.textMuted
  },
  widgetFooter: {
    fontSize: 10,
    color: THEME.textMuted
  },
  npkCol: {
    alignItems: 'center',
    flex: 1
  },
  npkVal: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.primary
  },
  npkLabel: {
    fontSize: 10,
    color: THEME.textMuted,
    marginTop: 4
  },
  suitBadge: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  suitText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700'
  },
  applyBtn: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12
  },
  applyBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700'
  }
});

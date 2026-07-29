import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { Droplet, Info, Compass } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';
import useDeviceLocation from '../hooks/useDeviceLocation';
import { API_BASE_URL } from '../config/api';

export default function WaterIntelligenceScreen({ onBack }) {
  const { location } = useDeviceLocation();
  const [waterData, setWaterData] = useState(null);

  useEffect(() => {
    if (!location) return;
    const fetchWater = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/ai/water`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude: location.latitude, longitude: location.longitude })
        });
        if (res.ok) {
          const json = await res.json();
          setWaterData(json.data);
        }
      } catch (e) {
        console.warn('Water AI fallback', e);
      }
    };
    fetchWater();
  }, [location]);

  const score = waterData?.water_availability_score ?? 82;
  const gwVal = waterData?.groundwater_depth ?? '12.4 m';
  const rfVal = waterData?.rainfall_next_7_days ?? '45 mm';
  const nrVal = waterData?.nearest_river_distance ?? '2.3 km';
  const nlVal = waterData?.nearest_lake_distance ?? '3.8 km';
  const cVal = waterData?.nearest_canal_distance ?? '1.6 km';
  const recommendationTitle = waterData?.recommendation_title ?? 'Drip Irrigation';
  const recommendationSub = waterData?.recommendation_sub ?? 'Will save 35% water and increase yield.';

  const waterResources = [
    { label: 'Groundwater Level', val: gwVal, status: 'Good', color: '#4CAF50' },
    { label: 'Rainfall (Next 7 Days)', val: rfVal, status: 'Moderate', color: '#EAA013' },
    { label: 'Nearest River', val: nrVal, status: '', color: '' },
    { label: 'Nearest Lake', val: nlVal, status: '', color: '' },
    { label: 'Canal Distance', val: cVal, status: '', color: '' }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Water Intelligence</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Water Score Card with blue background */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreTextSide}>
            <Text style={styles.scoreLabel}>Water Score</Text>
            <View style={styles.scoreValRow}>
              <Text style={styles.scoreValBig}>{score}</Text>
              <Text style={styles.scoreValMuted}>/100</Text>
            </View>
            <Text style={styles.scoreStatusText}>{score >= 70 ? 'Good' : 'Moderate'}</Text>
          </View>
          
          <View style={styles.dropletContainer}>
            <View style={styles.blueWavesBg}>
              <Droplet size={36} color="#2196F3" />
            </View>
          </View>
        </View>

        {/* Water Resources around you */}
        <Text style={styles.sectionHeader}>Water Resources Around You</Text>
        <View style={styles.resourcesCard}>
          {waterResources.map((item, i) => (
            <View key={i} style={styles.resourceRow}>
              <Text style={styles.resourceLabel}>{item.label}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.resourceVal}>{item.val}</Text>
                {item.status ? (
                  <Text style={[styles.resourceStatus, { color: item.color }]}>{item.status}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        {/* Irrigation Recommendation */}
        <Text style={styles.sectionHeader}>Irrigation Recommendation</Text>
        <View style={styles.recomCard}>
          <View style={styles.recomIconBg}>
            <Droplet size={16} color={THEME.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.recomTitle}>{recommendationTitle}</Text>
            <Text style={styles.recomSub}>{recommendationSub}</Text>
          </View>
          <View style={styles.recomBadge}>
            <Text style={styles.recomBadgeText}>Recommended</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={() => alert('Launching local watershed maps...')}>
          <Text style={styles.actionBtnText}>View Water Map</Text>
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
  scoreCard: {
    backgroundColor: '#EBF6FD',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.12)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  scoreTextSide: {
    flex: 1.2
  },
  scoreLabel: {
    fontSize: 11,
    color: '#1565C0',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  scoreValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8
  },
  scoreValBig: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0D47A1'
  },
  scoreValMuted: {
    fontSize: 14,
    color: '#1565C0',
    fontWeight: '700',
    marginLeft: 2
  },
  scoreStatusText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1565C0',
    marginTop: 2
  },
  dropletContainer: {
    flex: 0.8,
    alignItems: 'flex-end'
  },
  blueWavesBg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.textDark,
    marginBottom: 12
  },
  resourcesCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    marginBottom: 20
  },
  resourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.05)'
  },
  resourceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textMuted
  },
  resourceVal: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.textDark
  },
  resourceStatus: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4
  },
  recomCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24
  },
  recomIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(44, 107, 67, 0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  recomTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textDark
  },
  recomSub: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 2,
    fontWeight: '600'
  },
  recomBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(44, 107, 67, 0.08)'
  },
  recomBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.primary
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

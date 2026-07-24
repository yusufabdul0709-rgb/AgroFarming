import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { Activity, Leaf, ChevronRight } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';

export default function SoilHealthScreen({ onBack }) {
  const nutrients = [
    { name: 'Nitrogen (N)', status: 'Good', percentage: 80, color: '#4CAF50' },
    { name: 'Phosphorus (P)', status: 'Medium', percentage: 55, color: '#EAA013' },
    { name: 'Potassium (K)', status: 'Good', percentage: 85, color: '#4CAF50' },
    { name: 'Organic Carbon', status: 'Medium', percentage: 48, color: '#EAA013' },
    { name: 'pH Level', status: '6.8 (Optimal)', percentage: 90, color: '#4CAF50' }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Soil Health</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Overall Score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreTextSide}>
            <Text style={styles.scoreLabel}>Overall Soil Health Score</Text>
            <View style={styles.scoreValRow}>
              <Text style={styles.scoreValBig}>75</Text>
              <Text style={styles.scoreValMuted}>/100</Text>
            </View>
            <Text style={styles.scoreStatusText}>Good</Text>
            <Text style={styles.updatedText}>Last Updated: 20 May 2024</Text>
          </View>
          
          <View style={styles.ringContainer}>
            <View style={styles.scoreRing}>
              <Leaf size={28} color={THEME.primary} />
            </View>
          </View>
        </View>

        {/* Nutrients Status */}
        <Text style={styles.sectionHeader}>Nutrients Status</Text>
        <View style={styles.nutrientsCard}>
          {nutrients.map((item, i) => (
            <View key={i} style={styles.nutrientRow}>
              <View style={styles.nutInfo}>
                <Text style={styles.nutName}>{item.name}</Text>
                <Text style={[styles.nutStatusText, { color: item.color }]}>{item.status}</Text>
              </View>
              {/* Progress Bar */}
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Soil Type */}
        <View style={styles.typeCard}>
          <Text style={styles.typeLabel}>Soil Type</Text>
          <Text style={styles.typeVal}>Clay Loam</Text>
        </View>

        {/* Health tips */}
        <Text style={styles.sectionHeader}>Soil Health Tips</Text>
        <TouchableOpacity style={styles.tipsCard} onPress={() => alert('Opening compost recipes...')}>
          <View style={styles.tipsIconBg}>
            <Leaf size={16} color={THEME.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipsText}>
              Add organic compost to improve soil organic carbon.
            </Text>
          </View>
          <ChevronRight size={16} color={THEME.textMuted} />
        </TouchableOpacity>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={() => alert('Generating full soil laboratory report...')}>
          <Text style={styles.actionBtnText}>View Detailed Report</Text>
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
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
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
    color: THEME.textMuted,
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
    color: THEME.primary
  },
  scoreValMuted: {
    fontSize: 14,
    color: THEME.textMuted,
    fontWeight: '700',
    marginLeft: 2
  },
  scoreStatusText: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.primary,
    marginTop: 2
  },
  updatedText: {
    fontSize: 10,
    color: THEME.textMuted,
    marginTop: 6
  },
  ringContainer: {
    flex: 0.8,
    alignItems: 'flex-end'
  },
  scoreRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF8EE'
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.textDark,
    marginBottom: 12
  },
  nutrientsCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    marginBottom: 20
  },
  nutrientRow: {
    marginBottom: 16
  },
  nutInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  nutName: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textDark
  },
  nutStatusText: {
    fontSize: 12,
    fontWeight: '700'
  },
  barTrack: {
    height: 8,
    backgroundColor: 'rgba(44, 107, 67, 0.05)',
    borderRadius: 4,
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: 4
  },
  typeCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textMuted
  },
  typeVal: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.textDark
  },
  tipsCard: {
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
  tipsIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(44, 107, 67, 0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tipsText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textDark,
    lineHeight: 18
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

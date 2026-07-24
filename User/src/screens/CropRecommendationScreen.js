import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { Sprout, Info, Check, Calendar, TrendingUp } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';

export default function CropRecommendationScreen({ onBack }) {
  const [activeTab, setActiveTab] = useState('Recommended');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Crop Recommendation</Text>
        <TouchableOpacity style={styles.infoBtn}>
          <Info size={20} color={THEME.textDark} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {['Recommended', 'Alternative Crops', 'History'].map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabItemText, activeTab === tab && styles.tabItemTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Crop match score card */}
        <View style={styles.mainCard}>
          <View style={styles.mainCardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardLabel}>Best Crop for Your Field</Text>
              <Text style={styles.cropTitle}>Paddy (Swarna)</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: '#EBF8EE' }]}>
                  <Text style={[styles.badgeText, { color: THEME.primary }]}>Best Match</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: '#FFF5E6' }]}>
                  <Text style={[styles.badgeText, { color: '#E5A93C' }]}>High Profit</Text>
                </View>
              </View>
            </View>

            {/* Circular matching score ring */}
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>92%</Text>
              <Text style={styles.scoreLabel}>Match</Text>
            </View>
          </View>
        </View>

        {/* Why this crop checklist */}
        <Text style={styles.sectionHeader}>Why this crop?</Text>
        <View style={styles.checklistCard}>
          {[
            'Perfect match for your soil & weather',
            'Moderate water requirement',
            'High market demand in your area',
            'Good profit potential'
          ].map((item, i) => (
            <View key={i} style={styles.checkRow}>
              <View style={styles.checkIcon}>
                <Check size={12} color={THEME.primary} />
              </View>
              <Text style={styles.checkText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Summary grid */}
        <View style={styles.summaryGrid}>
          <View style={styles.sumCell}>
            <Text style={styles.sumLabel}>Expected Yield</Text>
            <Text style={styles.sumVal}>20-22 qtl/acre</Text>
          </View>
          <View style={styles.sumCell}>
            <Text style={styles.sumLabel}>Est. Profit</Text>
            <Text style={[styles.sumVal, { color: THEME.primary }]}>₹45,000/acre</Text>
          </View>
          <View style={styles.sumCell}>
            <Text style={styles.sumLabel}>Water Need</Text>
            <Text style={styles.sumVal}>Medium</Text>
          </View>
          <View style={styles.sumCell}>
            <Text style={styles.sumLabel}>Duration</Text>
            <Text style={styles.sumVal}>120-130 days</Text>
          </View>
        </View>

        {/* Calendar timeline tracker */}
        <View style={styles.calendarHeaderRow}>
          <Text style={styles.sectionHeader}>Crop Calendar</Text>
          <Text style={styles.dateLabel}>June - Oct 2024</Text>
        </View>

        <View style={styles.timelineCard}>
          <View style={styles.timelineLine} />
          
          <View style={styles.timelineItemRow}>
            <View style={styles.timelineCell}>
              <View style={[styles.timelineNode, { backgroundColor: THEME.primary }]} />
              <Text style={styles.timelineMonth}>Jun</Text>
              <Text style={styles.timelineStage}>Sowing</Text>
            </View>

            <View style={styles.timelineCell}>
              <View style={styles.timelineNode} />
              <Text style={styles.timelineMonth}>Jul</Text>
              <Text style={styles.timelineStage}>Growth</Text>
            </View>

            <View style={styles.timelineCell}>
              <View style={styles.timelineNode} />
              <Text style={styles.timelineMonth}>Aug</Text>
              <Text style={styles.timelineStage}>Flowering</Text>
            </View>

            <View style={styles.timelineCell}>
              <View style={styles.timelineNode} />
              <Text style={styles.timelineMonth}>Sep</Text>
              <Text style={styles.timelineStage}>Harvest</Text>
            </View>
          </View>
        </View>

        {/* View Full Plan Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={() => alert('Launching cultivation guidance manual...')}>
          <Text style={styles.actionBtnText}>View Full Plan</Text>
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
  infoBtn: {
    padding: 8
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.06)'
  },
  tabItem: {
    marginRight: 24,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: 'transparent'
  },
  tabItemActive: {
    borderColor: THEME.primary
  },
  tabItemText: {
    fontSize: 13,
    color: THEME.textMuted,
    fontWeight: '600'
  },
  tabItemTextActive: {
    color: THEME.primary,
    fontWeight: '700'
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100
  },
  mainCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    shadowColor: '#1b2e1b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20
  },
  mainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  cropTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.deepForest,
    marginTop: 6
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700'
  },
  scoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.primary
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.textMuted,
    marginTop: -2
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.textDark,
    marginBottom: 12
  },
  checklistCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    marginBottom: 20
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(44, 107, 67, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  checkText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textDark
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24
  },
  sumCell: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.glassBorder
  },
  sumLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: '700'
  },
  sumVal: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.textDark,
    marginTop: 4
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.textMuted
  },
  timelineCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    position: 'relative',
    marginBottom: 24
  },
  timelineLine: {
    position: 'absolute',
    left: '12%',
    right: '12%',
    top: '32%',
    height: 2,
    backgroundColor: 'rgba(44, 107, 67, 0.1)',
    zIndex: 1
  },
  timelineItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2
  },
  timelineCell: {
    alignItems: 'center',
    flex: 1
  },
  timelineNode: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#C5D6C9',
    borderWidth: 2,
    borderColor: 'white',
    marginBottom: 8
  },
  timelineMonth: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.textDark
  },
  timelineStage: {
    fontSize: 10,
    color: THEME.textMuted,
    marginTop: 2,
    fontWeight: '600'
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

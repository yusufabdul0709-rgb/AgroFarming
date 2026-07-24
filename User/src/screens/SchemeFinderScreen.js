import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { Landmark, ChevronDown, ChevronUp } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';

export default function SchemeFinderScreen({ onBack }) {
  const [expandedScheme, setExpandedScheme] = useState(null);

  const schemes = [
    { 
      id: 1, 
      name: 'PM-KISAN Yojana', 
      match: 'Match: 90%', 
      category: 'Income Support', 
      detail: 'Provides direct financial assistance of ₹6,000 per year in three equal installments directly into the bank accounts of small and marginal farmers.' 
    },
    { 
      id: 2, 
      name: 'Rythu Bandhu Scheme', 
      match: 'Match: 85%', 
      category: 'Financial Assistance', 
      detail: 'Supports farmer investment for two crops a year by giving ₹5,000 per acre per season to buy inputs like seeds, fertilizers, and pesticides.' 
    },
    { 
      id: 3, 
      name: 'Soil Health Card Scheme', 
      match: 'Match: 75%', 
      category: 'Soil Testing', 
      detail: 'Helps state governments to issue soil cards to all farmers, listing nutrient deficiencies and suggesting optimal chemical/organic fertilizer inputs.' 
    }
  ];

  const toggleExpand = (id) => {
    if (expandedScheme === id) {
      setExpandedScheme(null);
    } else {
      setExpandedScheme(id);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scheme Finder</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner with building graphic */}
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerText}>Find government schemes you are eligible for</Text>
          </View>
          <View style={styles.bannerRight}>
            <View style={styles.landmarkCircle}>
              <Landmark size={32} color="white" />
            </View>
          </View>
        </View>

        {/* Schemes Found match */}
        <View style={styles.matchSummaryRow}>
          <Text style={styles.matchCountTitle}>Your Eligibility Match</Text>
          <Text style={styles.matchCountSub}>3 Schemes Found</Text>
        </View>

        {/* Collapsible Accordion List */}
        <View style={styles.listContainer}>
          {schemes.map(scheme => {
            const isExpanded = expandedScheme === scheme.id;
            return (
              <View key={scheme.id} style={styles.schemeCard}>
                <TouchableOpacity 
                  style={styles.schemeCardHeader} 
                  onPress={() => toggleExpand(scheme.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.schemeLeftBlock}>
                    <Text style={styles.schemeName}>{scheme.name}</Text>
                    <View style={styles.schemeMetaRow}>
                      <Text style={styles.schemeMatchText}>{scheme.match}</Text>
                      <Text style={styles.schemeMetaDivider}>•</Text>
                      <Text style={styles.schemeCategory}>{scheme.category}</Text>
                    </View>
                  </View>
                  {isExpanded ? <ChevronUp size={18} color={THEME.textMuted} /> : <ChevronDown size={18} color={THEME.textMuted} />}
                </TouchableOpacity>
                
                {isExpanded && (
                  <View style={styles.schemeDetailBlock}>
                    <Text style={styles.schemeDetailText}>{scheme.detail}</Text>
                    <TouchableOpacity style={styles.applyBtn} onPress={() => alert('Redirecting to government portal...')}>
                      <Text style={styles.applyBtnText}>Apply Now</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={() => alert('Searching external state databases...')}>
          <Text style={styles.actionBtnText}>Check More Schemes</Text>
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
  banner: {
    backgroundColor: '#1E4620',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  bannerLeft: {
    flex: 1.2
  },
  bannerRight: {
    flex: 0.8,
    alignItems: 'flex-end'
  },
  bannerText: {
    fontSize: 15,
    fontWeight: '800',
    color: 'white',
    lineHeight: 22
  },
  landmarkCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  matchSummaryRow: {
    marginBottom: 14
  },
  matchCountTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.textDark
  },
  matchCountSub: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 2,
    fontWeight: '600'
  },
  listContainer: {
    gap: 12,
    marginBottom: 24
  },
  schemeCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    overflow: 'hidden'
  },
  schemeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  schemeLeftBlock: {
    flex: 1
  },
  schemeName: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.textDark
  },
  schemeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6
  },
  schemeMatchText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.primary
  },
  schemeMetaDivider: {
    fontSize: 11,
    color: THEME.textMuted
  },
  schemeCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.textMuted
  },
  schemeDetailBlock: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.05)',
    paddingTop: 16
  },
  schemeDetailText: {
    fontSize: 12,
    color: THEME.textMuted,
    lineHeight: 18,
    fontWeight: '500'
  },
  applyBtn: {
    backgroundColor: THEME.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14
  },
  applyBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700'
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

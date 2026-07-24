import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { TrendingUp, ChevronDown } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MarketPricesScreen({ onBack }) {
  const [activeCategory, setActiveCategory] = useState('Crops');
  const [activeInterval, setActiveInterval] = useState('1M');

  const nearbyMarkets = [
    { name: 'Warangal Mandi', price: '₹2,450 /qtl' },
    { name: 'Khammam Mandi', price: '₹2,380 /qtl' },
    { name: 'Nizamabad Mandi', price: '₹2,420 /qtl' }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Market Prices</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {['Crops', 'Vegetables', 'Fruits'].map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabItem, activeCategory === tab && styles.tabItemActive]}
            onPress={() => setActiveCategory(tab)}
          >
            <Text style={[styles.tabItemText, activeCategory === tab && styles.tabItemTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Dropdown selector */}
        <TouchableOpacity style={styles.dropdown} onPress={() => alert('Change crop dropdown coming soon!')}>
          <Text style={styles.dropdownText}>Paddy</Text>
          <ChevronDown size={18} color={THEME.textDark} />
        </TouchableOpacity>

        {/* Price Card */}
        <View style={styles.priceCard}>
          <View style={styles.priceCardHeader}>
            <Text style={styles.priceVal}>₹2,450 <Text style={styles.qtlText}>/qtl</Text></Text>
            <View style={styles.greenBadge}>
              <Text style={styles.greenBadgeText}>▲ +4.2%</Text>
            </View>
          </View>
          <Text style={styles.priceSub}>Today's Average Price</Text>

          {/* Sparkline Interval selector */}
          <View style={styles.intervalRow}>
            {['7D', '1M', '3M', '1Y'].map(item => (
              <TouchableOpacity 
                key={item} 
                style={[styles.intervalBtn, activeInterval === item && styles.intervalBtnActive]}
                onPress={() => setActiveInterval(item)}
              >
                <Text style={[styles.intervalText, activeInterval === item && styles.intervalTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Inline simulated chart display using stylized blocks */}
          <View style={styles.chartContainer}>
            <View style={styles.chartYAxis}>
              <Text style={styles.yLabel}>2.6k</Text>
              <Text style={styles.yLabel}>2.4k</Text>
              <Text style={styles.yLabel}>2.2k</Text>
              <Text style={styles.yLabel}>2.0k</Text>
            </View>
            
            <View style={styles.chartPlotArea}>
              {/* Drawing simple polyline-like blocks representing nodes */}
              <View style={[styles.chartBar, { height: '35%' }]} />
              <View style={[styles.chartBar, { height: '40%' }]} />
              <View style={[styles.chartBar, { height: '52%' }]} />
              <View style={[styles.chartBar, { height: '48%' }]} />
              <View style={[styles.chartBar, { height: '62%' }]} />
              <View style={[styles.chartBar, { height: '68%' }]} />
              <View style={[styles.chartBar, { height: '80%', backgroundColor: THEME.primary }]} />
            </View>
          </View>
          
          <View style={styles.chartXLabels}>
            <Text style={styles.xLabel}>20 Apr</Text>
            <Text style={styles.xLabel}>5 May</Text>
            <Text style={styles.xLabel}>20 May</Text>
          </View>
        </View>

        {/* Nearby Markets list */}
        <Text style={styles.sectionHeader}>Price in Nearby Markets</Text>
        <View style={styles.marketsCard}>
          {nearbyMarkets.map((market, i) => (
            <View key={i} style={styles.marketRow}>
              <Text style={styles.marketName}>{market.name}</Text>
              <Text style={styles.marketPrice}>{market.price}</Text>
            </View>
          ))}
        </View>

        {/* Action button */}
        <TouchableOpacity style={styles.actionBtn} onPress={() => alert('Launching AI Mandi forecasting models...')}>
          <Text style={styles.actionBtnText}>View Demand Forecast</Text>
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
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.1)',
    paddingHorizontal: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.textDark
  },
  priceCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    marginBottom: 20
  },
  priceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceVal: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.textDark
  },
  qtlText: {
    fontSize: 14,
    color: THEME.textMuted,
    fontWeight: '600'
  },
  greenBadge: {
    backgroundColor: '#EAF8EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  greenBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.primary
  },
  priceSub: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 4,
    fontWeight: '600'
  },
  intervalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    marginVertical: 16
  },
  intervalBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F5F7F3',
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.05)'
  },
  intervalBtnActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary
  },
  intervalText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.textMuted
  },
  intervalTextActive: {
    color: 'white'
  },
  chartContainer: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.1)',
    paddingBottom: 8
  },
  chartYAxis: {
    width: 36,
    justifyContent: 'space-between',
    height: '100%',
    paddingVertical: 4
  },
  yLabel: {
    fontSize: 10,
    color: THEME.textMuted,
    fontWeight: '700'
  },
  chartPlotArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingHorizontal: 10
  },
  chartBar: {
    width: '10%',
    backgroundColor: 'rgba(44, 107, 67, 0.3)',
    borderRadius: 4
  },
  chartXLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 36,
    marginTop: 6
  },
  xLabel: {
    fontSize: 10,
    color: THEME.textMuted,
    fontWeight: '700'
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.textDark,
    marginBottom: 12
  },
  marketsCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    marginBottom: 20
  },
  marketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.05)'
  },
  marketName: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textDark
  },
  marketPrice: {
    fontSize: 13,
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

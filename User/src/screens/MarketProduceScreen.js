import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Dimensions 
} from 'react-native';
import { MapPin, Search } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MarketProduceScreen({ onBack }) {
  const categories = [
    { emoji: '🌾', label: 'Paddy', color: '#EAF8EE' },
    { emoji: '🌾', label: 'Millets', color: '#FDF6EC' },
    { emoji: '🫘', label: 'Pulses', color: '#EBF6FD' },
    { emoji: '🌻', label: 'Oilseeds', color: '#F7F1EE' },
    { emoji: '🥦', label: 'Vegetables', color: '#F3F8F2' }
  ];

  const listings = [
    { 
      id: 1, 
      name: 'Paddy (Swarna)', 
      qty: '50 Quintals', 
      price: '₹2,450 /qtl', 
      loc: 'Warangal', 
      time: '2h ago',
      img: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=150&q=80'
    },
    { 
      id: 2, 
      name: 'Red Gram', 
      qty: '20 Quintals', 
      price: '₹6,200 /qtl', 
      loc: 'Mahabubabad', 
      time: '4h ago',
      img: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=150&q=80'
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Market</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Location pin indicator */}
        <View style={styles.locRow}>
          <MapPin size={14} color={THEME.primary} />
          <Text style={styles.locText}>Rajapur, Warangal</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Search size={18} color={THEME.textMuted} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search crops, buyers, products..." 
            placeholderTextColor={THEME.textMuted}
          />
        </View>

        {/* Lemon banner */}
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>Sell Direct. Get Best Price.</Text>
            <Text style={styles.bannerSub}>Connect directly with buyers</Text>
            <TouchableOpacity style={styles.listBtn} onPress={() => alert('Launching crop listing forms...')}>
              <Text style={styles.listBtnText}>List Your Produce</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerRight}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=250&q=80' }} 
              style={styles.bannerImg}
            />
          </View>
        </View>

        {/* Top Categories */}
        <Text style={styles.sectionHeader}>Top Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {categories.map((cat, i) => (
            <TouchableOpacity key={i} style={styles.catCell} onPress={() => alert(`Filtering by ${cat.label}...`)}>
              <View style={[styles.catIconBg, { backgroundColor: cat.color }]}>
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
              </View>
              <Text style={styles.catLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Listings */}
        <Text style={styles.sectionHeader}>Recent Listings</Text>
        <View style={styles.listingsContainer}>
          {listings.map(item => (
            <View key={item.id} style={styles.listingCard}>
              <Image source={{ uri: item.img }} style={styles.listingImg} />
              
              <View style={styles.listingInfo}>
                <View style={styles.listingNameRow}>
                  <Text style={styles.listingName}>{item.name}</Text>
                  <Text style={styles.listingPrice}>{item.price}</Text>
                </View>

                <Text style={styles.listingQty}>{item.qty}</Text>

                <View style={styles.listingFooter}>
                  <Text style={styles.listingLoc}>📍 {item.loc}</Text>
                  <Text style={styles.listingTime}>{item.time}</Text>
                </View>
              </View>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4
  },
  locText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.textDark
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.1)',
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 20
  },
  searchIcon: {
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: THEME.textDark,
    fontWeight: '500'
  },
  banner: {
    backgroundColor: '#FAF7EA',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(234, 160, 19, 0.12)',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  bannerLeft: {
    flex: 1.2
  },
  bannerRight: {
    flex: 0.8,
    alignItems: 'flex-end'
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: THEME.textDark
  },
  bannerSub: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 2,
    fontWeight: '600'
  },
  listBtn: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 14,
    alignSelf: 'flex-start'
  },
  listBtnText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700'
  },
  bannerImg: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.textDark,
    marginBottom: 12
  },
  catRow: {
    gap: 12,
    paddingBottom: 20
  },
  catCell: {
    alignItems: 'center'
  },
  catIconBg: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  catEmoji: {
    fontSize: 22
  },
  catLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.textDark
  },
  listingsContainer: {
    gap: 12
  },
  listingCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center'
  },
  listingImg: {
    width: 80,
    height: 80,
    borderRadius: 18,
    marginRight: 12
  },
  listingInfo: {
    flex: 1
  },
  listingNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  listingName: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.textDark
  },
  listingPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.primary
  },
  listingQty: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: '700',
    marginTop: 4
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  listingLoc: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.textMuted
  },
  listingTime: {
    fontSize: 10,
    color: THEME.textMuted,
    fontWeight: '600'
  }
});

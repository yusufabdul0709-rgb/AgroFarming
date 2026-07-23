import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ArrowLeft, Building2, CheckCircle2, ChevronRight, Coins } from 'lucide-react-native';

const SCHEMES = [
  {
    title: 'PM-KISAN Samman Nidhi',
    amount: '₹6,000 / year',
    desc: 'Direct income support of ₹6,000 in three 4-monthly installments of ₹2,000 each.',
    eligible: true
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    amount: 'Up to 90% Subsidy',
    desc: 'Crop insurance cover for natural calamities, pests, and yield loss.',
    eligible: true
  },
  {
    title: 'Kisan Credit Card (KCC) Scheme',
    amount: '₹3,000,000 Limit @ 4%',
    desc: 'Concessional credit for farming inputs and post-harvest expenses.',
    eligible: true
  },
  {
    title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    amount: '50-80% Subsidy on Tractors',
    desc: 'Financial assistance to purchase agricultural machinery and equipment.',
    eligible: false
  }
];

export default function SchemeFinderScreen({ onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#1b4332" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Government Schemes</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.banner}>
          <Building2 size={24} color="#e11d48" />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>AI Scheme Matching Engine</Text>
            <Text style={styles.bannerSub}>Matched 3 active schemes for your 15.4 acre land holding.</Text>
          </View>
        </View>

        {SCHEMES.map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.schemeCard} onPress={() => Alert.alert('Scheme Details', item.desc)}>
            <View style={styles.schemeTop}>
              <Text style={styles.schemeTitle}>{item.title}</Text>
              {item.eligible && <CheckCircle2 size={16} color="#16a34a" />}
            </View>
            <Text style={styles.amountTxt}>{item.amount}</Text>
            <Text style={styles.descTxt}>{item.desc}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.eligibilityTxt}>Status: Eligible</Text>
              <ChevronRight size={16} color="#e11d48" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8faf8' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 14,
    backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e2e8f0'
  },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1b4332' },
  scrollContent: { padding: 16, paddingBottom: 60 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#ffe4e6', padding: 16, borderRadius: 18, marginBottom: 16 },
  bannerTitle: { fontSize: 16, fontWeight: '800', color: '#9f1239' },
  bannerSub: { fontSize: 11, color: '#be123c', marginTop: 2 },
  schemeCard: { backgroundColor: 'white', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  schemeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  schemeTitle: { fontSize: 15, fontWeight: '700', color: '#1b4332', flex: 1, paddingRight: 8 },
  amountTxt: { fontSize: 14, fontWeight: '800', color: '#e11d48', marginTop: 4 },
  descTxt: { fontSize: 12, color: '#64748b', marginTop: 6, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  eligibilityTxt: { fontSize: 11, fontWeight: '700', color: '#16a34a' }
});

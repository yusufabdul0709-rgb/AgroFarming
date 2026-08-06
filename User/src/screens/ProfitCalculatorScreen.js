import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ArrowLeft, Calculator, Coins, TrendingUp } from 'lucide-react-native';
import { useProfile } from '../context/ProfileContext';

export default function ProfitCalculatorScreen({ onBack }) {
  const { farmerProfile } = useProfile();
  
  const [acres, setAcres] = useState(farmerProfile?.landArea || '15.4');
  const [expectedPrice, setExpectedPrice] = useState('2450');
  const [yieldMultiplier, setYieldMultiplier] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.42:5000/api';
        
        // Fetch market price
        fetch(`${API_URL}/market/prices`)
          .then(res => res.json())
          .then(data => {
            if (data.status === 'success' && data.data && data.data.length > 0) {
              const paddyData = data.data.find(item => item.commodity?.toLowerCase() === 'paddy' || item.commodity?.toLowerCase() === 'wheat');
              if (paddyData && paddyData.price) {
                setExpectedPrice(paddyData.price.toString());
              }
            }
          }).catch(err => console.warn('Market price fetch failed:', err));

        // Fetch yield prediction
        fetch(`${API_URL}/ai/yield`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ crop: 'Paddy', land_acres: parseFloat(acres) || 1, soil_type: 'Alluvial', water_score: 80 })
        })
          .then(res => res.json())
          .then(data => {
            if (data.status === 'success' && data.data?.yield_prediction) {
              const parsedYield = parseFloat(data.data.yield_prediction.replace(/[^0-9.]/g, ''));
              if (!isNaN(parsedYield) && parsedYield > 0) {
                setYieldMultiplier(parsedYield);
              }
            }
          }).catch(err => console.warn('Yield prediction fetch failed:', err));

      } catch (err) {
        console.warn('Profit calculator data error:', err);
      }
    };
    
    fetchData();
  }, []);

  const acresNum = parseFloat(acres) || 1;
  const priceNum = parseFloat(expectedPrice) || 2000;

  const totalYieldQtl = (acresNum * yieldMultiplier).toFixed(0);
  const totalRevenue = (totalYieldQtl * priceNum);
  const inputCosts = (acresNum * 12000);
  const netProfit = (totalRevenue - inputCosts);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#1b4332" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profit Calculator</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.calcCard}>
          <Text style={styles.cardTitle}>Paddy Financial Forecast</Text>

          <View style={styles.inputGrp}>
            <Text style={styles.label}>Land Area (Acres):</Text>
            <TextInput style={styles.input} value={acres} onChangeText={setAcres} keyboardType="numeric" />
          </View>

          <View style={styles.inputGrp}>
            <Text style={styles.label}>Expected Mandi Price (₹/qtl):</Text>
            <TextInput style={styles.input} value={expectedPrice} onChangeText={setExpectedPrice} keyboardType="numeric" />
          </View>
        </View>

        <View style={styles.resultCard}>
          <View style={styles.resRow}>
            <Text style={styles.resLabel}>Est. Total Yield:</Text>
            <Text style={styles.resVal}>{totalYieldQtl} Quintals</Text>
          </View>
          <View style={styles.resRow}>
            <Text style={styles.resLabel}>Gross Revenue:</Text>
            <Text style={styles.resVal}>₹{totalRevenue.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.resRow}>
            <Text style={styles.resLabel}>Input & Labor Cost:</Text>
            <Text style={[styles.resVal, { color: '#dc2626' }]}>- ₹{inputCosts.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.resRow}>
            <Text style={styles.profitLabel}>Predicted Net Profit:</Text>
            <Text style={styles.profitVal}>₹{netProfit.toLocaleString('en-IN')}</Text>
          </View>
        </View>
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
  calcCard: { backgroundColor: 'white', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#1b4332', marginBottom: 14 },
  inputGrp: { marginBottom: 12 },
  label: { fontSize: 12, color: '#64748b', fontWeight: '600', marginBottom: 4 },
  input: { backgroundColor: '#f8faf8', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 10, fontSize: 15, fontWeight: '700', color: '#1b4332' },
  resultCard: { backgroundColor: '#dcfce7', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#86efac' },
  resRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  resLabel: { fontSize: 13, color: '#166534', fontWeight: '600' },
  resVal: { fontSize: 14, fontWeight: '800', color: '#14532d' },
  divider: { height: 1, backgroundColor: '#86efac', marginVertical: 10 },
  profitLabel: { fontSize: 16, fontWeight: '800', color: '#14532d' },
  profitVal: { fontSize: 20, fontWeight: '800', color: '#16a34a' }
});

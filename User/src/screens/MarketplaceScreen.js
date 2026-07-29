import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft, ShoppingCart, Plus, Tag } from 'lucide-react-native';
import { API_BASE_URL } from '../config/api';

export default function MarketplaceScreen({ onBack }) {
  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduce = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/market/produce`);
        const result = await response.json();
        if (result.status === 'success') {
          setProduce(result.data.listings || []);
        } else {
          throw new Error('API failed');
        }
      } catch (e) {
        setProduce([
          { title: 'Organic Swarna Paddy', qty: '45 Quintals', price: '₹2,450 / qtl', seller: 'Ramesh Kumar', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200&auto=format&fit=crop' },
          { title: 'High Grade Wheat', qty: '20 Quintals', price: '₹2,325 / qtl', seller: 'Suresh Patel', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=200&auto=format&fit=crop' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProduce();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <ArrowLeft size={20} color="#1b4332" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Farmer Produce Marketplace</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => Alert.alert('Sell Produce', 'List your harvest for sale to buyers directly!')}>
          <Plus size={18} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 20 }} />
        ) : (
          produce.map((item, idx) => (
          <View key={idx} style={styles.itemCard}>
            <Image source={{ uri: item.img }} style={styles.itemImg} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSeller}>Seller: {item.seller}</Text>
              <Text style={styles.itemQty}>Quantity: {item.qty}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
            <TouchableOpacity style={styles.buyBtn} onPress={() => Alert.alert('Contact Seller', `Calling ${item.seller}`)}>
              <Text style={styles.buyTxt}>Buy Direct</Text>
            </TouchableOpacity>
          </View>
        )))}
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
  addBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#2e7d32', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1b4332' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  itemCard: { flexDirection: 'row', gap: 12, backgroundColor: 'white', borderRadius: 18, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  itemImg: { width: 75, height: 75, borderRadius: 14 },
  itemTitle: { fontSize: 15, fontWeight: '700', color: '#1b4332' },
  itemSeller: { fontSize: 11, color: '#64748b', marginTop: 2 },
  itemQty: { fontSize: 11, color: '#64748b' },
  itemPrice: { fontSize: 15, fontWeight: '800', color: '#16a34a', marginTop: 4 },
  buyBtn: { backgroundColor: '#2e7d32', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  buyTxt: { color: 'white', fontSize: 11, fontWeight: '700' }
});

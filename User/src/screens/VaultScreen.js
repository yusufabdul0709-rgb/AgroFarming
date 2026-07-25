import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ShieldCheck, FileText, UploadCloud, ChevronRight, Landmark, CreditCard, Leaf, Map, Search, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';

export default function VaultScreen({ onBack, onNavigate }) {
  const THEME = useTheme();
  const { farmerProfile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Mock fetching documents on load
    setTimeout(() => {
      setDocuments([
        { id: 1, type: 'Aadhaar Card', category: 'Personal', status: 'Verified' },
        { id: 2, type: 'Bank Passbook', category: 'Banking', status: 'Verified' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { name: 'Personal', icon: <CreditCard size={24} color={THEME.primary} />, count: 1 },
    { name: 'Land', icon: <Map size={24} color="#F59E0B" />, count: 0 },
    { name: 'Banking', icon: <Landmark size={24} color="#3B82F6" />, count: 1 },
    { name: 'Agriculture', icon: <Leaf size={24} color="#10B981" />, count: 0 },
  ];

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: THEME.bg, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={THEME.primary} />
        <Text style={{ marginTop: 10, color: THEME.textMuted }}>Unlocking Secure Vault...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: THEME.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: THEME.primary }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kissan Secure Vault</Text>
        <ShieldCheck size={28} color="white" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerTitle}>End-to-End Encrypted</Text>
          <Text style={styles.bannerSub}>Your documents are encrypted using AES-256 and stored securely. Only you and the AI Scheme Matcher can read them.</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: THEME.primary }]}
            onPress={() => onNavigate('vault-upload')}
          >
            <UploadCloud size={20} color="white" />
            <Text style={styles.actionBtnText}>Upload Document</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#3B82F6' }]}
            onPress={() => onNavigate('vault-scheme-match')}
          >
            <Search size={20} color="white" />
            <Text style={styles.actionBtnText}>Find Schemes</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: THEME.text }]}>Categories</Text>
        
        {/* Categories Grid */}
        <View style={styles.grid}>
          {categories.map((cat, idx) => (
            <TouchableOpacity key={idx} style={[styles.card, { borderColor: THEME.glassBorder }]}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>{cat.icon}</View>
                <Text style={styles.countBadge}>{cat.count} Docs</Text>
              </View>
              <Text style={[styles.cardTitle, { color: THEME.text }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: THEME.text, marginTop: 24 }]}>Recent Documents</Text>

        {documents.map(doc => (
          <View key={doc.id} style={[styles.docList, { borderColor: THEME.glassBorder }]}>
            <View style={styles.docLeft}>
              <FileText size={20} color={THEME.textMuted} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.docTitle, { color: THEME.text }]}>{doc.type}</Text>
                <Text style={[styles.docSub, { color: THEME.textMuted }]}>{doc.category}</Text>
              </View>
            </View>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{doc.status}</Text>
              <ChevronRight size={16} color={THEME.textMuted} />
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  bannerContainer: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3730A3',
    marginBottom: 6,
  },
  bannerSub: {
    fontSize: 13,
    color: '#4F46E5',
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  docList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  docLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  docSub: {
    fontSize: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  }
});

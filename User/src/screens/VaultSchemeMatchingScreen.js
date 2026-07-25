import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle, FileText, ChevronRight, CheckSquare } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export default function VaultSchemeMatchingScreen({ onBack }) {
  const THEME = useTheme();
  const [loading, setLoading] = useState(true);
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);

  useEffect(() => {
    // Mocking API call to /api/schemes/vault-match
    setTimeout(() => {
      setSchemes([
        {
          _id: 's1',
          name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
          benefits: '₹6,000 cash subsidy per annum',
          readinessScore: 66,
          presentDocs: ['Aadhaar Card', 'Bank Passbook'],
          missingDocs: [
            {
              name: 'Land Record',
              howToObtain: 'Visit the MRO / Tehsil Office with your Survey Number.',
              expectedProcessingTimeDays: 14,
              priority: 'High'
            }
          ],
          smartTimeline: {
            deadlineDaysRemaining: 30,
            recommendation: 'You still have enough time. Collect missing documents first. Expected completion: within 14 days.'
          },
          application_link: 'https://pmkisan.gov.in/'
        },
        {
          _id: 's2',
          name: 'Crop Insurance Scheme',
          benefits: 'Up to 90% premium subsidy',
          readinessScore: 100,
          presentDocs: ['Aadhaar Card', 'Bank Passbook'],
          missingDocs: [],
          smartTimeline: {
            deadlineDaysRemaining: 15,
            recommendation: 'Everything is Ready. Click Apply.'
          },
          application_link: 'https://pmfby.gov.in/'
        }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const handleApply = (scheme) => {
    // Application Guide & Auto-Application Flow
    setSelectedScheme(scheme);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: THEME.bg, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={THEME.primary} />
        <Text style={{ marginTop: 10, color: THEME.textMuted, textAlign: 'center' }}>AI is scanning your Vault...</Text>
      </View>
    );
  }

  // Application Guide Overlay
  if (selectedScheme) {
    return (
      <View style={[styles.container, { backgroundColor: THEME.bg }]}>
        <View style={[styles.header, { backgroundColor: THEME.primary }]}>
          <TouchableOpacity onPress={() => setSelectedScheme(null)} style={styles.backButton}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Application Guide</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.guideContent}>
          <Text style={[styles.guideTitle, { color: THEME.text }]}>{selectedScheme.name}</Text>
          
          <View style={styles.guideBox}>
            <Text style={styles.guideTextLocal}>
              మీరు ఇప్పుడు {selectedScheme.name} పోర్టల్‌కు వెళుతున్నారు. దయచేసి ఈ కింది పత్రాలను సిద్ధంగా ఉంచుకోండి.
            </Text>
            <Text style={styles.guideTextEn}>(You are now proceeding to the portal. Please keep these ready:)</Text>
          </View>

          <View style={styles.checklist}>
            {selectedScheme.presentDocs.map((doc, i) => (
              <View key={i} style={styles.checkItem}>
                <CheckSquare size={20} color="#10B981" />
                <Text style={styles.checkItemText}>{doc}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.portalBtn, { backgroundColor: THEME.primary }]}
            onPress={() => Linking.openURL(selectedScheme.application_link)}
          >
            <Text style={styles.portalBtnText}>Open Portal & Apply</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: THEME.bg }]}>
      <View style={[styles.header, { backgroundColor: THEME.primary }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scheme Matching AI</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.scoreText}>Overall Farmer Readiness</Text>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreValue}>83%</Text>
          <Text style={styles.scoreDesc}>You have 2 schemes ready to apply today.</Text>
        </View>

        {schemes.map(scheme => (
          <View key={scheme._id} style={[styles.schemeCard, { borderColor: THEME.glassBorder }]}>
            <Text style={[styles.schemeName, { color: THEME.primary }]}>{scheme.name}</Text>
            
            {/* Readiness Bar */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${scheme.readinessScore}%`, backgroundColor: scheme.readinessScore === 100 ? '#10B981' : '#F59E0B' }]} />
            </View>
            <Text style={styles.progressText}>Document Readiness: {scheme.readinessScore}%</Text>

            {scheme.missingDocs.length > 0 ? (
              <View style={styles.missingBox}>
                <View style={styles.missingHeader}>
                  <AlertCircle size={20} color="#EF4444" />
                  <Text style={styles.missingTitle}>Missing Document</Text>
                </View>
                {scheme.missingDocs.map((doc, idx) => (
                  <View key={idx} style={{ marginTop: 8 }}>
                    <Text style={styles.missingDocName}>{doc.name}</Text>
                    <Text style={styles.missingDocHow}>How to Obtain: {doc.howToObtain}</Text>
                  </View>
                ))}
                
                <View style={styles.timelineBox}>
                  <Clock size={16} color="#B45309" />
                  <Text style={styles.timelineText}>{scheme.smartTimeline.recommendation}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.readyBox}>
                <CheckCircle size={24} color="#10B981" />
                <Text style={styles.readyText}>Everything is Ready ✅</Text>
              </View>
            )}

            <TouchableOpacity 
              style={[styles.applyBtn, { backgroundColor: scheme.readinessScore === 100 ? THEME.primary : '#9CA3AF' }]}
              disabled={scheme.readinessScore !== 100}
              onPress={() => handleApply(scheme)}
            >
              <Text style={styles.applyBtnText}>Apply Now</Text>
            </TouchableOpacity>
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
  backButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: 'white' },
  content: { padding: 16, paddingBottom: 100 },
  scoreText: { fontSize: 16, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
  scoreCard: {
    backgroundColor: '#F0FDF4',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 24,
    alignItems: 'center'
  },
  scoreValue: { fontSize: 36, fontWeight: '800', color: '#16A34A' },
  scoreDesc: { fontSize: 14, color: '#15803D', marginTop: 4 },
  schemeCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  schemeName: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  progressContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8
  },
  progressBar: { height: '100%' },
  progressText: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginBottom: 16 },
  missingBox: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 16
  },
  missingHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  missingTitle: { fontSize: 15, fontWeight: '700', color: '#B91C1C' },
  missingDocName: { fontSize: 14, fontWeight: '700', color: '#991B1B' },
  missingDocHow: { fontSize: 13, color: '#7F1D1D', marginTop: 4, lineHeight: 18 },
  timelineBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8
  },
  timelineText: { flex: 1, fontSize: 12, color: '#92400E', fontWeight: '500', lineHeight: 18 },
  readyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16
  },
  readyText: { fontSize: 16, fontWeight: '700', color: '#15803D' },
  applyBtn: { padding: 16, borderRadius: 12, alignItems: 'center' },
  applyBtnText: { color: 'white', fontWeight: '700', fontSize: 16 },
  
  // Guide styles
  guideContent: { padding: 20 },
  guideTitle: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  guideBox: {
    backgroundColor: '#E0E7FF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C7D2FE'
  },
  guideTextLocal: { fontSize: 18, color: '#3730A3', fontWeight: '600', lineHeight: 28, marginBottom: 12 },
  guideTextEn: { fontSize: 14, color: '#4338CA', fontStyle: 'italic' },
  checklist: { marginBottom: 30 },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    gap: 12
  },
  checkItemText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  portalBtn: { padding: 18, borderRadius: 12, alignItems: 'center' },
  portalBtnText: { color: 'white', fontWeight: '700', fontSize: 18 }
});

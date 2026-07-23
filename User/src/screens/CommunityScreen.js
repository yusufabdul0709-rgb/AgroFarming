import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Users, MessageSquare, ThumbsUp } from 'lucide-react-native';

const POSTS = [
  { author: 'Venkat Rao', location: 'Warangal, TS', time: '2 hrs ago', text: 'Best organic fertilizer for Paddy in vegetative stage? Has anyone tried Trichoderma viride?', likes: 14, comments: 6 },
  { author: 'Suresh Patel', location: 'Gujarat', time: '5 hrs ago', text: 'Cotton mandi prices in Rajkot hit ₹7,100/qtl today! Great returns this season.', likes: 32, comments: 12 },
];

export default function CommunityScreen({ onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#1b4332" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Farmers Community</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topCard}>
          <Users size={22} color="#059669" />
          <Text style={styles.topTitle}>12,400+ Verified Farmers Connected</Text>
        </View>

        {POSTS.map((post, idx) => (
          <View key={idx} style={styles.postCard}>
            <Text style={styles.author}>{post.author} • <Text style={styles.loc}>{post.location}</Text></Text>
            <Text style={styles.body}>{post.text}</Text>
            <View style={styles.postFooter}>
              <View style={styles.actionBtn}>
                <ThumbsUp size={14} color="#059669" />
                <Text style={styles.actionTxt}>{post.likes} Likes</Text>
              </View>
              <View style={styles.actionBtn}>
                <MessageSquare size={14} color="#059669" />
                <Text style={styles.actionTxt}>{post.comments} Answers</Text>
              </View>
            </View>
          </View>
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
  topCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#d1fae5', padding: 16, borderRadius: 18, marginBottom: 16 },
  topTitle: { fontSize: 14, fontWeight: '800', color: '#065f46' },
  postCard: { backgroundColor: 'white', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  author: { fontSize: 13, fontWeight: '700', color: '#1b4332' },
  loc: { fontSize: 11, color: '#64748b', fontWeight: '500' },
  body: { fontSize: 13, color: '#334155', marginTop: 8, lineHeight: 20 },
  postFooter: { flexDirection: 'row', gap: 16, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionTxt: { fontSize: 12, color: '#059669', fontWeight: '600' }
});

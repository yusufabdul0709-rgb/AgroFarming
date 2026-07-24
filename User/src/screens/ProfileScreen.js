import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { ChevronRight, ShieldCheck } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';

export default function ProfileScreen({ onBack, onLogout }) {
  const { farmerProfile } = useProfile();

  const menuItems = [
    { label: 'My Farm Details', sub: '' },
    { label: 'My Crops', sub: '' },
    { label: 'Transaction History', sub: '' },
    { label: 'Saved Reports', sub: '' },
    { label: 'Notification Settings', sub: '' },
    { label: 'Language', sub: 'English' },
    { label: 'Help & Support', sub: '' }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80' }} 
            style={styles.avatar} 
          />
          <Text style={styles.name}>{farmerProfile.name || 'Ramesh Kumar'}</Text>
          <Text style={styles.phone}>{farmerProfile.phone || '+91 98765 43210'}</Text>
          
          <View style={styles.badge}>
            <ShieldCheck size={14} color={THEME.primary} />
            <Text style={styles.badgeText}>Verified Farmer</Text>
          </View>
        </View>

        {/* Menu list options */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, i) => (
            <TouchableOpacity 
              key={i} 
              style={styles.menuRow}
              onPress={() => alert(`Launching ${item.label} config...`)}
            >
              <Text style={styles.menuLabel}>{item.label}</Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {item.sub ? (
                  <Text style={styles.menuSubText}>{item.sub}</Text>
                ) : null}
                <ChevronRight size={16} color={THEME.textMuted} />
              </View>
            </TouchableOpacity>
          ))}

          {/* Logout */}
          <TouchableOpacity 
            style={[styles.menuRow, { borderBottomWidth: 0 }]}
            onPress={onLogout}
          >
            <Text style={[styles.menuLabel, { color: '#F44336' }]}>Logout</Text>
            <ChevronRight size={16} color="#F44336" />
          </TouchableOpacity>
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
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    alignItems: 'center',
    shadowColor: '#1b2e1b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: THEME.primary,
    marginBottom: 12
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.textDark
  },
  phone: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 4,
    fontWeight: '600'
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(44, 107, 67, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    marginTop: 12
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.primary
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.glassBorder
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.05)',
    paddingHorizontal: 8
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textDark
  },
  menuSubText: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: '600'
  }
});

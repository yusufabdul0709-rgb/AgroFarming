import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  TextInput,
  Modal,
  Image,
  RefreshControl,
  Dimensions,
  Alert
} from 'react-native';
import { 
  ShieldCheck, 
  FileText, 
  UploadCloud, 
  ChevronRight, 
  Landmark, 
  CreditCard, 
  Leaf, 
  Map, 
  Search, 
  ArrowLeft,
  X,
  Lock,
  Unlock,
  AlertTriangle,
  Trash2,
  Edit3,
  Save,
  ChevronDown
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const DOC_NAMES = [
  'Aadhaar Card',
  'Land Registry Copy',
  'Ration Card',
  'Registration Certificate',
  'Income Certificate',
  'Caste Certificate',
  'Bank Passbook',
  'Sowing Certificate'
];

const DOC_FORMATS = ['Image', 'PDF', 'Word', 'Excel'];
const DOC_CATEGORIES = ['Personal', 'Land', 'Banking', 'Agriculture'];

export default function VaultScreen({ onBack, onNavigate }) {
  const THEME = useTheme();
  
  // Data states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [documents, setDocuments] = useState([]);
  
  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);

  // Decryption & Modal states
  const [decryptingDocId, setDecryptingDocId] = useState(null);
  const [decryptedImage, setDecryptedImage] = useState(null);
  const [decryptedMetadata, setDecryptedMetadata] = useState(null);

  // Editing states in Modal
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editFormat, setEditFormat] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // Dropdown open states in Modal
  const [showEditNameList, setShowEditNameList] = useState(false);
  const [showEditFormatList, setShowEditFormatList] = useState(false);
  const [showEditCategoryList, setShowEditCategoryList] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Vault Auth states
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasPin, setHasPin] = useState(null);
  const [pinMode, setPinMode] = useState('checking'); // checking, setup, confirm, enter, otp
  const [tempPin, setTempPin] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const checkPin = async () => {
    try {
      const pin = await AsyncStorage.getItem('@vault_pin');
      if (pin) {
        setHasPin(true);
        setPinMode('enter');
      } else {
        setHasPin(false);
        setPinMode('setup');
      }
    } catch (e) {
      setHasPin(false);
      setPinMode('setup');
    }
  };

  const handlePinPress = (num) => {
    if (pinMode === 'otp') {
      if (otpCode.length < 4) setOtpCode(prev => prev + num);
      return;
    }
    if (enteredPin.length < 4) {
      const newPin = enteredPin + num;
      setEnteredPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => processPinSubmit(newPin), 150);
      }
    }
  };

  const handleDelete = () => {
    if (pinMode === 'otp') setOtpCode(prev => prev.slice(0, -1));
    else setEnteredPin(prev => prev.slice(0, -1));
  };

  const processPinSubmit = async (pin) => {
    if (pinMode === 'setup') {
      setTempPin(pin);
      setEnteredPin('');
      setPinMode('confirm');
    } else if (pinMode === 'confirm') {
      if (pin === tempPin) {
        await AsyncStorage.setItem('@vault_pin', pin);
        setHasPin(true);
        setIsUnlocked(true);
        Alert.alert('Success', 'Vault PIN set successfully!');
      } else {
        Alert.alert('Error', 'PINs do not match. Try again.');
        setEnteredPin('');
        setPinMode('setup');
      }
    } else if (pinMode === 'enter') {
      const stored = await AsyncStorage.getItem('@vault_pin');
      if (pin === stored) {
        setIsUnlocked(true);
        setEnteredPin('');
      } else {
        Alert.alert('Error', 'Incorrect PIN');
        setEnteredPin('');
      }
    }
  };

  const handleOtpSubmit = () => {
    if (otpCode === '1234') {
      Alert.alert('Success', 'OTP verified. Please set a new PIN.');
      setOtpCode('');
      setEnteredPin('');
      setPinMode('setup');
    } else {
      Alert.alert('Error', 'Invalid OTP. Use 1234 for testing.');
      setOtpCode('');
    }
  };

  const resetPinFlow = () => {
    Alert.alert('Reset PIN', 'An OTP has been sent to your registered phone number.');
    setPinMode('otp');
    setOtpCode('');
  };

  const triggerChangePin = () => {
    setPinMode('setup');
    setIsUnlocked(false);
    setEnteredPin('');
  };

  const fetchDocuments = async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) setLoading(true);
    try {
      const token = await AsyncStorage.getItem('@farmer_token');
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.42:5000/api';
      
      const res = await fetch(`${API_URL}/vault/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error('[Fetch Vault Error]', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    checkPin();
    fetchDocuments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDocuments(false);
  };

  const handleDecryptAndPreview = async (doc) => {
    if (decryptingDocId) return; // Prevent double taps
    setDecryptingDocId(doc._id);
    try {
      const token = await AsyncStorage.getItem('@farmer_token');
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.42:5000/api';
      
      const res = await fetch(`${API_URL}/vault/document/${doc._id}/decrypt`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setDecryptedImage(data.fileDataUrl);
        setDecryptedMetadata(doc);
        
        // Populate edit inputs
        setEditName(doc.documentType || 'Aadhaar Card');
        setEditFormat(doc.format || 'Image');
        setEditCategory(doc.category || 'Personal');
        setIsEditing(false);
      } else {
        alert('Failed to decrypt document: ' + data.message);
      }
    } catch (e) {
      console.error(e);
      alert('Network error. Failed to decrypt file.');
    } finally {
      setDecryptingDocId(null);
    }
  };

  const handleUpdateDocument = async () => {
    setUpdating(true);
    try {
      const token = await AsyncStorage.getItem('@farmer_token');
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.42:5000/api';
      
      const res = await fetch(`${API_URL}/vault/document/${decryptedMetadata._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentType: editName,
          category: editCategory,
          format: editFormat
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        // Update local state details
        setDecryptedMetadata(prev => ({
          ...prev,
          documentType: editName,
          category: editCategory,
          format: editFormat
        }));
        setIsEditing(false);
        fetchDocuments(false);
        Alert.alert('Success', 'Document details updated successfully.');
      } else {
        alert('Failed to update details: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Failed to save updates.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteDocument = () => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to permanently delete this document from your secure vault?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('@farmer_token');
              const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.42:5000/api';
              
              const res = await fetch(`${API_URL}/vault/document/${decryptedMetadata._id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              const data = await res.json();
              if (data.status === 'success') {
                setDecryptedImage(null);
                setDecryptedMetadata(null);
                fetchDocuments(false);
                Alert.alert('Deleted', 'Document has been removed from the vault.');
              } else {
                alert('Failed to delete document: ' + data.message);
              }
            } catch (err) {
              console.error(err);
              alert('Network error. Failed to delete document.');
            }
          }
        }
      ]
    );
  };

  const getCategoryCount = (catName) => {
    return documents.filter(doc => (doc.category || '').toLowerCase() === catName.toLowerCase()).length;
  };

  const handleCategoryPress = (categoryName) => {
    if (selectedCategoryFilter === categoryName) {
      setSelectedCategoryFilter(null);
    } else {
      setSelectedCategoryFilter(categoryName);
    }
  };

  // Filter logic
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      (doc.documentType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.documentNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.extractedMetadata?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategoryFilter 
      ? (doc.category || '').toLowerCase() === selectedCategoryFilter.toLowerCase()
      : true;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    { name: 'Personal', icon: <CreditCard size={20} color={selectedCategoryFilter === 'Personal' ? 'white' : THEME.primary} />, count: getCategoryCount('Personal') },
    { name: 'Land', icon: <Map size={20} color={selectedCategoryFilter === 'Land' ? 'white' : '#F59E0B'} />, count: getCategoryCount('Land') },
    { name: 'Banking', icon: <Landmark size={20} color={selectedCategoryFilter === 'Banking' ? 'white' : '#3B82F6'} />, count: getCategoryCount('Banking') },
    { name: 'Agriculture', icon: <Leaf size={20} color={selectedCategoryFilter === 'Agriculture' ? 'white' : '#10B981'} />, count: getCategoryCount('Agriculture') },
  ];

  if (pinMode === 'checking' || (loading && isUnlocked)) {
    return (
      <View style={[styles.container, { backgroundColor: THEME.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={THEME.primary} />
        <Text style={{ marginTop: 10, color: THEME.textMuted, fontWeight: '700' }}>
          {pinMode === 'checking' ? 'Initializing Vault...' : 'Unlocking Secure Vault...'}
        </Text>
      </View>
    );
  }

  const renderPinIndicator = (length) => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <View 
          key={i} 
          style={[
            styles.pinDot, 
            length > i && styles.pinDotFilled
          ]} 
        />
      );
    }
    return <View style={styles.pinIndicatorContainer}>{dots}</View>;
  };

  const renderPinPad = () => {
    const rows = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      ['blank', 0, 'delete']
    ];
    return (
      <View style={styles.pinPad}>
        {rows.map((row, rIdx) => (
          <View key={rIdx} style={styles.pinRow}>
            {row.map((btn, bIdx) => {
              if (btn === 'blank') return <View key={bIdx} style={styles.pinBtn} />;
              if (btn === 'delete') {
                return (
                  <TouchableOpacity key={bIdx} style={styles.pinBtn} onPress={handleDelete}>
                    <X size={28} color="#D1D5DB" />
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity key={bIdx} style={styles.pinBtn} onPress={() => handlePinPress(btn)}>
                  <Text style={styles.pinBtnText}>{btn}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  if (!isUnlocked) {
    return (
      <View style={styles.lockContainer}>
        <View style={styles.lockHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.lockContent}>
          <View style={styles.lockIconBox}>
            <ShieldCheck size={50} color="#10B981" />
          </View>

          {pinMode === 'setup' && (
            <>
              <Text style={styles.lockTitle}>Setup Vault PIN</Text>
              <Text style={styles.lockSub}>Create a 4-digit secure PIN</Text>
              {renderPinIndicator(enteredPin.length)}
              {renderPinPad()}
            </>
          )}

          {pinMode === 'confirm' && (
            <>
              <Text style={styles.lockTitle}>Confirm PIN</Text>
              <Text style={styles.lockSub}>Re-enter your 4-digit PIN</Text>
              {renderPinIndicator(enteredPin.length)}
              {renderPinPad()}
            </>
          )}

          {pinMode === 'enter' && (
            <>
              <Text style={styles.lockTitle}>Unlock Vault</Text>
              <Text style={styles.lockSub}>Enter your 4-digit PIN</Text>
              {renderPinIndicator(enteredPin.length)}
              {renderPinPad()}
              <TouchableOpacity style={styles.forgotBtn} onPress={resetPinFlow}>
                <Text style={styles.forgotBtnText}>Forgot PIN?</Text>
              </TouchableOpacity>
            </>
          )}

          {pinMode === 'otp' && (
            <>
              <Text style={styles.lockTitle}>Enter OTP</Text>
              <Text style={styles.lockSub}>OTP sent to your phone (Use 1234)</Text>
              {renderPinIndicator(otpCode.length)}
              {renderPinPad()}
              <TouchableOpacity style={styles.submitOtpBtn} onPress={handleOtpSubmit}>
                <Text style={styles.submitOtpText}>Verify OTP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.forgotBtn} onPress={() => {setPinMode('enter'); setOtpCode('');}}>
                <Text style={styles.forgotBtnText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
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
        <TouchableOpacity onPress={triggerChangePin} style={{ padding: 4 }}>
          <ShieldCheck size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[THEME.primary]} />
        }
      >
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerTitle}>End-to-End Encrypted Storage</Text>
          <Text style={styles.bannerSub}>
            Documents are encrypted using AES-256 standard and stored. Only you and the AI Scheme Matcher can read them.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: THEME.primary }]}
            onPress={() => onNavigate('vault-upload')}
          >
            <UploadCloud size={20} color="white" />
            <Text style={styles.actionBtnText}>Upload Doc</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#3B82F6' }]}
            onPress={() => onNavigate('vault-scheme-match')}
          >
            <Search size={20} color="white" />
            <Text style={styles.actionBtnText}>Find Schemes</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <Search size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search documents by name or number..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: THEME.text }]}>Vault Categories</Text>
          {selectedCategoryFilter && (
            <TouchableOpacity onPress={() => setSelectedCategoryFilter(null)}>
              <Text style={[styles.clearFilterText, { color: THEME.primary }]}>Show All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Categories Grid */}
        <View style={styles.grid}>
          {categories.map((cat, idx) => {
            const isSelected = selectedCategoryFilter === cat.name;
            return (
              <TouchableOpacity 
                key={idx} 
                style={[
                  styles.card, 
                  { borderColor: isSelected ? THEME.primary : THEME.glassBorder },
                  isSelected && { backgroundColor: THEME.primary }
                ]}
                onPress={() => handleCategoryPress(cat.name)}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, isSelected && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    {cat.icon}
                  </View>
                  <Text style={[styles.countBadge, isSelected && { color: 'white', backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                    {cat.count} {cat.count === 1 ? 'Doc' : 'Docs'}
                  </Text>
                </View>
                <Text style={[styles.cardTitle, { color: isSelected ? 'white' : THEME.text }]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Document List */}
        <Text style={[styles.sectionTitle, { color: THEME.text, marginTop: 24 }]}>
          {selectedCategoryFilter ? `${selectedCategoryFilter} Documents` : 'Recent Documents'}
        </Text>

        {filteredDocs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FileText size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No documents found matching search</Text>
          </View>
        ) : (
          filteredDocs.map(doc => {
            const isDecrypting = decryptingDocId === doc._id;
            return (
              <TouchableOpacity 
                key={doc._id} 
                style={[styles.docList, { borderColor: THEME.glassBorder }]}
                onPress={() => handleDecryptAndPreview(doc)}
                disabled={isDecrypting}
              >
                <View style={styles.docLeft}>
                  {isDecrypting ? (
                    <ActivityIndicator size="small" color={THEME.primary} style={{ marginRight: 8 }} />
                  ) : (
                    <FileText size={20} color={THEME.textMuted} />
                  )}
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={[styles.docTitle, { color: THEME.text }]} numberOfLines={1}>
                      {doc.documentType || 'Personal Document'}
                    </Text>
                    <Text style={[styles.docSub, { color: THEME.textMuted }]}>
                      {doc.category} • {doc.format || 'Image'}
                    </Text>
                  </View>
                </View>
                <View style={styles.badgeContainer}>
                  <View style={styles.lockBadge}>
                    <Lock size={10} color="#10B981" style={{ marginRight: 2 }} />
                    <Text style={styles.badgeText}>AES-256</Text>
                  </View>
                  <ChevronRight size={16} color={THEME.textMuted} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Decrypt & Preview Modal */}
      <Modal
        visible={decryptedImage !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setDecryptedImage(null);
          setDecryptedMetadata(null);
          setIsEditing(false);
        }}
      >
        <View style={styles.modalBg}>
          <View style={[styles.modalContent, isEditing && { height: '80%' }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleGrp}>
                <Unlock size={18} color="#10B981" style={{ marginRight: 6 }} />
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {isEditing ? 'Edit Document Details' : decryptedMetadata?.documentType}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => {
                  setDecryptedImage(null);
                  setDecryptedMetadata(null);
                  setIsEditing(false);
                }}
                style={styles.closeBtn}
              >
                <X size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {isEditing ? (
                /* EDIT DETAILS VIEW */
                <View style={styles.editForm}>
                  
                  {/* Edit Name Dropdown */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Document Name:</Text>
                    <TouchableOpacity 
                      style={styles.dropdownTrigger} 
                      onPress={() => {
                        setShowEditNameList(!showEditNameList);
                        setShowEditFormatList(false);
                        setShowEditCategoryList(false);
                      }}
                    >
                      <Text style={styles.dropdownTriggerText}>{editName}</Text>
                      <ChevronDown size={18} color={THEME.textDark} />
                    </TouchableOpacity>
                    {showEditNameList && (
                      <View style={styles.dropdownOptions}>
                        {DOC_NAMES.map(name => (
                          <TouchableOpacity 
                            key={name} 
                            style={styles.dropdownOption} 
                            onPress={() => {
                              setEditName(name);
                              setShowEditNameList(false);
                            }}
                          >
                            <Text style={styles.dropdownOptionText}>{name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Edit Format Dropdown */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Format:</Text>
                    <TouchableOpacity 
                      style={styles.dropdownTrigger} 
                      onPress={() => {
                        setShowEditFormatList(!showEditFormatList);
                        setShowEditNameList(false);
                        setShowEditCategoryList(false);
                      }}
                    >
                      <Text style={styles.dropdownTriggerText}>{editFormat}</Text>
                      <ChevronDown size={18} color={THEME.textDark} />
                    </TouchableOpacity>
                    {showEditFormatList && (
                      <View style={styles.dropdownOptions}>
                        {DOC_FORMATS.map(f => (
                          <TouchableOpacity 
                            key={f} 
                            style={styles.dropdownOption} 
                            onPress={() => {
                              setEditFormat(f);
                              setShowEditFormatList(false);
                            }}
                          >
                            <Text style={styles.dropdownOptionText}>{f}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Edit Category Dropdown */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Secure Vault Category:</Text>
                    <TouchableOpacity 
                      style={styles.dropdownTrigger} 
                      onPress={() => {
                        setShowEditCategoryList(!showEditCategoryList);
                        setShowEditNameList(false);
                        setShowEditFormatList(false);
                      }}
                    >
                      <Text style={styles.dropdownTriggerText}>{editCategory}</Text>
                      <ChevronDown size={18} color={THEME.textDark} />
                    </TouchableOpacity>
                    {showEditCategoryList && (
                      <View style={styles.dropdownOptions}>
                        {DOC_CATEGORIES.map(cat => (
                          <TouchableOpacity 
                            key={cat} 
                            style={styles.dropdownOption} 
                            onPress={() => {
                              setEditCategory(cat);
                              setShowEditCategoryList(false);
                            }}
                          >
                            <Text style={styles.dropdownOptionText}>{cat}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Save/Cancel Buttons Row */}
                  <View style={styles.editActionRow}>
                    <TouchableOpacity 
                      style={[styles.modalActionBtn, { backgroundColor: THEME.primary }]}
                      onPress={handleUpdateDocument}
                      disabled={updating}
                    >
                      {updating ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <>
                          <Save size={16} color="white" style={{ marginRight: 6 }} />
                          <Text style={styles.modalActionBtnText}>Save Updates</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modalActionBtn, { backgroundColor: '#9CA3AF' }]}
                      onPress={() => setIsEditing(false)}
                    >
                      <Text style={styles.modalActionBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                /* PREVIEW & METADATA VIEW */
                <>
                  <View style={styles.modalMetaInfo}>
                    <View style={styles.modalMetaRow}>
                      <Text style={styles.modalMetaLabel}>Doc Number: </Text>
                      <Text style={styles.modalMetaVal}>{decryptedMetadata?.documentNumber || 'N/A'}</Text>
                    </View>
                    <View style={styles.modalMetaRow}>
                      <Text style={styles.modalMetaLabel}>Category: </Text>
                      <Text style={styles.modalMetaVal}>{decryptedMetadata?.category}</Text>
                    </View>
                    {decryptedMetadata?.extractedMetadata?.name && (
                      <View style={styles.modalMetaRow}>
                        <Text style={styles.modalMetaLabel}>Owner Name: </Text>
                        <Text style={styles.modalMetaVal}>{decryptedMetadata.extractedMetadata.name}</Text>
                      </View>
                    )}
                  </View>

                  {/* Decrypted Content */}
                  <View style={styles.imageContainer}>
                    {decryptedImage && decryptedImage.startsWith('data:image') ? (
                      <Image 
                        source={{ uri: decryptedImage }} 
                        style={styles.decryptedPreview} 
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.unsupportedFormatBox}>
                        <AlertTriangle size={32} color="#F59E0B" />
                        <Text style={styles.unsupportedText}>
                          This format ({decryptedMetadata?.format || 'PDF/Doc'}) cannot be previewed directly as an image, but it is stored securely.
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Action buttons under preview (Edit / Delete) */}
                  <View style={styles.previewActionRow}>
                    <TouchableOpacity 
                      style={[styles.previewActionBtn, { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#D1D5DB' }]}
                      onPress={() => setIsEditing(true)}
                    >
                      <Edit3 size={16} color="#374151" style={{ marginRight: 6 }} />
                      <Text style={[styles.previewActionBtnText, { color: '#374151' }]}>Edit Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.previewActionBtn, { backgroundColor: '#FEE2E2' }]}
                      onPress={handleDeleteDocument}
                    >
                      <Trash2 size={16} color="#EF4444" style={{ marginRight: 6 }} />
                      <Text style={[styles.previewActionBtnText, { color: '#EF4444' }]}>Delete Doc</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.decryptedNotice}>
                    <ShieldCheck size={14} color="#10B981" style={{ marginRight: 4 }} />
                    <Text style={styles.decryptedNoticeText}>Decrypted securely in-memory</Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // Lock UI Styles
  lockContainer: { flex: 1, backgroundColor: '#111827' },
  lockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  lockContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  lockIconBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  lockTitle: { fontSize: 24, fontWeight: '800', color: 'white', marginBottom: 8 },
  lockSub: { fontSize: 14, color: '#9CA3AF', marginBottom: 32 },
  pinIndicatorContainer: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4B5563',
    backgroundColor: 'transparent'
  },
  pinDotFilled: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  pinPad: { width: '100%', maxWidth: 300 },
  pinRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  pinBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  pinBtnText: { fontSize: 28, fontWeight: '600', color: 'white' },
  forgotBtn: { marginTop: 20, padding: 10 },
  forgotBtnText: { color: '#10B981', fontSize: 14, fontWeight: '700' },
  submitOtpBtn: {
    marginTop: 10,
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24
  },
  submitOtpText: { color: 'white', fontSize: 15, fontWeight: '800' },
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
  scrollContent: { padding: 16, paddingBottom: 100 },
  bannerContainer: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  bannerTitle: { fontSize: 15, fontWeight: '800', color: '#3730A3', marginBottom: 4 },
  bannerSub: { fontSize: 12, color: '#4F46E5', lineHeight: 16, fontWeight: '500' },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBtnText: { color: 'white', fontWeight: '800', fontSize: 14 },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 20
  },
  searchInput: { flex: 1, fontSize: 13, fontWeight: '600', color: '#1F2937' },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  clearFilterText: { fontSize: 12, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  card: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  cardTitle: { fontSize: 14, fontWeight: '700' },
  docList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1.5,
  },
  docLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  docTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  docSub: { fontSize: 11, fontWeight: '600' },
  badgeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { fontSize: 9, color: '#10B981', fontWeight: '800' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 40, gap: 10 },
  emptyText: { fontSize: 13, color: '#9CA3AF', fontWeight: '600', textAlign: 'center' },
  
  // Modal styles
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    height: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 14
  },
  modalHeaderTitleGrp: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6'
  },
  modalMetaInfo: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    gap: 4
  },
  modalMetaRow: { flexDirection: 'row', alignItems: 'center' },
  modalMetaLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', width: 90 },
  modalMetaVal: { fontSize: 12, fontWeight: '700', color: '#1F2937' },
  imageContainer: {
    width: '100%',
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16
  },
  decryptedPreview: {
    width: '100%',
    height: '100%',
  },
  unsupportedFormatBox: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  unsupportedText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '600'
  },
  decryptedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    marginBottom: 12
  },
  decryptedNoticeText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '800'
  },
  previewActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  previewActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 14,
  },
  previewActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  
  // Edit Form styles
  editForm: {
    width: '100%',
    marginTop: 8
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FAFCFA'
  },
  dropdownTriggerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937'
  },
  dropdownOptions: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginTop: 6,
    maxHeight: 150,
    overflow: 'scroll'
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  dropdownOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151'
  },
  editActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16
  },
  modalActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 24,
  },
  modalActionBtnText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14
  }
});

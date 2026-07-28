import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Animated, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { 
  Bot, 
  User, 
  Mic, 
  Send, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Globe, 
  Sprout, 
  CloudSun, 
  TrendingUp 
} from 'lucide-react-native';

const LANGUAGES = [
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { id: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  { id: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { id: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { id: 'mr', label: 'मराठी', flag: '🇮🇳' }
];

const INITIAL_MESSAGES = {
  en: [
    { id: '1', sender: 'ai', text: "Hello Ramesh! I am Kissan Mitra AI. Ask me anything about your wheat crops, soil moisture, PM-Kisan subsidy, or weather predictions!" }
  ],
  hi: [
    { id: '1', sender: 'ai', text: "नमस्ते रमेश! मैं किसान मित्र एआई हूँ। मुझसे अपनी गेहूं की फसल, मिट्टी की नमी, पीएम-किसान योजना या मौसम के बारे में कुछ भी पूछें!" }
  ],
  te: [
    { id: '1', sender: 'ai', text: "నమస్తే రమేష్! నేను కిసాన్ మిత్ర AI. మీ గోధుమ పంటలు, నేల తేమ, PM-కిసాన్ పథకం లేదా వాతావరణం గురించి ఏమైనా అడగండి!" }
  ],
  ta: [
    { id: '1', sender: 'ai', text: "வணக்கம் ரமேஷ்! நான் கிசான் மித்ரா AI. உங்கள் பயிர்கள், மண் ஈரம் அல்லது வானிலை பற்றி எதையும் கேளுங்கள்!" }
  ],
  pa: [
    { id: '1', sender: 'ai', text: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਰਮੇਸ਼! ਮੈਂ ਕਿਸਾਨ ਮਿੱਤਰ AI ਹਾਂ। ਆਪਣੀ ਫਸਲ, ਮਿੱਟੀ ਜਾਂ ਮੌਸਮ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ!" }
  ],
  mr: [
    { id: '1', sender: 'ai', text: "नमस्कार रमेश! मी किसान मित्र AI आहे. तुमच्या पिकांबद्दल, मातीबद्दल किंवा हवामानाबद्दल काहीही विचारा!" }
  ]
};

export default function AIFarmerChatScreen() {
  const [selectedLang, setSelectedLang] = useState('en');
  const [messages, setMessages] = useState(INITIAL_MESSAGES.en);
  const [inputQuery, setInputQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Waveform animation for mic
  const waveAnim1 = useRef(new Animated.Value(1)).current;
  const waveAnim2 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(waveAnim1, { toValue: 1.6, duration: 400, useNativeDriver: true }),
            Animated.timing(waveAnim1, { toValue: 1, duration: 400, useNativeDriver: true })
          ]),
          Animated.sequence([
            Animated.timing(waveAnim2, { toValue: 2.1, duration: 600, useNativeDriver: true }),
            Animated.timing(waveAnim2, { toValue: 1, duration: 600, useNativeDriver: true })
          ])
        ])
      ).start();
    } else {
      waveAnim1.setValue(1);
      waveAnim2.setValue(1);
    }
  }, [isRecording, waveAnim1, waveAnim2]);

  const handleLanguageChange = (langId) => {
    setSelectedLang(langId);
    setMessages(INITIAL_MESSAGES[langId] || INITIAL_MESSAGES.en);
  };

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.134:5000/api';

  const handleSend = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : inputQuery;
    if (!query.trim()) return;

    const newMsg = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages(prev => [...prev, newMsg]);
    setInputQuery('');

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, language: selectedLang })
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: data.response }]);
      } else {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: 'Sorry, I am having trouble connecting to the AI brain right now.' }]);
      }
    } catch (e) {
      console.warn('AI Chat error:', e);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: 'Network error. Please check your connection.' }]);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        handleSend("When should I apply fertilizer for wheat?");
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.aiBadgeIcon}>
            <Bot size={22} color="white" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Kissan Mitra AI</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.greenDot} />
              <Text style={styles.statusTxt}>Voice & Text Multi-lingual</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.voiceToggleBtn}
          onPress={() => setVoiceEnabled(!voiceEnabled)}
        >
          {voiceEnabled ? <Volume2 size={20} color="#2e7d32" /> : <VolumeX size={20} color="#7f8c8d" />}
        </TouchableOpacity>
      </View>

      {/* Language Selector Bar */}
      <View style={styles.langBar}>
        <Globe size={16} color="#2e7d32" style={{ marginRight: 6 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {LANGUAGES.map(lang => (
            <TouchableOpacity 
              key={lang.id} 
              style={[styles.langPill, selectedLang === lang.id && styles.langPillActive]}
              onPress={() => handleLanguageChange(lang.id)}
            >
              <Text style={[styles.langText, selectedLang === lang.id && styles.langTextActive]}>
                {lang.flag} {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Quick Prompts */}
      <View style={styles.quickPromptsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
          <TouchableOpacity style={styles.chip} onPress={() => handleSend("Pest Diagnosis for Wheat")}>
            <Sprout size={14} color="#2e7d32" />
            <Text style={styles.chipText}>Pest Diagnosis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip} onPress={() => handleSend("Tomorrow Weather Alert")}>
            <CloudSun size={14} color="#2e7d32" />
            <Text style={styles.chipText}>Weather Alert</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip} onPress={() => handleSend("Wheat Mandi Price Today")}>
            <TrendingUp size={14} color="#2e7d32" />
            <Text style={styles.chipText}>Market Price</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Chat Messages List */}
      <ScrollView style={styles.chatArea} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {messages.map(msg => {
          const isAi = msg.sender === 'ai';
          return (
            <View key={msg.id} style={[styles.msgWrapper, isAi ? styles.msgAi : styles.msgUser]}>
              <View style={[styles.msgBubble, isAi ? styles.bubbleAi : styles.bubbleUser]}>
                <Text style={[styles.msgText, isAi ? styles.textAi : styles.textUser]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          );
        })}

        {isRecording && (
          <View style={styles.recordingAlert}>
            <Text style={styles.recordingTxt}>🎙️ Listening in {LANGUAGES.find(l => l.id === selectedLang)?.label}...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Bar with Voice Wave Anim */}
      <View style={styles.inputContainer}>
        
        {/* Mic Pulse Button */}
        <TouchableOpacity style={styles.micBtnWrapper} onPress={toggleRecording}>
          <Animated.View style={[styles.waveCircle, { transform: [{ scale: waveAnim2 }], opacity: isRecording ? 0.3 : 0 }]} />
          <Animated.View style={[styles.waveCircle, { transform: [{ scale: waveAnim1 }], opacity: isRecording ? 0.5 : 0 }]} />
          <View style={[styles.micBtn, isRecording && styles.micBtnActive]}>
            <Mic size={20} color="white" />
          </View>
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Ask Kissan Mitra AI..."
          placeholderTextColor="#8d99ae"
          value={inputQuery}
          onChangeText={setInputQuery}
          onSubmitEditing={() => handleSend()}
        />

        <TouchableOpacity 
          style={[styles.sendBtn, !inputQuery.trim() && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={!inputQuery.trim()}
        >
          <Send size={18} color="white" />
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7e0',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiBadgeIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1b4332',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  statusTxt: {
    fontSize: 11,
    color: '#52796f',
    fontWeight: '500',
  },
  voiceToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  langBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4f0',
  },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f4f7f4',
  },
  langPillActive: {
    backgroundColor: '#1b4332',
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#52796f',
  },
  langTextActive: {
    color: 'white',
  },
  quickPromptsRow: {
    paddingVertical: 10,
    backgroundColor: '#f4f7f4',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'white',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1b4332',
  },
  chatArea: {
    flex: 1,
  },
  msgWrapper: {
    width: '100%',
    marginVertical: 4,
  },
  msgAi: {
    alignItems: 'flex-start',
  },
  msgUser: {
    alignItems: 'flex-end',
  },
  msgBubble: {
    maxWidth: '82%',
    padding: 14,
    borderRadius: 18,
  },
  bubbleAi: {
    backgroundColor: 'white',
    borderTopLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  bubbleUser: {
    backgroundColor: '#2e7d32',
    borderTopRightRadius: 4,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textAi: {
    color: '#1b4332',
    fontWeight: '500',
  },
  textUser: {
    color: 'white',
    fontWeight: '600',
  },
  recordingAlert: {
    alignSelf: 'center',
    backgroundColor: '#ffebee',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  recordingTxt: {
    color: '#d32f2f',
    fontSize: 12,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e7e0',
    gap: 10,
    marginBottom: Platform.OS === 'ios' ? 24 : 85, // clear bottom tabs
  },
  micBtnWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  waveCircle: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2e7d32',
  },
  micBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micBtnActive: {
    backgroundColor: '#d32f2f',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f4f7f4',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 44,
    fontSize: 14,
    color: '#1b4332',
    fontWeight: '500',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#c8e6c9',
  },
});

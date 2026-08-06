import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { MessageSquare, Mic, Send, Bot } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';

export default function AIChatScreen({ onBack }) {
  const { farmerProfile } = useProfile();
  
  const [messages, setMessages] = useState([
    { id: 1, text: `Hello ${farmerProfile?.name || 'Farmer'}!\nI am your AI farming assistant.\nHow can I help you today?`, sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    'Which crop is best for my field?',
    'Why are my plant leaves turning yellow?',
    'What is the price of paddy in Warangal?',
    'How to apply for PM-KISAN?'
  ];

  const handleSend = async (textToSend) => {
    const promptText = textToSend || input;
    if (!promptText.trim()) return;

    setMessages(prev => [...prev, { id: Date.now(), text: promptText, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api';
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          language: farmerProfile?.preferredLanguage || 'English',
          userId: farmerProfile?._id || 'mock-user-111'
        })
      });
      const data = await res.json();
      
      let reply = '';
      if (data.status === 'success') {
        reply = data.response;
      } else {
        reply = 'Sorry, I am having trouble connecting to the AI brain right now.';
      }
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'ai' }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: 'Network error. Please try again later.', sender: 'ai' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>◀</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <Text style={{ fontSize: 10, color: THEME.primary, fontWeight: '600' }}>Powered by Gemini ✨</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {/* Messages list */}
      <ScrollView 
        style={{ flex: 1, padding: 16 }} 
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(msg => (
          <View 
            key={msg.id} 
            style={[
              styles.msgBubble, 
              msg.sender === 'user' ? styles.msgUser : styles.msgAI
            ]}
          >
            {msg.sender === 'ai' && (
              <View style={styles.botIconCircle}>
                <Bot size={14} color="white" />
              </View>
            )}
            <Text style={[styles.msgText, msg.sender === 'user' ? styles.msgTextUser : styles.msgTextAI]}>
              {msg.text}
            </Text>
          </View>
        ))}

        {loading && (
          <View style={[styles.msgBubble, styles.msgAI, { width: 60, alignItems: 'center' }]}>
            <ActivityIndicator size="small" color={THEME.primary} />
          </View>
        )}

        {/* Suggestion list */}
        {messages.length === 1 && (
          <View style={styles.sugSection}>
            <Text style={styles.sugTitle}>Try asking me</Text>
            {suggestions.map((sug, i) => (
              <TouchableOpacity 
                key={i} 
                style={styles.sugBubble}
                onPress={() => handleSend(sug)}
              >
                <Text style={styles.sugText}>{sug}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TextInput 
          style={styles.textInput} 
          placeholder="Type your question..." 
          placeholderTextColor={THEME.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity style={styles.micBtn} onPress={() => alert('Speech-To-Text active! State speech details...')}>
          <Mic size={18} color={THEME.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
          <Send size={16} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  msgBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start'
  },
  msgUser: {
    alignSelf: 'flex-end',
    backgroundColor: THEME.primary,
    borderBottomRightRadius: 2,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2
  },
  msgAI: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    borderBottomLeftRadius: 2,
    shadowColor: '#1b2e1b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1
  },
  botIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1
  },
  msgTextUser: {
    color: 'white',
    fontWeight: '600'
  },
  msgTextAI: {
    color: THEME.textDark,
    fontWeight: '600'
  },
  sugSection: {
    marginTop: 10
  },
  sugTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  sugBubble: {
    backgroundColor: 'white',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    marginBottom: 8
  },
  sugText: {
    fontSize: 13,
    color: THEME.textDark,
    fontWeight: '600'
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: 'rgba(44, 107, 67, 0.06)',
    paddingBottom: Platform.OS === 'ios' ? 90 : 80
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F7F3',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 13,
    color: THEME.textDark,
    fontWeight: '600'
  },
  micBtn: {
    padding: 10,
    marginHorizontal: 4
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

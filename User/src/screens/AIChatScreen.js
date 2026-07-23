import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator 
} from 'react-native';
import { MessageSquare, Mic, Send } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';

export default function AIChatScreen() {
  const { farmerProfile } = useProfile();
  
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Hello! I am your ApnaKissan AI assistant. How can I help you today?', sender: 'ai' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const submitChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { id: Date.now(), text: chatInput, sender: 'user' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    setTimeout(() => {
      const promptText = userMsg.text.toLowerCase();
      let reply = '';
      if (promptText.includes('weather') || promptText.includes('rain')) {
        reply = '[Weather AI] Local sensors report humidity at 65% with a 30% rain probability. Crop status indicates sowing can proceed safely.';
      } else if (promptText.includes('scheme') || promptText.includes('money')) {
        reply = '[Scheme AI] Matching your profile, you are eligible for the PM-KISAN subsidy. Please prepare your land record copy (Khatauni) for submission.';
      } else if (promptText.includes('mandi') || promptText.includes('price')) {
        reply = '[Market AI] Today\'s price for Paddy in your district mandi is ₹2,183 per quintal. We predict stable prices for the next 7 days.';
      } else {
        reply = '[Farmer AI] Understood. Based on your loamy soil type, we recommend maintaining alternate wetting and drying for irrigation to optimize root strength.';
      }
      
      setChatMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'ai' }]);
      setChatLoading(false);
    }, 1500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEME.bg }}>
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <MessageSquare color={THEME.primary} size={22} />
          <Text style={{ fontSize: 16, fontWeight: '700', color: THEME.deepForest }}>ApnaKissan Multi-Agent AI</Text>
        </View>
        <Text style={{ fontSize: 11, color: THEME.textMuted }}>Preferred: {farmerProfile.preferredLanguage}</Text>
      </View>

      {/* Suggestion Bubbles */}
      <View style={styles.chatSuggestionsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}>
          <TouchableOpacity style={styles.sugBubble} onPress={() => setChatInput('Check crop prices')}>
            <Text style={styles.sugText}>🌾 Check crop prices</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sugBubble} onPress={() => setChatInput('Eligible subsidies?')}>
            <Text style={styles.sugText}>🏛️ Eligible subsidies?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sugBubble} onPress={() => setChatInput('Tomato disease remedy')}>
            <Text style={styles.sugText}>🐛 Tomato disease remedy</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Messages List */}
      <ScrollView style={{ flex: 1, padding: 12 }} showsVerticalScrollIndicator={false}>
        {chatMessages.map(msg => (
          <View 
            key={msg.id} 
            style={[
              styles.chatMsgBubble, 
              msg.sender === 'user' ? styles.chatMsgUser : styles.chatMsgAI
            ]}
          >
            <Text style={[styles.chatMsgText, msg.sender === 'user' ? styles.chatMsgTextUser : styles.chatMsgTextAI]}>
              {msg.text}
            </Text>
          </View>
        ))}
        {chatLoading && (
          <View style={[styles.chatMsgBubble, styles.chatMsgAI, { width: 60, alignItems: 'center' }]}>
            <ActivityIndicator size="small" color={THEME.primary} />
          </View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.chatInputBar}>
        <TextInput 
          style={styles.chatTextInput} 
          placeholder="Ask anything..." 
          value={chatInput}
          onChangeText={setChatInput}
          onSubmitEditing={submitChatMessage}
        />
        <TouchableOpacity style={styles.voiceChatBtn} onPress={() => alert('Speech-To-Text micro-phone initialized!')}>
          <Mic size={18} color={THEME.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendChatBtn} onPress={submitChatMessage}>
          <Send size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#e8eae3'
  },
  chatSuggestionsRow: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e8eae3'
  },
  sugBubble: {
    backgroundColor: THEME.bg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#e8eae3'
  },
  sugText: {
    fontSize: 11,
    color: THEME.deepForest
  },
  chatMsgBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10
  },
  chatMsgUser: {
    alignSelf: 'flex-end',
    backgroundColor: THEME.primary,
    borderBottomRightRadius: 2
  },
  chatMsgAI: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e8eae3',
    borderBottomLeftRadius: 2
  },
  chatMsgText: {
    fontSize: 13,
    lineHeight: 18
  },
  chatMsgTextUser: {
    color: 'white'
  },
  chatMsgTextAI: {
    color: THEME.deepForest
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#e8eae3',
    paddingBottom: 24
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: THEME.bg,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    marginRight: 10,
    color: THEME.deepForest
  },
  voiceChatBtn: {
    padding: 10,
    marginRight: 6
  },
  sendChatBtn: {
    backgroundColor: THEME.primary,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

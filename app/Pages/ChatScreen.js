import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import GlobalApi from '../Services/GlobalApi';

const TypingIndicator = () => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
      <Text style={{ fontSize: 36, color: '#888', fontWeight: 'bold' }}>{'.'.repeat(dotCount)}</Text>
    </View>
  );
};

export default function ChatScreen() {
  const { params } = useRoute(); 
  const [selectedChatFace, setSelectedChatFace] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params && params.selectedFace) {
      setSelectedChatFace(params.selectedFace);
      setMessages([
        {
          id: Date.now().toString(),
          text: `Hello ${params.selectedFace.name}`,
          sender: 'bot',
        },
      ]);
    }
  }, [params]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    setMessages((prevMessages) => [newMessage, ...prevMessages]);
    setLoading(true);
    getApiResp(inputText);
    setInputText('');
  };

  const getApiResp = (msg) => {
    GlobalApi.getBardApi(msg).then(resp => {
      // console.log(resp);

      // Use the correct property from your API response
      const botReply = resp.data.reply || "Sorry, I didn't understand that.";

      const botMessage = {
        id: Date.now().toString(),
        text: botReply,
        sender: 'bot',
      };

      setMessages((prevMessages) => [botMessage, ...prevMessages]);
      setLoading(false);
    });
  };

  // Create combined data with date header at the end
  const chatData = [
    ...messages,
    {
      id: 'date-header',
      type: 'date',
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    },
  ];

  const renderItem = ({ item }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      );
    }

    if (item.sender === 'bot') {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Image
            source={{ uri: selectedChatFace.image }}
            style={styles.botImage}
          />
          <View style={[styles.message, styles.botMsg]}>
            <Text style={styles.text}>{item.text}</Text>
            <Text style={styles.time}>
              {new Date(parseInt(item.id)).toLocaleTimeString()}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.message,
          styles.userMsg,
        ]}
      >
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.time}>
          {new Date(parseInt(item.id)).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
      >
        <FlatList
          style={styles.messagesList}
          inverted
          data={chatData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
        {/* Show animated typing indicator at the bottom if loading */}
        {loading && <TypingIndicator />}
      </KeyboardAvoidingView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline={false}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
          blurOnSubmit={false}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.OS === 'android' ? 30 : 0,
    backgroundColor: '#f5f7fa',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  flex1: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 4,
  },
  dateHeader: {
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '500',
  },
  message: {
    margin: 8,
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  userMsg: {
    backgroundColor: '#4f8cff',
    alignSelf: 'flex-end',
    color: '#fff',
  },
  botMsg: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  text: {
    fontSize: 16,
    color: '#222',
  },
  time: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 20 : 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    height: 40,
    marginRight: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  sendBtn: {
    backgroundColor: '#4f8cff',
    padding: 8,
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: '#4f8cff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  botImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});

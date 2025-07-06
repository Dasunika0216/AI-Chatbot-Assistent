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
} from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function ChatScreen() {
  const { params } = useRoute(); 
  const [selectedChatFace, setSelectedChatFace] = useState([]);

  // setSelectedChatFace(params.selectedFace);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello ',
      sender: 'bot',
    },
  ]);

  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    setMessages((prevMessages) => [newMessage, ...prevMessages]);
    setInputText('');
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

    return (
      <View
        style={[
          styles.message,
          item.sender === 'user' ? styles.userMsg : styles.botMsg,
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
    paddingBottom: Platform.OS === 'android' ? 30 : 0, // lift input bar on Android
    backgroundColor: '#fff',
  },
  flex1: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
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
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMsg: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  botMsg: {
    backgroundColor: '#EEE',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 16,
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
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 20 : 0, // lift input bar margin for Android
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
  },
  sendBtn: {
    backgroundColor: '#007AFF',
    padding:5,
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 20,
  },
});

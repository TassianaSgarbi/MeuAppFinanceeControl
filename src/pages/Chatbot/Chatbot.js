import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native';
import ChatBubble from "./ChatBubble";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), message: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botReply = {
        id: (Date.now() + 1).toString(),
        message: `Você disse: ${input}`,
        isUser: false,
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);

    setInput('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item.message} isUser={item.isUser} />}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Digite sua mensagem..."
        />
        <Button title="Enviar" onPress={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatContainer: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default Chatbot;

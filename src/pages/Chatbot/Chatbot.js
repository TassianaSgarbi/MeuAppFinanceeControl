import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Certifique-se de ter essa dependência instalada
import ChatBubble from "./ChatBubble";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isFirstInteraction, setIsFirstInteraction] = useState(true); // Estado para controlar a primeira interação

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Token obtido: ', token);
      return token;
    } catch (error) {
      console.error('Erro ao obter o token: ', error);
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), message: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

    try {
        const token = await getToken();

        if (!token) {
            Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
            return;
        }

        const response = await fetch('http://192.168.0.23:3333/api/insight', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ pergunta: input, userId: '123' }),
        });

        console.log('Resposta completa da API:', response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Erro na API: ${response.status} - ${errorText}`);
            throw new Error(`Erro: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Dados retornados da API:', data);

        let botReplyMessage = '';
        if (isFirstInteraction) {
            botReplyMessage = 'Olá! Como posso ajudar?'; // Resposta "Olá" na primeira interação
            setIsFirstInteraction(false); // Depois da primeira interação, alteramos o estado
        } else {
            // Remover "resposta" da API e apenas mostrar a mensagem
            botReplyMessage = data.resposta ? data.resposta.replace('resposta', '').trim() : 'Nenhuma resposta fornecida.'; 
        }

        const botReply = {
            id: (Date.now() + 1).toString(),
            message: botReplyMessage,
            isUser: false,
        };

        setMessages((prev) => [...prev, botReply]);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        setMessages((prev) => [...prev, { id: (Date.now() + 2).toString(), message: 'Erro ao obter resposta do servidor.', isUser: false }]);
    }

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

import React, { useState, useRef } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatBubble from "./ChatBubble";
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);  // Referência para o FlatList

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

  const analyzeInput = (message) => {
    // Analisa a entrada do usuário para determinar a intenção
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes('despesas') || lowerCaseMessage.includes('cadastradas')) {
      return 'expenses';
    }
    return 'insight'; // Padrão para outras perguntas
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

      const intention = analyzeInput(input);

      let apiUrl = '';
      let apiMethod = '';
      let payload = {};

      if (intention === 'expenses') {
        // Consulta despesas
        apiUrl = 'http://192.168.0.23:3333/expenses';
        apiMethod = 'GET';
      } else {
        // Consulta insights
        apiUrl = 'http://192.168.0.23:3333/api/insight';
        apiMethod = 'POST';
        payload = { pergunta: input, userId: '123' };
      }

      const response =
        apiMethod === 'GET'
          ? await axios.get(apiUrl, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          : await axios.post(apiUrl, payload, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });

      console.log('Dados recebidos da API: ', response.data); // Inspecione a resposta

      if (response.status !== 200) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = response.data;

      const botReply = {
        id: (Date.now() + 1).toString(),
        message: intention === 'expenses' ? formatExpenses(data) : formatInsightResponse(data),
        isUser: false,
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 2).toString(), message: 'Erro ao obter resposta do servidor.', isUser: false },
      ]);
    }

    setInput('');
  };

  const formatExpenses = (data) => {
    if (Array.isArray(data) && data.length > 0) {
      return data
        .map(
          (expense) =>
            `Despesa: ${expense.description || 'Não especificado'}, Valor: R$ ${expense.amount || 'Não informado'}, Vencimento: ${expense.due_date || 'Data não informada'}`
        )
        .join('\n');
    }
    return 'Nenhuma despesa encontrada.';
  };

  const formatInsightResponse = (data) => {
    // Verifica se a resposta contém os prefixos indesejados e remove-os
    if (data && data.resposta) {
      let responseMessage = data.resposta.trim();
  
      // Remove "Pergunta: " e "Resposta: " no início da mensagem, se existirem
      const prefixes = ["Pergunta: ", "Resposta: "];
  
      prefixes.forEach(prefix => {
        if (responseMessage.startsWith(prefix)) {
          responseMessage = responseMessage.substring(prefix.length).trim();
        }
      });
  
      return responseMessage || 'Desculpe, não conseguimos obter um insight neste momento.';
    }
  
    return 'Desculpe, não conseguimos obter um insight neste momento.';
  };
  // Função para rolar automaticamente para o final da lista de mensagens
  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  // UseEffect para rolar sempre que a lista de mensagens mudar
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        ref={flatListRef}  // Referência do FlatList
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

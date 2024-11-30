import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatBubble = ({ message, isUser }) => {
  return (
    <View style={[styles.container, isUser ? styles.userBubble : styles.botBubble]}>
      <Text style={[styles.messageText, !isUser && styles.botText]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '75%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF', // Fundo azul para mensagens do usuário
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA', // Fundo cinza para mensagens do bot
  },
  messageText: {
    fontSize: 16,
    color: '#fff', // Cor padrão do texto (branca)
  },
  botText: {
    color: '#000', // Preto para o texto do bot
  },
});

export default ChatBubble;

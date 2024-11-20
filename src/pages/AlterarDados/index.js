import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';  // Importando o axios
import { jwt_decode } from 'jwt-decode';  // Importa como named export
import AsyncStorage from '@react-native-async-storage/async-storage';  // Importação correta


export default function AlterarDados() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // Adicionando o estado para mensagem de erro

  const handleUpdate = async () => {
    try {
      // Recupera o token JWT do armazenamento (exemplo com AsyncStorage)
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        throw new Error('Token não encontrado');
      }

      // Decodifica o token para obter o userId
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;  // O userId deve estar no payload do token

      if (!userId) {
        throw new Error('User ID não encontrado no token');
      }
      // Enviar a requisição PUT para o backend
      const response = await axios.put('http://192.168.0.23:3333/user/edit', // Altere para o endereço correto do seu backend
        {
          user_id: userId,  // Passando o ID do usuário
          new_name: name,
          new_email: email,
          new_password: newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Passando o token JWT no cabeçalho
          },
        }
      );
      console.log('Dados atualizados com sucesso:', response.data);
      // Exibir uma mensagem de sucesso ou redirecionar o usuário para outra tela
    } catch (error) {
      console.error('Erro ao atualizar os dados:', error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || 'Erro ao atualizar os dados');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={true} // Mostrar a barra de rolagem vertical
    >
      <View style={styles.content}>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#888"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Nova Senha"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholderTextColor="#888"
            secureTextEntry
          />

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}


          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Permite que o ScrollView expanda para preencher o conteúdo
    backgroundColor: 'white', // Fundo branco para o container
    paddingHorizontal: 20, // Adiciona um espaçamento horizontal no container
    paddingVertical: 20, // Adiciona espaçamento vertical para evitar que o conteúdo fique colado nas bordas
  },
  content: {
    flex: 1,
    alignItems: 'stretch', // Faz com que o conteúdo se estique para ocupar toda a largura
  },
  form: {
    flexGrow: 1, // Permite que o formulário expanda conforme necessário
  },
  input: {
    height: 50,
    width: '100%', // Ajusta a largura para ocupar a tela toda
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15, // Espaçamento inferior
    paddingHorizontal: 15,
    backgroundColor: 'white',
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF', // Cor azul do botão
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

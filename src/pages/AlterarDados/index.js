import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios'; // Importando o axios
import {jwtDecode} from 'jwt-decode'; // Importação correta do jwt-decode
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importação correta

export default function AlterarDados() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para mensagem de erro

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const decodedToken = jwtDecode(token);
      const user_id = decodedToken?.sub || decodedToken?.user_id; // Ajuste baseado na estrutura real do token

      if (!user_id) {
        throw new Error('User ID não encontrado no token');
      }

      // Construir o payload de forma condicional, omitindo campos vazios
      const payload = { user_id }; // Incluindo o ID do usuário
      if (name.trim()) payload.new_name = name;
      if (email.trim()) payload.new_email = email;

      // Se a nova senha for preenchida, é necessário confirmar a senha
      if (newPassword.trim()) {
        if (newPassword.trim() !== confirmNewPassword.trim()) {
          setErrorMessage('As senhas não coincidem.');
          return;
        }
        payload.new_password = newPassword;
        payload.confirm_password = confirmNewPassword;
      }

      // Verifica se pelo menos um campo foi preenchido
      if (!payload.new_name && !payload.new_email && !payload.new_password) {
        setErrorMessage('Preencha pelo menos um campo para atualizar.');
        return;
      }

      // Enviar a requisição PUT para o backend
      const response = await axios.put(
        'http://192.168.0.23:3333/user/edit', // Altere para o endereço correto do seu backend
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Passando o token JWT no cabeçalho
          },
        }
      );

      console.log('Dados atualizados com sucesso:', response.data);
      Alert.alert('Sucesso', 'Dados Atualizados com Sucesso!'); // Exibe o alerta de sucesso
    } catch (error) {
      console.error('Erro ao atualizar os dados:', error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || 'Erro ao atualizar os dados');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Preencha os campos abaixo para atualizar seus dados!</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Novo Nome"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Novo Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Nova Senha"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      {newPassword.trim() !== '' && (
        <TextInput
          style={styles.input}
          placeholder="Confirmar Nova Senha"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Atualizar Dados</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe o AsyncStorage
import axios from 'axios';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Função para armazenar o token no AsyncStorage
  const saveToken = async (token) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      console.log("Token salvo com sucesso:", token); // Verifique se o token é salvo corretamente
    } catch (error) {
      console.error("Erro ao salvar o token:", error);
    }
  };

  // Função para realizar o login
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.0.23:3333/session', {
        email,
        password
      });

      if (response.data.token) {
        Alert.alert('Login bem-sucedido');
        
        // Salvar o token no AsyncStorage
        await saveToken(response.data.token);

        // Navegar para a tela Home
        navigation.navigate('Home');
      }
    } catch (error) {
      //console.error('Erro ao fazer login', error.response?.data || error.message);
      Alert.alert('Erro', 'E-mail ou senha incorretos.');
    }
  };

  // Função para exibir o alerta de recuperação de senha
  const handleRecuperarSenha = () => {
    Alert.alert(
      'Recuperação de Senha',
      'Envie um e-mail para suporteti@financeecontrol.com.br e receba link de recuperação de senha!'
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title="Entrar" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('CadastroUsuario')}>
        <Text style={styles.cadastroText}>Cadastra-se</Text>
      </TouchableOpacity>

      {/* Adiciona o botão de Recuperar Senha */}
      <TouchableOpacity onPress={handleRecuperarSenha}>
        <Text style={styles.recuperarSenhaText}>Recuperar Senha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: 'white',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  cadastroText: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
  recuperarSenhaText: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center',
  },
});

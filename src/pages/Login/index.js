import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios'; // Importando o axios

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Função para realizar o login
  const handleLogin = async () => {
    try {
      // Enviar uma requisição POST para o backend para verificar o e-mail e senha
      const response = await axios.post('http://192.168.0.23:3333/session', {
        email,
        password
      });

      // Se o login for bem-sucedido, você pode armazenar o token JWT e redirecionar
      if (response.data.token) {
        Alert.alert('Login bem-sucedido');
        // Armazenar o token ou dados do usuário conforme necessário
        // Exemplo de armazenamento do token em AsyncStorage
        // await AsyncStorage.setItem('userToken', response.data.token);

        // Navegar para a tela Home
        navigation.navigate('Home');
      }
    } catch (error) {
      // Caso haja erro (como dados incorretos)
      console.error('Erro ao fazer login', error.response?.data || error.message);
      Alert.alert('Erro', 'E-mail ou senha incorretos.');
    }
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
 });

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import axios from 'axios'; // Importando o axios

// Função para validar e-mail
const isValidEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
};

// Função para validar CPF
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

const isValidCpf = (cpf) => cpfValidator.isValid(cpf);

export default function CadastroUsuario() {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');  // Estado para mensagem de sucesso

  const handleSubmit = async () => {
    // Verificar se todos os campos estão preenchidos
    if (!name || !cpf || !email || !password) {
      console.error('Todos os campos são obrigatórios');
      return;
    }

    // Verificar se o e-mail é válido
    if (!isValidEmail(email)) {
      console.error('E-mail inválido');
      return;
    }

    // Verificar se o CPF é válido
    if (!isValidCpf(cpf)) {
      console.error('CPF inválido');
      return;
    }

    const data = { name, cpf, email, password };

    try {
      // Enviar os dados para o backend via POST
      const response = await axios.post('http://192.168.0.23:3333/users', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(response.data); // Exibe a resposta do servidor

      // Exibir a mensagem de sucesso
      setMessage('Usuário Cadastrado com Sucesso!');

      // Opcional: você pode limpar os campos após o cadastro
      setName('');
      setCpf('');
      setEmail('');
      setPassword('');

      // Exibir um alerta de sucesso
      Alert.alert('Cadastro bem-sucedido', 'Usuário Cadastrado com Sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar usuário', error.response?.data || error.message);
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
          <TextInputMask
            style={styles.input}
            placeholder="CPF"
            type={'cpf'}
            value={cpf}
            onChangeText={setCpf}
            placeholderTextColor="#888"
            keyboardType="numeric"
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
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#888"
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          {/* Exibir a mensagem de sucesso, se houver */}
          {message ? <Text style={styles.successMessage}>{message}</Text> : null}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333', // Cor de texto escura
    marginBottom: 10,
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
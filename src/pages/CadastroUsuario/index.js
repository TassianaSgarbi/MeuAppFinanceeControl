import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

export default function CadastroUsuario() {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // Lógica para lidar com o envio do formulário
    console.log({ name, cpf, dob, email, password });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={true} // Mostrar a barra de rolagem vertical
    >
      <View style={styles.content}>
        {/* <Text style={styles.title}>Cadastro de Usuário</Text> */}
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
          <TextInputMask
            style={styles.input}
            placeholder="Data de Nascimento"
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY',
            }}
            value={dob}
            onChangeText={setDob}
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

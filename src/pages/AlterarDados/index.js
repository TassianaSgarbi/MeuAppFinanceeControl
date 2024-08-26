import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

export default function AlterarDados() {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdate = () => {
    // Lógica para lidar com a atualização dos dados
    console.log({ name, cpf, dob, email, password, newPassword });
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
            placeholder="Senha Atual"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#888"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Nova Senha"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholderTextColor="#888"
            secureTextEntry
          />
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

import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios'; // Importando o axios
import { jwtDecode } from 'jwt-decode'; // Importação correta do jwt-decode
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importação correta
import { useNavigation } from '@react-navigation/native'; // Para navegação

export default function DeletarUsuario() {
  const navigation = useNavigation(); // Hook para navegação

  const handleDelete = async () => {
    try {
      // Recupera o token JWT do armazenamento
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        throw new Error('Token não encontrado');
      }

      // Decodifica o token para obter o user_id
      const decodedToken = jwtDecode(token);
      const user_id = decodedToken?.sub || decodedToken?.user_id; // Ajuste baseado na estrutura real do token

      if (!user_id) {
        throw new Error('User ID não encontrado no token');
      }

      // Confirmação para o usuário antes de deletar
      Alert.alert(
        'Confirmação',
        'Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Deletar',
            style: 'destructive',
            onPress: async () => {
              try {
                // Requisição para deletar o usuário
                const response = await axios.delete(
                  `http://192.168.0.33:3333/delete-user?user_id=${user_id}`, // Altere para o endpoint correto
                  {
                    headers: {
                      Authorization: `Bearer ${token}`, // Passando o token JWT no cabeçalho
                    },
                  }
                );

                console.log('Usuário deletado com sucesso:', response.data);

                // Alerta de sucesso
                Alert.alert(
                  'Sucesso',
                  'Conta Usuário Excluída com Sucesso!',
                  [
                    {
                      text: 'OK',
                      onPress: async () => {
                        // Limpa o token local e redireciona o usuário
                        await AsyncStorage.removeItem('authToken');
                        navigation.navigate('Login'); // Redireciona para a tela de login
                      },
                    },
                  ]
                );
              } catch (error) {
                console.error('Erro ao deletar o usuário:', error.response?.data?.message || error.message);
                Alert.alert('Erro', error.response?.data?.message || 'Erro ao excluir a conta.');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao deletar o usuário:', error.response?.data?.message || error.message);
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao excluir a conta.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Excluir Conta</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Deletar Usuário</Text>
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
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

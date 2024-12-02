import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView, Alert, View } from 'react-native';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function InformacoesApp() {
  const navigation = useNavigation(); // Hook para navegação

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Token não encontrado');

      const decodedToken = jwtDecode(token);
      const user_id = decodedToken?.sub || decodedToken?.user_id;

      if (!user_id) throw new Error('User ID não encontrado no token');

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
                const response = await axios.delete(
                  `http://192.168.0.23:3333/delete-user?user_id=${user_id}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                Alert.alert(
                  'Sucesso',
                  'Conta excluída com sucesso!',
                  [
                    {
                      text: 'OK',
                      onPress: async () => {
                        await AsyncStorage.removeItem('authToken');
                        navigation.navigate('Login');
                      },
                    },
                  ]
                );
              } catch (error) {
                Alert.alert('Erro', error.response?.data?.message || 'Erro ao excluir a conta.');
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao excluir a conta.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.description}>
        O **Financee Control** é um aplicativo de controle financeiro. 
        Nele, você pode fazer perguntas no chatbot sobre economia, finanças e ter dicas de como economizar.
      </Text>

      <View style={styles.deleteConfirmation}>
        <Text style={styles.warningText}>Deseja deletar sua conta?</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: '#28a745' }]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Sim</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: '#dc3545' }]}
            onPress={() => navigation.goBack()} // Redireciona para a tela anterior
          >
            <Text style={styles.buttonText}>Não</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    color: '#555',
    lineHeight: 22,
  },
  deleteConfirmation: {
    marginTop: 20,
  },
  warningText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  confirmButton: {
    padding: 15,
    borderRadius: 5,
    minWidth: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

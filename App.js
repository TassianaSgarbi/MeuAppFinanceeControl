import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do interceptor do Axios para incluir o token em todas as requisições
axios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken'); // Recupera o token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adiciona o token ao cabeçalho
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const App = () => {
  useEffect(() => {
    // Esse useEffect pode ser utilizado para outras configurações futuras
    console.log('App carregado com sucesso');
  }, []);

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <LinearGradient
          colors={['#FFFFFF', '#FFFFFF']}
          style={styles.headerGradient}
        >
          {/* Adicionando o logo no headerGradient */}
          <Image 
            source={require('./assets/logo2.png')} // Caminho para o logo
            style={styles.logo}
            resizeMode="contain"
          />
        </LinearGradient>

        <AppNavigator />

        {/* Substituindo LinearGradient por View com cor sólida */}
        <View style={styles.footerGradient}>
          <Text style={styles.welcomeText}></Text>
          <Text style={styles.welcomeText}>Sistema Controle Financeiro</Text>
        </View>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  headerGradient: {
    width: '100%',
    height: '30%',
    padding: 20,
    borderBottomLeftRadius: 85,
    borderBottomRightRadius: 85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerGradient: {
    width: '100%',
    height: '10%',
    padding: 20,
    borderTopLeftRadius: 85,
    borderTopRightRadius: 85,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF', // Azul padrão do React Native
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logo: {
    width: 250, // Largura do logo
    height: 250, // Altura do logo
  },
});

export default App;


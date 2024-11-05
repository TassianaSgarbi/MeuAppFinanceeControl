import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
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
    height: '15%',
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


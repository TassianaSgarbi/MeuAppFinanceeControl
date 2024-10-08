import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(73,96,249,1)', 'rgba(25,55,254,1)']}
          style={styles.headerGradient}
        >
        </LinearGradient>

        <AppNavigator />

        <LinearGradient
          colors={['rgba(25,55,254,1)', 'rgba(73,96,249,1)']}
          style={styles.footerGradient} >
        <Text style={styles.welcomeText}>Financee Control</Text>
        <Text style={styles.welcomeText}>Sistema Controle Financeiro</Text>
          </LinearGradient>
        
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
    height: '25%',
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
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default App;

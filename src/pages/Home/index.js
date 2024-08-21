// src/pages/Home.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Bem-vindo à tela Home!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    width: '100%',
    height: '30%',
    padding: 20,
    borderBottomLeftRadius: 85,
    borderBottomRightRadius: 85,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(73,96,249,1)', // A cor de fundo desejada
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});

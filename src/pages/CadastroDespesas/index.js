// src/pages/CadastroDespesas.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CadastroDespesas() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Cadastro de Despesas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});

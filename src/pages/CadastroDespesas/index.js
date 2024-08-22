import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function CadastroDespesas() {
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [dataPagamento, setDataPagamento] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipoOptions, setTipoOptions] = useState([]);

  const updateTipoDespesas = (selectedCategoria) => {
    setCategoria(selectedCategoria);
    let options = [];
    if (selectedCategoria === 'Tributária') {
      options = ['Imposto de Renda', 'IPTU', 'Outros'];
    } else if (selectedCategoria === 'Consumo') {
      options = ['Água', 'Energia', 'Internet'];
    } else if (selectedCategoria === 'Outras') {
      options = ['Manutenção', 'Transporte', 'Outros'];
    }
    setTipoOptions(options);
    setTipo(''); // Resetar o tipo selecionado
  };

  const handleSubmit = () => {
    // Lógica para enviar os dados para o backend ou processar o cadastro
    console.log({
      categoria,
      tipo,
      dataVencimento,
      dataPagamento,
      valor,
      descricao,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Preencha os campos abaixo para cadastrar sua conta!</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={categoria}
              style={styles.picker}
              onValueChange={(itemValue) => updateTipoDespesas(itemValue)}
            >
              <Picker.Item label="Selecione a Categoria" value="" />
              <Picker.Item label="Tributária" value="Tributária" />
              <Picker.Item label="Consumo" value="Consumo" />
              <Picker.Item label="Outras" value="Outras" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Picker
              selectedValue={tipo}
              style={styles.picker}
              onValueChange={(itemValue) => setTipo(itemValue)}
              enabled={tipoOptions.length > 0}
            >
              <Picker.Item label="Selecione o Tipo de Despesa" value="" />
              {tipoOptions.map((tipoOption, index) => (
                <Picker.Item key={index} label={tipoOption} value={tipoOption} />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Data de Vencimento"
              value={dataVencimento}
              onChangeText={setDataVencimento}
              placeholderTextColor="#888"
              keyboardType="numeric"
              textAlign="center" // Centralizar o texto
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Data de Pagamento"
              value={dataPagamento}
              onChangeText={setDataPagamento}
              placeholderTextColor="#888"
              keyboardType="numeric"
              editable={false}
              textAlign="center" // Centralizar o texto
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Valor"
              value={valor}
              onChangeText={setValor}
              placeholderTextColor="#888"
              keyboardType="numeric"
              textAlign="center" // Centralizar o texto
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Observação"
              value={descricao}
              onChangeText={setDescricao}
              placeholderTextColor="#888"
              textAlign="center" // Centralizar o texto
            />
          </View>

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
    flexGrow: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center', // Centralizar o texto
    width: '100%',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 15,
    alignItems: 'center', // Centralizar o Picker
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    color: '#333',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    color: '#333',
    textAlign: 'center', // Centralizar o texto
  },
  button: {
    backgroundColor: '#007BFF',
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
  secondaryButton: {
    backgroundColor: '#6c757d',
    marginTop: 10,
  },
});

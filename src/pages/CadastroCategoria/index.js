import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CadastroCategoria() {
  const [categoria, setCategoria] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [categoriaOptions, setCategoriaOptions] = useState([]);
  const [modalCategoriaVisible, setModalCategoriaVisible] = useState(false);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return token;
    } catch (error) {
      console.error("Erro ao obter o token: ", error);
      return null;
    }
  };

  const fetchCategorias = async () => {
    try {
      const token = await getToken();
      const response = await axios.get('http://192.168.0.23:3333/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategoriaOptions(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const adicionarNovaCategoria = () => {
    if (novaCategoria.trim() === '') {
      Alert.alert('Erro', 'A categoria não pode estar vazia.');
      return;
    }
    setCategoriaOptions([...categoriaOptions, novaCategoria]);
    setCategoria(novaCategoria);
    setNovaCategoria('');
    setModalCategoriaVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const token = await getToken();
      const data = { name: categoria, user_id: 'user-id-placeholder' }; // Adapte o user_id conforme necessário

      await axios.post('http://192.168.0.23:3333/category', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Sucesso', 'Categoria cadastrada com sucesso!');
      setCategoria('');
    } catch (error) {
      console.error('Erro ao cadastrar categoria:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar a categoria. Tente novamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Preencha os campos abaixo para cadastrar uma categoria!</Text>

        <View style={styles.form}>
          {/* Picker de Categoria */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Categoria"
              value={categoria}
              onChangeText={setCategoria}
              placeholderTextColor="#888"
            />
          </View>

          {/* Botão para adicionar nova categoria */}
          <TouchableOpacity style={styles.addButton} onPress={() => setModalCategoriaVisible(true)}>
            <Text style={styles.addButtonText}>Adicionar Nova Categoria</Text>
          </TouchableOpacity>

          {/* Modal para adicionar nova categoria */}
          <Modal
            visible={modalCategoriaVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalCategoriaVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Nova Categoria</Text>
                <TextInput
                  placeholder="Digite a nova categoria"
                  style={styles.input}
                  value={novaCategoria}
                  onChangeText={setNovaCategoria}
                />
                <TouchableOpacity style={styles.modalButton} onPress={adicionarNovaCategoria}>
                  <Text style={styles.modalButtonText}>Salvar Categoria</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Botão de Salvar */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Cadastrar Categoria</Text>
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
    backgroundColor: '#fff',
  },
  content: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: '#333',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginVertical: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007BFF', // Cor dos botões principais
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007BFF', // Cor do botão de adicionar categoria
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#007BFF', // Cor dos botões no modal
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

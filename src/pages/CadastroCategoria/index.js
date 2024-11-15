import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CadastroCategoria() {
  const [categoria, setCategoria] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [categoriaOptions, setCategoriaOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return token;
    } catch (error) {
      console.error('Erro ao obter o token: ', error);
      return null;
    }
  };

  const fetchCategorias = async () => {
    try {
      const token = await getToken();
      const response = await axios.get('http://192.168.0.23:3333/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategoriaOptions(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const adicionarNovaCategoria = async () => {
    if (novaCategoria.trim() === '') {
      Alert.alert('Erro', 'A categoria não pode estar vazia.');
      return;
    }
    try {
      const token = await getToken();
      const data = { name: novaCategoria };
      await axios.post('http://192.168.0.23:3333/category', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategoriaOptions((prevOptions) => [...prevOptions, { id: Date.now(), name: novaCategoria }]);
      setNovaCategoria('');
      setModalVisible(false);
      Alert.alert('Sucesso', 'Categoria adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar nova categoria:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a categoria.');
    }
  };

  const handleCategoriaSelect = (categoriaSelecionada) => {
    setCategoria(categoriaSelecionada.name);
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    if (categoria.trim() === '') {
      Alert.alert('Erro', 'Selecione ou adicione uma categoria.');
      return;
    }
    try {
      const token = await getToken();
      const data = { name: categoria };
      await axios.post('http://192.168.0.23:3333/category', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Sucesso', 'Categoria cadastrada com sucesso!');
      setCategoria('');
    } catch (error) {
      console.error('Erro ao cadastrar categoria:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar a categoria. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Preencha os campos abaixo para cadastrar uma categoria!</Text>

      <View style={styles.form}>
        {/* Botão para abrir o modal de categorias */}
        <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
          <Text style={styles.inputText}>{categoria || 'Selecionar Categoria'}</Text>
        </TouchableOpacity>

        {/* Modal para seleção e adição de categorias */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione ou Adicione uma Categoria</Text>

              <FlatList
                data={categoriaOptions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => handleCategoriaSelect(item)}
                  >
                    <Text style={styles.listItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />

              <TextInput
                style={styles.input}
                placeholder="Nova Categoria"
                value={novaCategoria}
                onChangeText={setNovaCategoria}
              />
              <TouchableOpacity style={styles.modalButton} onPress={adicionarNovaCategoria}>
                <Text style={styles.modalButtonText}>Adicionar Nova Categoria</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  form: {
    marginVertical: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  inputText: {
    color: '#555',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  listItemText: {
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalCloseButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
});

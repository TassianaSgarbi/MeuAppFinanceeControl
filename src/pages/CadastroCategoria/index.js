import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

export default function CadastroCategoria() {
  const [categoria, setCategoria] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [categoriaOptions, setCategoriaOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [novoNomeCategoria, setNovoNomeCategoria] = useState('');

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Token obtido: ', token);
      return token;
    } catch (error) {
      console.error('Erro ao obter o token: ', error);
      return null;
    }
  };

  const fetchCategorias = async () => {
    try {
      
      const token = await getToken();
      console.log("token:", token)
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        console.log("token deu erro:", token)
        return;
      }

      const response = await axios.get('http://192.168.0.23:3333/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("response do axios:", response)
      console.log('Categorias carregadas: ', response?.data); // Log das categorias carregadas
      setCategoriaOptions(response?.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
    }
  };

  useEffect(() => {
    console.log("Prestes a mexer com categorias")
    fetchCategorias();
  }, []);

  const adicionarNovaCategoria = async () => {
    console.log("Prestes a mexer com categorias")
    if (novaCategoria.trim() === '') {
      Alert.alert('Erro', 'A categoria não pode estar vazia.');
      return;
    }
    try {
      const token = await getToken();
      const data = { name: novaCategoria };
      console.log("Data", data)
      await axios.post('http://192.168.0.23:3333/category', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const optionSelected = (prevOptions) => [...prevOptions, { id: Date.now(), name: novaCategoria }]
      setCategoriaOptions(optionSelected);
      console.log("optionSelected", optionSelected)
      setNovaCategoria('');
      setModalVisible(false);
      Alert.alert('Sucesso', 'Categoria adicionada com sucesso!');
      console.log("Sucesso")
    } catch (error) {
      console.error('Erro ao adicionar nova categoria:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a categoria.');
    }
  };

  const editarCategoria = async () => {
    if (!categoriaSelecionada || novoNomeCategoria.trim() === '') {
      console.log('Sem categoria selecionada, insira um novo nome válido');
      Alert.alert('Erro', 'Selecione uma categoria e insira um novo nome.');
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        return;
      }

      const decodedToken = jwtDecode(token);
      console.log("decodedToken:", decodedToken)
      const user_id = decodedToken?.sub; // O campo 'sub' no token contém o userId

      if (!user_id) {
        Alert.alert('Erro', 'Usuário não encontrado no token. Faça login novamente.');
        console.log("Erro: Usuário não encontrado ")
        return;
      }

      const data = {
        new_name: novoNomeCategoria ?? "",
      };

      const req = await axios.put(`http://192.168.0.23:3333/category/edit?category_id=${categoriaSelecionada?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      
      console.log(req)

      const updatedCategories = categoriaOptions?.map((cat) =>
        cat?.id === categoriaSelecionada.id ? { ...cat, name: novoNomeCategoria } : cat
      );

      console.log("updatedCategories:", updatedCategories)

      setCategoriaOptions(updatedCategories);
      setCategoriaSelecionada(null);
      setNovoNomeCategoria('');
      setModalEditarVisible(false);
      Alert.alert('Sucesso', 'Categoria editada com sucesso!');
    } catch (error) {
      console.error('Erro ao editar categoria:', error);
      Alert.alert('Erro', 'Não foi possível editar a categoria.');
    }
  };

  const excluirCategoria = async () => {
    if (!categoriaSelecionada) {
      Alert.alert('Erro', 'Selecione uma categoria para excluir.');
      console.log('Erro', 'Selecione uma categoria para excluir.');
      return;
    }
  
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        return;
      }

      console.log("Token:", token)
  
      const decodedToken = jwtDecode(token);
      const user_id = decodedToken?.sub; // O campo 'sub' no token contém o userId
  
      if (!user_id) {
        Alert.alert('Erro', 'Usuário não encontrado no token. Faça login novamente.');
        return;
      }

      console.log("Categoria selecionada:", categoriaSelecionada?.id)
  
      await axios.delete(`http://192.168.0.23:3333/delete-category?category_id=${categoriaSelecionada?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setCategoriaOptions((prevOptions) =>
        prevOptions.filter((cat) => cat.id !== categoriaSelecionada.id)
      );
      setCategoriaSelecionada(null);
      setModalExcluirVisible(false);
      Alert.alert('Sucesso', 'Categoria excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      Alert.alert('Erro', 'Não foi possível excluir a categoria.');
    }
  };
  const handleCategoriaSelect = (categoriaSelecionada) => {
    setCategoria(categoriaSelecionada.name);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Preencha os campos abaixo para cadastrar uma categoria!</Text>

      <View style={styles.form}>
        <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
          <Text style={styles.inputText}>{categoria || 'Selecionar Categoria'}</Text>
        </TouchableOpacity>

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
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalEditarVisible(true)}>
                <Text style={styles.modalButtonText}>Editar Categoria</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalExcluirVisible(true)}>
                <Text style={styles.modalButtonText}>Excluir Categoria</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para editar categoria */}
        <Modal
          visible={modalEditarVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalEditarVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Categoria</Text>

              <FlatList
                data={categoriaOptions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => setCategoriaSelecionada(item)}
                  >
                    <Text style={styles.listItemText}>
                      {item.name} {categoriaSelecionada?.id === item.id && '(Selecionada)'}
                    </Text>
                  </TouchableOpacity>
                )}
              />

              <TextInput
                style={styles.input}
                placeholder="Novo Nome da Categoria"
                value={novoNomeCategoria}
                onChangeText={setNovoNomeCategoria}
              />
              <TouchableOpacity style={styles.modalButton} onPress={editarCategoria}>
                <Text style={styles.modalButtonText}>Salvar Alterações</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalEditarVisible(false)}>
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para excluir categoria */}
        <Modal
          visible={modalExcluirVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalExcluirVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Excluir Categoria</Text>

              <FlatList
                data={categoriaOptions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => setCategoriaSelecionada(item)}
                  >
                    <Text style={styles.listItemText}>
                      {item.name} {categoriaSelecionada?.id === item.id && '(Selecionada)'}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.modalButton} onPress={excluirCategoria}>
                <Text style={styles.modalButtonText}>Excluir Categoria</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalExcluirVisible(false)}>
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
  flatListContent: {
    maxHeight: 300, // Defina uma altura máxima para a lista de categorias
    paddingBottom: 20, // Espaço extra para rolagem
  },
});

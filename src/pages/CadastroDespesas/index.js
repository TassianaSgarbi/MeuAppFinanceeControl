import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function CadastroDespesas() {
  // Estados para os campos de despesa
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [dataPagamento, setDataPagamento] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');

  // Estados para as opções de categorias e tipos
  const [categoriaOptions, setCategoriaOptions] = useState([]);
  const [tipoOptions, setTipoOptions] = useState([]);

  // Estados para modais
  const [modalTipoVisible, setModalTipoVisible] = useState(false);
  const [novoTipo, setNovoTipo] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [campoDataAtual, setCampoDataAtual] = useState(null);

  // Função para obter o token armazenado
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return token;
    } catch (error) {
      console.error("Erro ao obter o token:", error);
      return null;
    }
  };

  // Função para buscar categorias do backend
  const fetchCategorias = async () => {
    try {
      const token = await getToken();
      const response = await axios.get('http://192.168.0.23:3333/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategoriaOptions(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as categorias. Tente novamente.');
    }
  };

  // Função para buscar tipos de despesa do backend
  const fetchTiposDespesas = async () => {
    try {
      const token = await getToken();
      const response = await axios.get('http://192.168.0.23:3333/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTipoOptions(response.data);
    } catch (error) {
      console.error('Erro ao buscar tipos de despesa:', error);
      Alert.alert('Erro', 'Não foi possível carregar os tipos de despesa. Tente novamente.');
    }
  };

  // useEffect para buscar categorias e tipos ao montar o componente
  useEffect(() => {
    fetchCategorias();
    fetchTiposDespesas();
  }, []);

  // Função para adicionar um novo tipo de despesa
  const adicionarNovoTipo = () => {
    if (novoTipo.trim() === '') {
      Alert.alert('Erro', 'O tipo de despesa não pode estar vazio.');
      return;
    }
    // Adicionando o novo tipo à lista de opções
  const novoTipoObjeto = { id: novoTipo, description: novoTipo }; // Adicionando um objeto com 'id' e 'description'
  setTipoOptions([...tipoOptions, novoTipoObjeto]);

  // Definindo o tipo selecionado para o novo tipo
  setTipo(novoTipoObjeto.id);

  setNovoTipo('');
  setModalTipoVisible(false);
};

  // Função para submeter o formulário de cadastro de despesa

  const handleSubmit = async () => {
    if (!categoria || !tipo || !dataVencimento || !dataPagamento || !valor || !descricao) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
  
    try {
      const token = await getToken();
  
      // Dados para envio ao backend
      const data = {
        description: tipo, // Enviando 'tipo' como 'description'
        amount: parseFloat(valor), // Convertendo valor para número
        due_date: dataVencimento,
        category_id: categoria, // Alinhado com o backend
        observation: descricao, // Incluindo descrição no backend
      };
  
      console.log('Dados a serem enviados:', data);
  
      // Corrigindo o acesso à resposta
      const response = await axios.post('http://192.168.0.23:3333/expense', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('Resposta do backend:', response.data);
  
      Alert.alert('Sucesso', 'Despesa cadastrada com sucesso!');
      // Limpar os campos após o cadastro
      setCategoria('');
      setTipo('');
      setDataVencimento('');
      setDataPagamento('');
      setValor('');
      setDescricao('');
    } catch (error) {
      console.error('Erro ao cadastrar despesa:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível cadastrar a despesa. Tente novamente.');
    }
  };

  // Função para confirmar a data selecionada
  const handleDateConfirm = (date) => {
    const dataFormatada = date.toISOString().split('T')[0]; // Formato "YYYY-MM-DD"
    if (campoDataAtual === 'vencimento') {
      setDataVencimento(dataFormatada);
    } else if (campoDataAtual === 'pagamento') {
      setDataPagamento(dataFormatada);
    }
    setDatePickerVisible(false);
    setCampoDataAtual(null);
  };

  // Função para abrir o date picker para o campo específico
  const abrirDatePicker = (campo) => {
    setCampoDataAtual(campo);
    setDatePickerVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Preencha os campos abaixo para cadastrar sua despesa!</Text>

        <View style={styles.form}>
          {/* Picker de Categoria */}
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={categoria}
              style={styles.picker}
              onValueChange={(itemValue) => setCategoria(itemValue)}
            >
              <Picker.Item label="Selecione a Categoria" value="" />
              {categoriaOptions.map((cat) => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
              ))}
            </Picker>
          </View>

          {/* Picker de Tipo de Despesa */}
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={tipo}
              style={styles.picker}
              onValueChange={(itemValue) => setTipo(itemValue)}
            >
              <Picker.Item label="Selecione o Tipo de Despesa" value="" />
              {tipoOptions.map((tipoOption, index) => (
             <Picker.Item key={tipoOption.id} label={tipoOption.description} value={tipoOption.description} />
              ))}
            </Picker>
          </View>

          {/* Botão para adicionar novo tipo de despesa */}
          <TouchableOpacity style={styles.addButton} onPress={() => setModalTipoVisible(true)}>
            <Text style={styles.addButtonText}>Adicionar Tipo de Despesa</Text>
          </TouchableOpacity>

          {/* Modal para adicionar novo tipo de despesa */}
          <Modal
            visible={modalTipoVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalTipoVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Novo Tipo de Despesa</Text>
                <TextInput
                  placeholder="Digite o novo tipo de despesa"
                  style={styles.input}
                  value={novoTipo}
                  onChangeText={setNovoTipo}
                />
                <TouchableOpacity style={styles.modalButton} onPress={adicionarNovoTipo}>
                  <Text style={styles.modalButtonText}>Salvar Tipo de Despesa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Data de Vencimento */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => abrirDatePicker('vencimento')}>
              <TextInput
                style={styles.input}
                placeholder="Data de Vencimento"
                value={dataVencimento}
                editable={false}
                placeholderTextColor="#888"
                textAlign="center"
              />
            </TouchableOpacity>
          </View>

          {/* Data de Pagamento (inativo, não obrigatório) */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => abrirDatePicker('pagamento')}>
              <TextInput
                style={styles.input}
                placeholder="Data de Pagamento"
                value={dataPagamento}
                editable={false}
                placeholderTextColor="#888"
                textAlign="center"
              />
            </TouchableOpacity>
          </View>

          
          {/* Valor */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Valor"
              value={valor}
              onChangeText={setValor}
              placeholderTextColor="#888"
              keyboardType="numeric"
              textAlign="center"
            />
          </View>

          {/* Descrição */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              placeholderTextColor="#888"
              textAlign="center"
            />
          </View>

          {/* Botão de Salvar */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Cadastrar Despesa</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisible(false)}
      />
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
  picker: {
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
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
    backgroundColor: '#007BFF', // Cor do botão de adicionar categoria e tipo de despesa
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
  modalInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#007BFF', // Cor dos botões no modal
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  modalCancelButton: {
    backgroundColor: '#007BFF', // Cor do botão Cancelar no modal
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

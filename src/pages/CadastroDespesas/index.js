import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Importar o DateTimePickerModal
import moment from 'moment'; // Usar para formatar a data

export default function CadastroDespesas() {
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [dataPagamento, setDataPagamento] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaOptions, setCategoriaOptions] = useState([]);
  const [tipoOptions, setTipoOptions] = useState([]);
  const [modalCategoriaVisible, setModalCategoriaVisible] = useState(false);
  const [modalTipoVisible, setModalTipoVisible] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [novoTipo, setNovoTipo] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); // Para controlar a visibilidade do calendário
  const [selectedDate, setSelectedDate] = useState(''); // Armazenar a data selecionada

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

  const adicionarNovoTipo = () => {
    if (novoTipo.trim() === '') {
      Alert.alert('Erro', 'O tipo de despesa não pode estar vazio.');
      return;
    }
    setTipoOptions([...tipoOptions, novoTipo]);
    setTipo(novoTipo);
    setNovoTipo('');
    setModalTipoVisible(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(moment(date).format('DD/MM/YYYY')); // Formatar a data no formato desejado
    setDatePickerVisible(false);
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
          {/* Picker de Categoria */}
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={categoria}
              style={styles.picker}
              onValueChange={(itemValue) => updateTipoDespesas(itemValue)}
            >
              <Picker.Item label="Selecione a Categoria" value="" />
              {categoriaOptions.map((cat, index) => (
                <Picker.Item key={index} label={cat} value={cat} />
              ))}
            </Picker>
          </View>

          {/* Botão para adicionar nova categoria */}
          <TouchableOpacity style={styles.addButton} onPress={() => setModalCategoriaVisible(true)}>
            <Text style={styles.addButtonText}>Adicionar Categoria</Text>
          </TouchableOpacity>

          {/* Picker de Tipo de Despesa */}
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

          {/* Botão para adicionar novo tipo de despesa */}
          <TouchableOpacity style={styles.addButton} onPress={() => setModalTipoVisible(true)}>
            <Text style={styles.addButtonText}>Adicionar Tipo de Despesa</Text>
          </TouchableOpacity>

          {/* Modal para adicionar nova categoria */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalCategoriaVisible}
            onRequestClose={() => setModalCategoriaVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Nova Categoria</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Digite a nova categoria"
                  value={novaCategoria}
                  onChangeText={setNovaCategoria}
                />
                <TouchableOpacity style={styles.modalButton} onPress={adicionarNovaCategoria}>
                  <Text style={styles.modalButtonText}>Adicionar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalCategoriaVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Modal para adicionar novo tipo de despesa */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalTipoVisible}
            onRequestClose={() => setModalTipoVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Novo Tipo de Despesa</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Digite o novo tipo de despesa"
                  value={novoTipo}
                  onChangeText={setNovoTipo}
                />
                <TouchableOpacity style={styles.modalButton} onPress={adicionarNovoTipo}>
                  <Text style={styles.modalButtonText}>Adicionar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalTipoVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Data de Vencimento */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
              <TextInput
                style={styles.input}
                placeholder="Data de Vencimento"
                value={dataVencimento || selectedDate}
                editable={false}
                placeholderTextColor="#888"
                textAlign="center"
              />
            </TouchableOpacity>
          </View>

          {/* Data de Pagamento */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Data de Pagamento"
              value={dataPagamento}
              onChangeText={setDataPagamento}
              placeholderTextColor="#888"
              keyboardType="numeric"
              editable={false}
              textAlign="center"
            />
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

          {/* Observação */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Observação"
              value={descricao}
              onChangeText={setDescricao}
              placeholderTextColor="#888"
              textAlign="center"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* DatePicker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisible(false)}
        date={new Date()}
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

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ConsultarDespesas() {
  const [despesas, setDespesas] = useState([]); // Estado para todas as despesas
  const [despesasFiltradas, setDespesasFiltradas] = useState([]); // Estado para despesas filtradas
  const [categorias, setCategorias] = useState([]); // Estado para armazenar as categorias
  const [selectedCategory, setSelectedCategory] = useState('todas'); // Categoria selecionada, com valor inicial "todas"
  const [showModalCategoria, setShowModalCategoria] = useState(false); // Controle do modal de categoria
  const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false); // State for DateTimePicker modal visibility
  const [selectedDate, setSelectedDate] = useState(new Date());


  // UseEffect para buscar despesas e categorias
  useEffect(() => {
    fetchDespesas();
    fetchCategorias();
  }, []);

  // Função para buscar todas as despesas no backend
  const fetchDespesas = async () => {
    try {
      const response = await axios.get('http://192.168.0.23:3333/expenses');
      setDespesas(response.data); // Atualiza o estado com todas as despesas
      setDespesasFiltradas(response.data); // Inicialmente, exibe todas as despesas
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as despesas.');
    }
  };

  // Função para buscar as categorias no backend
  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://192.168.0.23:3333/categories');
      setCategorias(response.data); // Atualiza o estado com as categorias
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
    }
  };

  // Função para encontrar o nome da categoria pelo ID
  const getCategoriaNome = (categoryId) => {
    const categoria = categorias.find(cat => cat.id === categoryId);
    return categoria ? categoria.name : 'Categoria não encontrada'; // Retorna o nome da categoria ou um valor padrão
  };

  // Função para filtrar despesas por categoria
  const filtrarPorCategoria = () => {
    if (selectedCategory === 'todas') {
      // Se a categoria selecionada for "todas", exibe todas as despesas
      setDespesasFiltradas(despesas);
    } else {
      // Filtra as despesas com base na categoria selecionada
      const despesasFiltradas = despesas.filter(despesa => despesa.categoryId === selectedCategory);
      setDespesasFiltradas(despesasFiltradas); // Atualiza as despesas filtradas
    }
    setShowModalCategoria(false); // Fecha o modal após a seleção
  };

  
  const handleSelecionarData = (id) => {
    setSelectedExpenseId(id);
    setShowDatePicker(true);
  };

  const handleMarcarComoPago = async () => {
    if (!selectedDate || !selectedExpenseId) {
      Alert.alert('Erro', 'Por favor, selecione uma data e uma despesa.');
      return;
    }

    try {
      await axios.put(`http://192.168.0.23:3333/expense/status?expense_id=${selectedExpenseId}`, {
        date: selectedDate.toISOString(),
      });

      setDespesas((prevDespesas) =>
        prevDespesas.map((despesa) =>
          despesa.id === selectedExpenseId ? { ...despesa, status: true, payment_date: selectedDate.toISOString() } : despesa
        )
      );

      setDespesasFiltradas((prevDespesasFiltradas) =>
        prevDespesasFiltradas.map((despesa) =>
          despesa.id === selectedExpenseId ? { ...despesa, status: true, payment_date: selectedDate.toISOString() } : despesa
        )
      );

      Alert.alert('Sucesso', 'Despesa marcada como paga!');
      setShowConfirmPaymentModal(false);
    } catch (error) {
      console.error('Erro ao marcar despesa como paga:', error);
      Alert.alert('Erro', 'Não foi possível marcar a despesa como paga.');
    }
  };

  const cancelarPagamento = () => {
    setShowConfirmPaymentModal(false);
    setShowDatePicker(false);
  };

  const excluirDespesa = async (id) => {
    try {
      await axios.delete(`http://192.168.0.23:3333/delete-expense?expense_id=${id}`);
      fetchDespesas();
      Alert.alert('Sucesso', 'Despesa excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
      Alert.alert('Erro', 'Não foi possível excluir a despesa.');
    }
  };

  const handleExcluirDespesa = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja excluir esta despesa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: () => excluirDespesa(id) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Botões de consulta */}
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowModalCategoria(true)}>
          <Text style={styles.filterButtonText}>Consultar por Categoria</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para selecionar categoria */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={showModalCategoria}
        onRequestClose={() => setShowModalCategoria(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione uma Categoria</Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione uma categoria" value="todas" />
              {categorias.map((categoria) => (
                <Picker.Item key={categoria.id} label={categoria.name} value={categoria.id} />
              ))}
            </Picker>
            <TouchableOpacity style={styles.button} onPress={filtrarPorCategoria}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Exibe as despesas ou uma mensagem caso não haja resultados */}
      <FlatList
        data={despesasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.despesaContainer}>
            <Text style={styles.despesaText}>Categoria: {getCategoriaNome(item.categoryId)}</Text>
            <Text style={styles.despesaText}>Descrição: {item.description}</Text>
            <Text style={styles.despesaText}>Valor: R$ {item.amount}</Text>
            <Text style={styles.despesaText}>Vencimento: {item.due_date}</Text>
            <Text style={styles.despesaText}>Observação: {item.observation}</Text>
            <Text style={styles.despesaText}>Status: {item.status ? 'Pago' : 'Pendente'}</Text>
            {item.status && item.payment_date && (
              <Text style={styles.despesaText}>Pagamento: {new Date(item.payment_date).toLocaleDateString()}</Text>
            )}
            <View style={styles.buttonContainer}>
              {!item.status && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSelecionarData(item.id)}
                >
                  <Text style={styles.buttonText}>Selecionar Data</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.button2}
                onPress={() => handleExcluirDespesa(item.id)}
              >
                <Text style={styles.buttonText2}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal de DatePicker */}
      {showDatePicker && (
        <Modal transparent={true} animationType="slide" visible={showDatePicker}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione a Data</Text>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="calendar"
                onChange={(event, date) => {
                  if (event.type === "set" && date) {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                    setShowConfirmPaymentModal(true);
                  } else {
                    setShowDatePicker(false);
                  }
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Modal de Confirmação */}
      {showConfirmPaymentModal && (
        <Modal transparent={true} animationType="slide" visible={showConfirmPaymentModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmar Pagamento</Text>
              <Text>Deseja confirmar o pagamento desta despesa?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleMarcarComoPago}>
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button2} onPress={cancelarPagamento}>
                  <Text style={styles.buttonText2}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  despesaContainer: { marginBottom: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10 },
  despesaText: { fontSize: 16, marginBottom: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  button: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontSize: 16,textAlign: 'center', },
  button2: { backgroundColor: '#f44336', padding: 10, borderRadius: 5 },
  buttonText2: { color: '#fff', fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: 300 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  filterButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Definindo a largura do botão
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  
});
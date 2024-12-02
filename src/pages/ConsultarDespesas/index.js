import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ConsultarDespesas() {
  const [despesas, setDespesas] = useState([]);
  const [despesasFiltradas, setDespesasFiltradas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  useEffect(() => {
    fetchDespesas();
    fetchCategorias();
  }, []);

  const fetchDespesas = async () => {
    try {
      const response = await axios.get('http://192.168.0.23:3333/expenses');
      setDespesas(response.data);
      setDespesasFiltradas(response.data);
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as despesas.');
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://192.168.0.23:3333/categories');
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
    }
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
      <FlatList
        data={despesasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.despesaContainer}>
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
  container: { flex: 1, padding: 20 },
  despesaContainer: { marginBottom: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10 },
  despesaText: { fontSize: 16, marginBottom: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  button: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontSize: 16 },
  button2: { backgroundColor: '#f44336', padding: 10, borderRadius: 5 },
  buttonText2: { color: '#fff', fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: 300 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});

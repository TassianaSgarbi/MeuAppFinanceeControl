import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';


export default function ConsultarDespesas() {
  const [despesas, setDespesas] = useState([]); // Estado para todas as despesas
  const [despesasFiltradas, setDespesasFiltradas] = useState([]); // Estado para despesas filtradas
  const [categorias, setCategorias] = useState([]); // Estado para armazenar as categorias
  const [selectedCategory, setSelectedCategory] = useState('todas'); // Categoria selecionada, com valor inicial "todas"
  const [selectedDespesa, setSelectedDespesa] = useState(null); // Estado para a despesa selecionada
  const [showModalCategoria, setShowModalCategoria] = useState(false); // Controle do modal de categoria
  const [showModalDespesa, setShowModalDespesa] = useState(false); // Controle do modal de despesa
  const [paymentDate, setPaymentDate] = useState(''); // Estado para a data de pagamento

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
      setDespesasFiltradas(despesas);
    } else {
      const despesasFiltradas = despesas.filter(despesa => despesa.categoryId === selectedCategory);
      setDespesasFiltradas(despesasFiltradas);
    }
    setShowModalCategoria(false);
  };

  // Função para filtrar despesas por nome
  const filtrarPorDespesa = () => {
    if (selectedDespesa === 'todas' || selectedDespesa === null) {
      // Se nenhuma despesa for selecionada, exibe todas as despesas
      setDespesasFiltradas(despesas);
    } else {
      // Filtra as despesas pela descrição da despesa
      const despesasFiltradas = despesas.filter(despesa => despesa.description === selectedDespesa.description);
      setDespesasFiltradas(despesasFiltradas); // Atualiza as despesas filtradas
    }
    setShowModalDespesa(false); // Fecha o modal após a seleção
  };

  // Função para lidar com o pagamento
  const handlePagar = (id) => {
    if (!paymentDate) {
      Alert.alert('Erro', 'Por favor, insira a data de pagamento');
      return;
    }

    Alert.alert(
      'Confirmar Pagamento',
      'Tem certeza que deseja marcar essa despesa como paga?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Pagar', onPress: () => pagarDespesa(id) },
      ]
    );
  };

  // Função para pagar a despesa
  const pagarDespesa = async (id) => {
    try {
      // Verifica se a data de pagamento foi preenchida
      if (!paymentDate) {
        Alert.alert('Erro', 'Por favor, insira a data de pagamento');
        return;
      }
  
      // Converte a string de data para um objeto Date
      console.log(paymentDate)
  
      // Formatar a data de pagamento para o formato "YYYY-MM-DD"
      // const formattedPaymentDate = parsedPaymentDate.toISOString().split('T')[0]; // Formato "YYYY-MM-DD"
      // console.log(formattedPaymentDate)
      // Envia a solicitação para o backend, incluindo a data de pagamento no formato correto
      await axios.put(`http://192.168.0.23:3333/expense/status?expense_id=${id}`, {
        payment_date: paymentDate, // Envia a data de pagamento formatada
      });
  
      // Atualiza a lista de despesas com a nova data de pagamento
      setDespesas((prevDespesas) =>
        prevDespesas.map((despesa) =>
          despesa.id === id ? { ...despesa, status: true, payment_date: formattedPaymentDate } : despesa
        )
      );
  
      // Exibe alerta de sucesso
      Alert.alert('Sucesso', 'Despesa marcada como paga!');
      
      // Limpa o campo de data e fecha o DatePicker
      setPaymentDate('');
      setDatePickerVisible(false); // Fecha o DatePicker após a ação
  
    } catch (error) {
      console.error('Erro ao pagar despesa:', error);
      Alert.alert('Erro', 'Não foi possível marcar a despesa como paga.');
    }
  };
  
  // Função para lidar com a exclusão
  const handleExcluir = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir essa despesa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: () => excluirDespesa(id) },
      ]
    );
  };

  // Função para excluir a despesa
  const excluirDespesa = async (id) => {
    try {
      await axios.delete(`http://192.168.0.23:3333/delete-expense?expense_id=${id}`);
      fetchDespesas(); // Atualiza a lista de despesas após exclusão
      Alert.alert('Sucesso', 'Despesa excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
      Alert.alert('Erro', 'Não foi possível excluir a despesa.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowModalCategoria(true)}>
          <Text style={styles.filterButtonText}>Consultar por Categoria</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowModalDespesa(true)}>
          <Text style={styles.filterButtonText}>Consultar por Despesa</Text>
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

      {/* Modal para selecionar despesa */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={showModalDespesa}
        onRequestClose={() => setShowModalDespesa(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione uma Despesa</Text>
            <FlatList
              data={despesas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.despesaItem}
                  onPress={() => setSelectedDespesa(item)}
                >
                  <Text style={styles.despesaItemText}>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.button} onPress={filtrarPorDespesa}>
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
            <Text style={styles.despesaText}>Data Vencimento: {item.due_date}</Text>
            <Text style={styles.despesaText}>Status: {item.status ? 'Pago' : 'Não Pago'}</Text>
            <Text style={styles.despesaText}>
              Data Pagamento: {item.payment_date ||'' }
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Data de pagamento"
              value={paymentDate}
              onChangeText={setPaymentDate}
              keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
              {!item.status && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handlePagar(item.id)}
                >
                  <Text style={styles.buttonText}>Marcar como Paga</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.button2}
                onPress={() => handleExcluir(item.id)}
              >
                <Text style={styles.buttonText2}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        ListEmptyComponent={<Text>Não há despesas para exibir</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: '#0066CC',
    padding: 10,
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    height: 50,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10, // Adiciona espaço abaixo do botão
  },
  
  button2: {
    backgroundColor: '#FF0000', 
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10, // Adiciona espaço abaixo do botão
  },
  
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  
  buttonText2: {
    color: '#fff',
    textAlign: 'center',
  },

  despesaContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  despesaText: {
    fontSize: 14,
    marginVertical: 2,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  despesaItem: {
    padding: 10,
  },
  despesaItemText: {
    fontSize: 16,
  },
 
});
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from 'react-native';
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
    if (!selectedDespesa || selectedDespesa === 'todas') {
      setDespesasFiltradas(despesas); // Exibe todas se nenhuma for selecionada
    } else {
      // Filtra todas as despesas que possuem a descrição selecionada
      const despesasFiltradas = despesas.filter(despesa => despesa.description === selectedDespesa);
      setDespesasFiltradas(despesasFiltradas);
    }
    setShowModalDespesa(false); // Fecha o modal
  };

  // Função para lidar com o pagamento
  const handlePagar = (id) => {
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
      // Obtém a data atual em formato ISO
      const paymentDate = new Date().toISOString();
  
      // Envia a solicitação para o backend para atualizar o status da despesa
      const response = await axios.put(`http://192.168.0.23:3333/expense/status?expense_id=${id}`, {
        date: paymentDate, // Alterado para "date"
      });
  
      // Atualiza o estado local imediatamente com a resposta do backend
      setDespesas((prevDespesas) =>
        prevDespesas.map((despesa) =>
          despesa.id === id ? { ...despesa, status: true, payment_date: paymentDate } : despesa
        )
      );
  
      setDespesasFiltradas((prevDespesasFiltradas) =>
        prevDespesasFiltradas.map((despesa) =>
          despesa.id === id ? { ...despesa, status: true, payment_date: paymentDate } : despesa
        )
      );
  
      // Exibe alerta de sucesso
      Alert.alert('Sucesso', 'Despesa marcada como paga!');
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
                  data={[...new Set(despesas.map(item => item.description))]} // Remove duplicatas
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.despesaItem}
                      onPress={() => setSelectedDespesa(item)} // Define a descrição selecionada
                    >
                      <Text style={styles.despesaItemText}>{item}</Text>
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
      
      {/* Exibe o Status da Despesa */}
      <Text style={styles.despesaText}>
        Status: {item.status ? 'Pago' : 'Pendente'}
      </Text>
      
      {/* Exibe a Data de Pagamento caso a despesa tenha sido paga */}
      {item.status && item.payment_date && (
        <Text style={styles.despesaText}>
          Data Pagamento: {new Date(item.payment_date).toLocaleDateString()}
        </Text>
      )}
      
      <View style={styles.buttonContainer}>
        {!item.status && (
          <TouchableOpacity style={styles.button} onPress={() => handlePagar(item.id)}>
            <Text style={styles.buttonText}>Marcar como Pago</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button2} onPress={() => handleExcluir(item.id)}>
          <Text style={styles.buttonText2}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  )}
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
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
      // Se a categoria selecionada for "todas", exibe todas as despesas
      setDespesasFiltradas(despesas);
    } else {
      // Filtra as despesas com base na categoria selecionada
      const despesasFiltradas = despesas.filter(despesa => despesa.categoryId === selectedCategory);
      setDespesasFiltradas(despesasFiltradas); // Atualiza as despesas filtradas
    }
    setShowModalCategoria(false); // Fecha o modal após a seleção
  };

  // Função para filtrar despesas por nome
  const filtrarPorDespesa = () => {
    if (!selectedDespesa === 'todas') {
      // Se nenhuma despesa for selecionada, exibe todas as despesas
      setDespesasFiltradas(despesas);
    } else {
      // Filtra a despesa selecionada
      const despesasFiltradas = despesas.filter(despesa => despesa.id === selectedDespesa.id);
      setDespesasFiltradas(despesasFiltradas); // Atualiza as despesas filtradas
    }
    setShowModalDespesa(false); // Fecha o modal após a seleção
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
    // Envia a solicitação para o backend para marcar a despesa como paga
    await axios.put(`http://192.168.0.23:3333/expense/status?expense_id=${id}`);

    // Atualiza o estado local, alterando o status da despesa para "Pago"
    setDespesas((prevDespesas) => 
      prevDespesas.map((despesa) =>
        despesa.id === id ? { ...despesa, status: true } : despesa
      )
    );

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
        {/* Botões de consulta */}
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

      <View style={styles.content}>
        <Text style={styles.subtitle}>Consulte suas Despesas Cadastradas!</Text>

        {/* Exibe as despesas ou uma mensagem caso não haja resultados */}
        <FlatList
          data={despesasFiltradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.despesaContainer}>
              <Text style={styles.despesaText}>Descrição: {item.description}</Text>
              <Text style={styles.despesaText}>Valor: R$ {item.amount}</Text>
              <Text style={styles.despesaText}>Status: {item.status ? 'Pago' : 'Não Pago'}</Text>
              <Text style={styles.despesaText}>Categoria: {getCategoriaNome(item.categoryId)}</Text>

              {/* Botões de Pagar e Excluir */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handlePagar(item.id)}
                >
                  <Text style={styles.buttonText}>Pagar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => handleExcluir(item.id)}
                >
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma despesa encontrada.</Text>}
        />
      </View>
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
  filterButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  despesaContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  despesaText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
   secondaryButton: {
      backgroundColor: '#DC3545',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 0,  // Garantindo que o botão Excluir ocupe o mesmo espaço
      marginLeft: 10, 
   },
   button: {
    backgroundColor: '#28A745',
    paddingVertical: 12, // Aumentando o padding para garantir que o botão fique maior
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10, // Garantindo espaçamento do topo
    flex: 0, // Evitar que o botão ocupe muito espaço
  },

    buttonText: {
      color: '#fff',
      fontSize: 14,
      textAlign: 'center',
    },

    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparência
      padding: 20, // Adicionando padding ao redor do modal
    },


  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%', // Ajuste o tamanho conforme necessário
    maxHeight: '80%', // Evitar que o modal ocupe o espaço excessivo
    justifyContent: 'space-between', // Para distribuir os elementos
    flexDirection: 'column', // Garantir que os itens sejam empilhados verticalmente
  },

  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15, // Adicionando espaço entre o picker e o botão
  },
  despesaItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  despesaItemText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
});

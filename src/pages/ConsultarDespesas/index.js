import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function ConsultarDespesas() {
  const [despesas, setDespesas] = useState([]);
  const [categorias, setCategorias] = useState([]); // Estado para armazenar as categorias

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
      <View style={styles.content}>
        <Text style={styles.subtitle}>Consulte suas Despesas Cadastradas!</Text>

        {/* Exibe as despesas ou uma mensagem caso não haja resultados */}
        <FlatList
          data={despesas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.despesaContainer}>
              <Text style={styles.despesaText}>Descrição: {item.description}</Text>
              <Text style={styles.despesaText}>Valor: R$ {item.amount}</Text>
              <Text style={styles.despesaText}>Status: {item.status ? 'Pago' : 'Não Pago'}</Text>
              <Text style={styles.despesaText}>Categoria: {getCategoriaNome(item.categoryId)}</Text> {/* Exibe a categoria */}

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
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma despesa encontrada.</Text>} // Certifique-se de que a string está dentro de <Text>
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
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

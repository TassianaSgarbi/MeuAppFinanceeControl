import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Dimensions, ScrollView, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const menuWidth = screenWidth * 0.5; // Largura do menu é metade da tela

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(-menuWidth)); // Animação de deslize
  const [logoutTimer, setLogoutTimer] = useState(null); // Estado para o temporizador
  const navigation = useNavigation();

  const [despesas, setDespesas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const fetchDespesas = async () => {
    try {
      const response = await axios.get('http://192.168.0.23:3333/expenses');
      setDespesas(response.data);
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

  useEffect(() => {
    fetchDespesas();
    fetchCategorias();

    const interval = setInterval(() => {
      fetchDespesas();
    }, 5000); // Atualizar a cada 5 segundos

    return () => clearInterval(interval); // Limpar o intervalo quando o componente for desmontado
  }, []);

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(menuAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: -menuWidth,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMenuVisible(false));  // Fechar o menu após animação
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      console.log("Usuário deslogado com sucesso");
      navigation.navigate('Login');
    } catch (error) {
      console.error("Erro ao deslogar:", error);
      Alert.alert('Erro', 'Não foi possível deslogar. Tente novamente.');
    }
  };

  // Função para reiniciar o temporizador
  const resetLogoutTimer = () => {
    // Limpar o temporizador anterior, se houver
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }

    // Iniciar um novo temporizador
    const timer = setTimeout(() => {
      Alert.alert(
        'Sessão expirada',
        'Você ficou inativo por muito tempo. Sua sessão será encerrada.',
        [
          {
            text: 'OK',
            onPress: () => logout(),
          },
        ]
      );
    }, 1800000);

    setLogoutTimer(timer); // Salva o temporizador no estado
  };

  const getCategoriaNome = (categoryId) => {
    const categoria = categorias.find(cat => cat.id === categoryId);
    return categoria ? categoria.name : 'Categoria não encontrada';
  };

  const getChartData = () => {
    const categoryExpenses = categorias.map((categoria) => {
      const total = despesas
        .filter((despesa) => despesa.categoryId === categoria.id)
        .reduce((acc, curr) => acc + curr.amount, 0);
      return { category: categoria.name, total };
    });

    const labels = categoryExpenses.map((item) => item.category);
    const data = categoryExpenses.map((item) => item.total);

    return { labels, data };
  };

  const getPieData = () => {
    return categorias.map((categoria) => {
      const total = despesas
        .filter((despesa) => despesa.categoryId === categoria.id)
        .reduce((acc, curr) => acc + curr.amount, 0);
      return {
        name: categoria.name,
        amount: total,
        color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
        legendFontColor: '#000',
        legendFontSize: 12,
      };
    });
  };

  const chartData = getChartData();
  const pieData = getPieData();

  return (
    <View style={{ flex: 1 }} onTouchStart={resetLogoutTimer}>
      <View style={styles.headerGradient}>
        <TouchableOpacity onPress={openMenu}>
          <Feather name="menu" size={24} color="#fff" style={styles.menuIcon} />
        </TouchableOpacity>
      </View>

      <Modal visible={menuVisible} transparent animationType="none">
        <TouchableOpacity style={styles.modalOverlay} onPress={closeMenu}>
          <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuAnimation }] }]}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); navigation.navigate('CadastroCategoria'); }}>
              <Text style={styles.menuItemText}>Cadastrar Categoria</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); navigation.navigate('CadastroDespesas'); }}>
              <Text style={styles.menuItemText}>Cadastrar Despesas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); navigation.navigate('ConsultarDespesas'); }}>
              <Text style={styles.menuItemText}>Consultar Despesas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); navigation.navigate('AlterarDados'); }}>
              <Text style={styles.menuItemText}>Alterar Dados</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); navigation.navigate('Chatbot'); }}>
              <Text style={styles.menuItemText}>Chatbot</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); navigation.navigate('InformacoesApp'); }}>
              <Text style={styles.menuItemText}>Informações do APP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); logout(); }}>
              <Text style={styles.menuItemText}>Sair do Sistema</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeMenu}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Conteúdo da tela */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Despesas por Categoria em R$</Text>
          <BarChart
            data={{
              labels: chartData.labels,
              datasets: [{ data: chartData.data }],
            }}
            width={screenWidth - 40}
            height={260}
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { paddingLeft: 20, paddingRight: 20 },
            }}
            verticalLabelRotation={0}
            style={{ marginBottom: 20 }}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Distribuição de Gastos em %</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>
          {/* Renderização da Tabela */}
          <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Mês</Text>
            <Text style={styles.headerCell}>Total Despesa</Text>
          </View>

          {/* Lista de meses de 01/2024 a 12/2024 */}
          {Array.from({ length: 12 }, (_, index) => {
            const month = String(index + 1).padStart(2, '0'); // Garante que o mês tenha 2 dígitos
            const year = '2024';
            const monthYear = `${month}/${year}`;

            // Filtra as despesas que correspondem a esse mês/ano
            const monthExpenses = despesas.filter((item) => {
              const [day, itemMonth, itemYear] = item.due_date.split('/');
              return itemMonth === month && itemYear === year;
            });

            // Calcula o total de despesas para esse mês
            const totalAmount = monthExpenses.reduce((sum, item) => sum + item.amount, 0);

            return (
              <View key={monthYear}>
                <View style={styles.tableRow}>
                  <Text style={styles.cell}>{monthYear}</Text>
                  <Text style={[styles.cell, styles.totalText]}>
                    R$ {totalAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  chartContainer: {
    marginBottom: 50,
    marginVertical: 50,
    paddingHorizontal: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  headerGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuIcon: { paddingHorizontal: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  menuContainer: {
    width: menuWidth,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    justifyContent: 'center',
  },
  menuItem: { paddingVertical: 15 },
  menuItemText: { fontSize: 18, color: '#333', textAlign: 'center' },
  table: { width: '100%', margin: 10 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerCell: { flex: 1, fontWeight: 'bold', textAlign: 'center' },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    paddingVertical: 10,
  },
  cell: { flex: 1, textAlign: 'center' },
  chartContainer: { padding: 10 },
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  closeButton: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  table: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'space-between',
  },
  headerCell: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    width: '50%',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  cell: {
    fontSize: 14,
    textAlign: 'center',
    width: '50%',
    color: '#333',
  },
  totalText: {
    fontSize: 16,
    color: '#333',
  },

});

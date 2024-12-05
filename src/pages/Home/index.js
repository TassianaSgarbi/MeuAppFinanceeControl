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
  const predefinedColors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F6'];

  // Função para buscar despesas no backend
  const fetchDespesas = async () => {
    try {
      const response = await axios.get('http://192.168.0.23:3333/expenses');
      setDespesas(response.data);
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as despesas.');
    }
  };

  // Função para buscar categorias no backend
  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://192.168.0.23:3333/categories');
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
    }
  };

  // Função para encontrar o nome da categoria pelo ID
  const getCategoriaNome = (categoryId) => {
    const categoria = categorias.find(cat => cat.id === categoryId);
    return categoria ? categoria.name : 'Categoria não encontrada';
  };

  // Carregar despesas e categorias ao montar o componente
  useEffect(() => {
    fetchDespesas();
    fetchCategorias();

    // Recarregar as despesas a cada 5 segundos
    const interval = setInterval(() => {
      fetchDespesas();
    }, 5000); // Atualizar a cada 5 segundos

    return () => clearInterval(interval); // Limpar o intervalo quando o componente for desmontado
  }, []);

  // Função para abrir o menu
  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(menuAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Função para fechar o menu
  const closeMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: -menuWidth,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMenuVisible(false));
  };
   // Função para deslogar o usuário
  const logout = async () => {
    try {
      // Remover o token de autenticação
      await AsyncStorage.removeItem('authToken');

      // Exibir uma mensagem no console para confirmação
      console.log("Usuário deslogado com sucesso");

      // Navegar para a tela de login
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
      }, 30000000);
  
      setLogoutTimer(timer); // Salva o temporizador no estado
    };

    // Preparando dados para o gráfico
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
    return categorias.map((categoria, index) => {
      const total = despesas
        .filter((despesa) => despesa.categoryId === categoria.id)
        .reduce((acc, curr) => acc + curr.amount, 0);
      return {
        name: categoria.name,
        amount: total,
        color: predefinedColors[index % predefinedColors.length], // Usa uma cor fixa do array
        legendFontColor: '#000',
        legendFontSize: 12,
      };
    });
  };

  const chartData = getChartData();
  const pieData = getPieData();

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      paddingLeft: 20, // Ajuste para evitar corte nos rótulos
      paddingRight: 20,
    },
  };

  return (
    <View style={{ flex: 1 }} onTouchStart={resetLogoutTimer}>
      <View style={styles.headerGradient}>
        <TouchableOpacity onPress={openMenu}>
          <Feather name="menu" size={24} color="#fff" style={styles.menuIcon} />
        </TouchableOpacity>
      </View>

      <Modal visible={menuVisible} transparent animationType="none">
        <TouchableOpacity style={styles.modalOverlay} onPress={closeMenu}>
          <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuAnimation }] }]} >
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

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={true}>
  {/* Gráfico de Barras */}
  <View style={styles.chartContainer}>
    <Text style={styles.chartTitle}>Despesas por Categoria em R$</Text>
    <BarChart
      data={{
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.data,
          },
        ],
      }}
      width={screenWidth - 40} // Largura do gráfico
      height={260} // Aumenta a altura para dar espaço aos rótulos
      chartConfig={{
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
          paddingLeft: 20,
          paddingRight: 20,
        },
        decimalPlaces: 2, // Ajuste de precisão
      }}
      verticalLabelRotation={0} // Rotação dos rótulos
      style={{ marginBottom: 20 }} // Espaçamento adicional
    />
  </View>

  {/* Gráfico de Pizza */}
  <View style={styles.chartContainer}>
    <Text style={styles.chartTitle}>Distribuição de Gastos em %</Text>
    <PieChart
      data={pieData}
      width={screenWidth - 40}
      height={220}
      chartConfig={chartConfig}
      accessor="amount"
      backgroundColor="transparent"
      paddingLeft="15"
    />
  </View>

        {/* Renderização da Tabela */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Categoria</Text>
            <Text style={styles.headerCell}>Descrição</Text>
            <Text style={styles.headerCell}>Valor</Text>
            <Text style={styles.headerCell}>Vencimento</Text>
          </View>
          {despesas.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.cell}>{getCategoriaNome(item.categoryId)}</Text>
              <Text style={styles.cell}>{item.description}</Text>
              <Text style={styles.cell}>R$ {item.amount.toFixed(2)}</Text>
              <Text style={styles.cell}>
                {(() => {
                  const [day, month, year] = item.due_date.split('/'); // Divide o formato dd/MM/yyyy
                  const formattedDate = new Date(`${year}-${month}-${day}`); // Converte para o formato yyyy-MM-dd
                  return formattedDate.toLocaleDateString('pt-BR'); // Formata para dd/MM/yyyy
                })()}
              </Text>
            </View>
          ))}
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
});

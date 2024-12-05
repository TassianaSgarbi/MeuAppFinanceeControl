import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Dimensions, ScrollView, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const menuWidth = screenWidth * 0.5; // Largura do menu é metade da tela

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(-menuWidth)); // Animação de deslize
  const [logoutTimer, setLogoutTimer] = useState(null); // Estado para o temporizador
  const [pieData, setPieData] = useState([]); // Estado para os dados do gráfico de pizza
  const navigation = useNavigation();

  const barData = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99],
      },
    ],
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [20, 35, 50, 40, 60],
        strokeWidth: 2,
      },
    ],
  };

  // Função para buscar e agregar as despesas por categoria
  const fetchPieDataFromExpenses = async () => {
    try {
      const response = await axios.get('http://192.168.0.23:3333/expenses');
  
      const aggregatedData = response.data.reduce((acc, expense) => {
        const category = expense.category_name || 'Outros';
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += expense.amount;
        return acc;
      }, {});
  
      const totalExpenses = Object.values(aggregatedData).reduce((sum, amount) => sum + amount, 0);
  
      if (totalExpenses === 0) {
        setPieData([]);
        return;
      }
  
      const pieChartData = Object.entries(aggregatedData)
        .filter(([category, total]) => total > 0)
        .map(([category, total]) => ({
          name: category,
          population: Math.max(0, (total / totalExpenses) * 100),
          color: '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0'),
          legendFontColor: '#7F7F7F',
          legendFontSize: 15,
        }));
  
      setPieData(pieChartData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados para o gráfico.');
    }
  };

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

  useEffect(() => {
    fetchPieDataFromExpenses(); // Chama a função ao montar o componente

    // Limpar o temporizador quando o componente for desmontado
    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    };
  }, []); // Executa apenas uma vez ao montar o componente

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
        <View style={styles.chartContainer}>
          {/* Gráfico de Barras */}
          <BarChart data={barData} width={screenWidth - 40} height={220} fromZero={true} chartConfig={chartConfig} style={styles.chart} />
          {/* Gráfico de Linha */}
          <LineChart data={lineData} width={screenWidth - 40} height={220} chartConfig={chartConfig} style={styles.chart} />
          {/* Gráfico de Pizza */}
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </View>
      </ScrollView>
    </View>
  );
}


const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(34, 128, 76, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  headerGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuIcon: {
    paddingHorizontal: 15,
  },
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
  menuItem: {
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
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

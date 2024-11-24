import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Dimensions, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const menuWidth = screenWidth * 0.5; // Largura do menu é metade da tela

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(-menuWidth)); // Animação de deslize
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

  const pieData = [
    {
      name: 'Categoria A',
      population: 215,
      color: '#f00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Categoria B',
      population: 280,
      color: '#0f0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Categoria C',
      population: 500,
      color: '#00f',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

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

  return (
    <View style={{ flex: 1 }}>
      {/* HeaderGradient com Menu Feather */}
      <View style={styles.headerGradient}>
        <TouchableOpacity onPress={openMenu}>
          <Feather name="menu" size={24} color="#fff" style={styles.menuIcon} />
        </TouchableOpacity>
      </View>

      <Modal visible={menuVisible} transparent animationType="none">
        <TouchableOpacity style={styles.modalOverlay} onPress={closeMenu}>
          <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuAnimation }] }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
                navigation.navigate('CadastroCategoria'); // Navega para CadastroCategoria
              }}
            >
              <Text style={styles.menuItemText}>Cadastrar Categoria</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
                navigation.navigate('CadastroDespesas'); // Navega para CadastroDespesas
              }}
            >
              <Text style={styles.menuItemText}>Cadastrar Despesas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
                navigation.navigate('ConsultarDespesas'); // Navega para ConsultarDespesas
              }}
            >
              <Text style={styles.menuItemText}>Consultar Despesas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
                navigation.navigate('AlterarDados'); // Navega para Alterar Dados
              }}
            >
              <Text style={styles.menuItemText}>Alterar Dados</Text>
            </TouchableOpacity>
           
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
                navigation.navigate('Chatbot'); // Navega para Chatbot
              }}
            >
              <Text style={styles.menuItemText}>Chatbot</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
                navigation.navigate('DeletarUsuario'); // Navega para Deletar Usuario
              }}
            >
              <Text style={styles.menuItemText}>Deletar Usuario</Text>
            </TouchableOpacity>
           
          <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
                logout(); // Chama a função logout
              }}
            >
              <Text style={styles.menuItemText}>Sair do Sistema</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeMenu}
            >
          

              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.chartContainer}>
          {/* Gráfico de Barras */}
          <BarChart
            data={barData}
            width={screenWidth - 40}
            height={220}
            fromZero={true}
            chartConfig={chartConfig}
            style={styles.chart}
          />
          {/* Gráfico de Linha */}
          <LineChart
            data={lineData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
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

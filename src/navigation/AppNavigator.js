import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home';
import Login from '../pages/Login';
import CadastroUsuario from '../pages/CadastroUsuario';
import CadastroCategoria from '../pages/CadastroCategoria';
import CadastroDespesas from '../pages/CadastroDespesas';
import ConsultarDespesas from '../pages/ConsultarDespesas';
import AlterarDados from '../pages/AlterarDados';
import Chatbot from '../pages/Chatbot/Chatbot'; // Importação do Chatbot


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: 'black',
        headerTitleStyle: {
        fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="CadastroUsuario" component={CadastroUsuario} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CadastroCategoria" component={CadastroCategoria} />
      <Stack.Screen name="CadastroDespesas" component={CadastroDespesas} />
      <Stack.Screen name="ConsultarDespesas" component={ConsultarDespesas} />
      <Stack.Screen name="AlterarDados" component={AlterarDados} />
      <Stack.Screen name="Chatbot" component={Chatbot} />
     </Stack.Navigator>
  );
};

export default AppNavigator;

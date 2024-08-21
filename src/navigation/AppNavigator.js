import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home';
import Login from '../pages/Login';
import CadastroUsuario from '../pages/CadastroUsuario';
import CadastroDespesas from '../pages/CadastroDespesas';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="CadastroUsuario" component={CadastroUsuario} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CadastroDespesas" component={CadastroDespesas} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

export default function ConsultarDespesas() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [despesas, setDespesas] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState({ start: false, end: false });

  useEffect(() => {
    if (startDate && endDate) {
      fetchDespesas();
    }
  }, [startDate, endDate]);

  const fetchDespesas = async () => {
    try {
      const response = await axios.get(`https://seu-backend.com/despesas`, {
        params: {
          startDate,
          endDate
        }
      });
      setDespesas(response.data);
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
    }
  };

  const handleConsultar = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const sixMonthsLater = new Date(start);
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

      if (end > sixMonthsLater) {
        alert('O intervalo de consulta não pode exceder 6 meses.');
      } else {
        fetchDespesas();
      }
    } else {
      alert('Por favor, selecione as datas de início e término.');
    }
  };

  const onDateChange = (event, selectedDate, dateType) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker({ ...showDatePicker, [dateType]: Platform.OS === 'ios' });
    
    if (dateType === 'start') {
      setStartDate(currentDate.toISOString().split('T')[0]);
    } else {
      setEndDate(currentDate.toISOString().split('T')[0]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Consulte suas Despesas Cadastradas</Text>

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => setShowDatePicker({ ...showDatePicker, start: true })} style={styles.input}>
            <Text style={styles.inputText}>{startDate || 'Digite a Data de Início'}</Text>
          </TouchableOpacity>
          {showDatePicker.start && (
            <DateTimePicker
              testID="dateTimePickerStart"
              value={new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => onDateChange(event, selectedDate, 'start')}
            />
          )}

          <TouchableOpacity onPress={() => setShowDatePicker({ ...showDatePicker, end: true })} style={styles.input}>
            <Text style={styles.inputText}>{endDate || 'Digite a Data de Término'}</Text>
          </TouchableOpacity>
          {showDatePicker.end && (
            <DateTimePicker
              testID="dateTimePickerEnd"
              value={new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => onDateChange(event, selectedDate, 'end')}
            />
          )}
        </View>

        <TouchableOpacity style={styles.consultarButton} onPress={handleConsultar}>
          <Text style={styles.consultarButtonText}>Consultar</Text>
        </TouchableOpacity>

        <FlatList
          data={despesas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.despesaContainer}>
              <Text style={styles.despesaText}>Categoria: {item.categoria}</Text>
              <Text style={styles.despesaText}>Tipo: {item.tipo}</Text>
              <Text style={styles.despesaText}>Data de Vencimento: {item.dataVencimento}</Text>
              <Text style={styles.despesaText}>Data de Pagamento: {item.dataPagamento || 'Não pago'}</Text>
              <Text style={styles.despesaText}>Valor: {item.valor}</Text>
              <Text style={styles.despesaText}>Descrição: {item.descricao}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handleEditar(item.id)}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => handleExcluir(item.id)}>
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
  content: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputText: {
    color: '#333',
  },
  consultarButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  consultarButtonText: {
    color: '#fff',
    fontSize: 16,
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

import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { Button } from "../../../components/common/Button";
import { useEffect, useState } from "react";
import { Input } from "../../../components/common/Input";
import firestore from '@react-native-firebase/firestore';


import { Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors";
import { useAuth } from "../../../hooks/useAuth";
import { PaymentProps } from "../payment";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationRoutesProps } from "../../../routes/stack.routes";

interface FinancialState {
  income: { name: string; amount: string }[];
  expenses: { name: string; amount: string }[];
}

export function EditExpenses({route}: any) {
  const { user } = useAuth()
  const { item } = route?.params || {}
  const navigation = useNavigation<StackNavigationRoutesProps>()

  const [modalVisible, setModalVisible] = useState(false)
  const [modalName, setModalName] = useState('')
  
  const [paymentID, setPaymentID] = useState<string[]>()
  const [paymentInfo, setPaymentInfo] = useState<PaymentProps[]>()

  const [valorPyamentStudent, setValorPyamentStudent] = useState(0)
  const [monthyAtualName, setMonthyAtualName] = useState('')

  const [title, setTitle] = useState('')
  const [valor, setValor] = useState('')

  const [financial, setFinancial] = useState<FinancialState>({
    income: item ? item.income : [],
    expenses: item ? item.expenses : []
  });

  function handleSaveFinancial(){
    if(item)
    {
      firestore()
        .collection('financial')
        .doc(item.id)
        .update({
          studentValor: valorPyamentStudent, 
          income: financial.income,
          expenses: financial.expenses,
          updatedAt: new Date(),
        })
    }
    else
    {
      firestore()
        .collection('financial')
        .add({
          academyId: user.academyId,
          monthy: monthyAtualName,
          studentValor: valorPyamentStudent, 
          income: financial.income,
          expenses: financial.expenses,
          updatedAt: new Date(),
          createdAt: new Date()
        })
    }
    navigation.goBack()
  }

  function addIncome(title: string, valor: string) {
    valor = valor.replace(',', '.')
    const updatedFinancial = {
      ...financial,
      income: [...financial.income, {name: title, amount: valor}],
    };
    setFinancial(updatedFinancial);
  }
  
  function addExpenses(title: string, valor: string) {
    valor = valor.replace(',', '.')
    const updatedFinancial = {
      ...financial,
      expenses: [...financial.expenses, {name: title, amount: valor}],
    };
    setFinancial(updatedFinancial);
  }

  function deleteIncomeByName(nameToDelete: string) {
    const updatedIncome = financial.income.filter(expense => expense.name !== nameToDelete);
    const updatedFinancial = {
      ...financial,
      income: updatedIncome,
    };
    setFinancial(updatedFinancial);
  }

  function deleteExpenseByName(nameToDelete: string) {
    const updatedExpenses = financial.expenses.filter(expense => expense.name !== nameToDelete);
    const updatedFinancial = {
      ...financial,
      expenses: updatedExpenses,
    };
    setFinancial(updatedFinancial);
  }

  function handleAdd(){
    if(modalName === 'Receita'){
      addIncome(title, valor)
    }
    if(modalName === 'Despesa'){
      addExpenses(title, valor)
    }

    setTitle('')
    setValor('')
    setModalVisible(!modalVisible)
  }

  function calculatePaymentStudent(){
    let total = 0
    paymentID?.map(id => {
      paymentInfo?.map(item => {
        if(item.id === id){
          total += parseFloat(item.valor)
        }
      })
    })
    setValorPyamentStudent(total)
  }

  function monthyAtual(){
    const mesesEmPortugues = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril',
      'Maio', 'Junho', 'Julho', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const dataAtual = new Date();
    const mesAtual = mesesEmPortugues[dataAtual.getMonth()];
    
    setMonthyAtualName(mesAtual)
  }

  useEffect(() => {
    const subscribe = firestore()
    .collection('users')
    .where('academyId', '==', user.academyId)
    .where('isAdmin', '==', false)
    .onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => {
        const {paymentId} = doc.data()
        return paymentId
      })
      setPaymentID(data)
    })

    return () => subscribe()
  }, [])

  useEffect(() => {
    const subscribe = firestore()
    .collection('payment')
    .where('academyId', '==', user.academyId)
    .onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as PaymentProps[]
      setPaymentInfo(data)
    })

    return () => subscribe()
  }, [])

  useEffect(() => {
    calculatePaymentStudent()
    monthyAtual()
  }, [paymentID, paymentInfo])

  return (
    <View className="flex-1 p-3 bg-slate-200">
      <View className="flex-1">
        <Text className="text-center text-3xl">{monthyAtualName}</Text>
        <View className="mb-4">
          <Text className="text-xl text-green-500 font-bold">Receitas</Text>
          <View className="flex-row justify-between">
            <Text className="text-lg">Mensalidade dos Alunos: </Text>
            <Text className="text-lg text-green-500">R$ {valorPyamentStudent.toFixed(2).replace('.', ',')}</Text>
          </View>

          <FlatList 
            data={financial.income}
            keyExtractor={(item) => item.name}
            renderItem={({item}) => (
              <View className="flex-row justify-between">
                <Text className="text-lg">{item.name}: </Text>
                <View className="flex-row items-center">
                  <Text className="text-lg text-green-500">R$ {Number(item.amount).toFixed(2).replace('.', ',')}</Text>
                  <TouchableOpacity 
                    className="ml-5"
                    onPress={() => deleteIncomeByName(item.name)}
                  >
                    <Feather name="x" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
        
        <View>
          <Text className="text-xl text-red-500 font-bold">Despesas</Text>
          <FlatList 
            data={financial.expenses}
            keyExtractor={(item) => item.name}
            renderItem={({item}) => (
              <View className="flex-row justify-between">
                <Text className="text-lg">{item.name}: </Text>
                <View className="flex-row items-center">
                  <Text className="text-lg text-red-500">R$ {item.amount}</Text>
                  <TouchableOpacity 
                    className="ml-5"
                    onPress={() => deleteExpenseByName(item.name)}
                  >
                    <Feather name="x" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </View>

      <View className="flex-row justify-between">
        <Button 
          title="+ Receita" 
          className="w-2/6"
          onPress={() => {
            setModalName('Receita')
            setModalVisible(!modalVisible)
          }}
        />
        <Button 
          title="Save" 
          className="w-1/5 bg-green-500"
          onPress={() => {
            handleSaveFinancial()
          }}
        />
        <Button 
          title="+ Despesa" 
          className="w-2/6"
          onPress={() => {
            setModalName('Despesa')
            setModalVisible(!modalVisible)
          }}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View className="flex-1 justify-center">
          <View className="m-5 bg-white rounded-2xl pb-9 px-9 pt-3 shadow-md shadow-black">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl">
                Nova {modalName}
              </Text>
              <TouchableOpacity
              activeOpacity={0.7}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Feather name="x" size={30} color={colors.red[500]} />
              </TouchableOpacity>
            </View>
            <Input placeholder="Nome" onChangeText={setTitle} value={title}/>
            <Input placeholder="valor" keyboardType="numeric" onChangeText={setValor} value={valor}/>
            <Button 
              title='Ok'
              onPress={handleAdd}
            />
            
          </View>
        </View>
      </Modal>
    </View>
  )
}
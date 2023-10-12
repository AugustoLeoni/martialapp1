import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { Button } from "../../../components/common/Button";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationRoutesProps } from "../../../routes/stack.routes";
import { useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore';
import { useAuth } from "../../../hooks/useAuth";
import { Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors";

type financialProps = {
  id: string
  monthy: string
  studentValor: string
  income: [amount: string, name: string]
  expenses: [amount: string, name: string]
}

export function Expenses() {
  const { user } = useAuth()

  const navigation = useNavigation<StackNavigationRoutesProps>()

  const [dataFinancial, setDataFinancial] = useState<financialProps[]>()

  function handleDeleteFinancial(id: string){
    Alert.alert("Deseja deletar a informação do mês?", "", [
      {
        text: "Cancelar",
        onPress: () => console.log("cancelado"),
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: () => {
          firestore()
            .collection('financial')
            .doc(id)
            .delete()
        }
      }
    ])
  }

  useEffect(() => {
    const subscribe = firestore()
    .collection('financial')
    .where('academyId', '==', user.academyId)
    .onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as financialProps[]
      setDataFinancial(data)
    })

    return () => subscribe()
  }, [])

  return (
    <View className="flex-1 p-3 bg-slate-200">
      <FlatList 
        data={dataFinancial}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          let totalIncome = Number(item.studentValor)
          item.income.map(item => {
            totalIncome += Number(item.amount)
          })

          let totalExpenses = 0
          item.expenses.map(item => {
            totalExpenses += Number(item.amount)
          })
          
          return (
            <TouchableOpacity 
              onPress={() => navigation.navigate('editExpenses', {item})}
              activeOpacity={0.6}
              className="bg-white p-3 rounded-sm mb-3"
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-row">
                  <Text className="text-xl font-semibold">Visão geral - {item.monthy}</Text>
                  <Feather name="edit" size={10}/>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteFinancial(item.id)}
                >
                  <Feather name="trash-2" size={20} color={colors.red[500]}/>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center justify-between my-1 p-2 border-l-2 border-green-400">
                <Text className="text-lg">Receita</Text>
                <Text className="text-green-400 text-base font-medium">R$ {totalIncome.toFixed(2).replace('.', ',')}</Text>
              </View>
              <View className="flex-row items-center justify-between my-1 p-2 border-l-2 border-red-500">
                <Text className="text-lg">Despesas</Text>
                <Text className="text-red-500 text-base font-medium">R$ {totalExpenses.toFixed(2).replace('.', ',')}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View className="mb-16"/>}
      />

      <Button 
        title="+" 
        className="w-16 rounded-full absolute bottom-3 right-3"
        onPress={() => navigation.navigate('editExpenses')}
      />
    </View>
  )
}
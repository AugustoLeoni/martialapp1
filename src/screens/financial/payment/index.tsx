import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors";
import { Button } from "../../../components/common/Button";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationRoutesProps } from "../../../routes/stack.routes";

import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

export type PaymentProps = {
  id: string
  title: string
  valor: string
  date: string
  discount: string
  panality: string
}

export function Payment() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<PaymentProps[]>([])
  const navigation = useNavigation<StackNavigationRoutesProps>()

  function handleDelete(id: string) {
    Alert.alert("Deseja deletar a mensalidade?", "Alunos que tiverem essa mensalidade ficaram sem", [
      {
        text: "Cancelar",
        onPress: () => console.log("cancelado"),
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: () => {
          firestore()
            .collection('payment')
            .doc(id)
            .delete()
        }
      }
    ])
  }

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
      setPayments(data)
    })

    return () => subscribe()
  }, [])

  return (
    <View className="flex-1 p-3 bg-slate-200">
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('editPayment', item)}
            activeOpacity={0.7} 
            className="bg-white rounded-lg p-2 my-2"
          >
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
              >
                <Feather
                  name="trash-2"
                  size={20}
                  color={colors.red[500]}
                  style={{
                    marginBottom: 5,
                  }}
                />
              </TouchableOpacity>
              <Feather 
                name="arrow-right"
                size={20}
              />

            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-xl font-semibold">{item.title}</Text>
              <Text>R$: {item.valor}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text>Dia do vencimento da mensalidade: </Text>
              <Text>{item.date}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text>Desconto do pagamento antecipado: </Text>
              <Text>R$: {item.discount}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text>Penalidade do pagamento Atrasado: </Text>
              <Text>R$: {item.panality}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button 
        title="+" 
        className="w-16 rounded-full absolute bottom-3 right-3"
        onPress={() => navigation.navigate('editPayment')}
      />
    </View>
  )
}
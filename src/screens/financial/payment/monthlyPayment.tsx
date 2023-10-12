import { FlatList, Text, View } from "react-native";
import { Button } from "../../../components/common/Button";
import { useAuth } from "../../../hooks/useAuth";
import { useEffect } from "react";
import firestore from '@react-native-firebase/firestore';

interface MonthData {
  id: string;
  payment: boolean;
  paymentChose: {
    academyId: string;
    date: string;
    discount: string;
    id: string;
    panality: string;
    title: string;
    valor: string;
  };
  title: string;
  year: number;
}

export function MonthlyPayment() {
  const { user } = useAuth()


  // useEffect(() => {
  //   const data = new Date().getMonth()
  //   firestore()
  //     .collection('payment')
  //     .doc(user.paymentId)
  //     .get()
  //     .then(doc => {
  //       const dataPayment = doc.data()

  //       const result = user.monthyPaymentRealized?.map(monthy => {
  //         if(Number(monthy.id) === data) {
  //           return {
  //             monthlyPaymentRealized: dataPayment
  //           }
  //         }
  //         return monthy
  //       })
  //       firestore()
  //         .collection('users')
  //         .doc(user.id)
  //         .update({
  //           monthyPaymentRealized: result
  //         })
  //     })
  // }, [])

  return (
    <View className="p-3">
      <FlatList
        data={user.monthyPaymentRealized as MonthData[]}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const data = new Date(Number(item.year), Number(item.id), Number(item.paymentChose.date))
         
          if(item.paymentChose.title && item.paymentChose.valor){
            return (
              <View className="bg-white p-3 rounded-lg my-2">
                <Text className="text-3xl text-blue-600 font-bold">{item.paymentChose.title}</Text>
                <View className="flex-row justify-between mt-3">
                  {
                    item.payment?
                    <Text className="text-2xl text-red-500 font-medium">Em aberto</Text>
                    :
                    <Text className="text-2xl text-blue-500 font-medium">Fechado</Text>
                  }
                  <Text 
                    className={`text-2xl ${item.payment ? 'text-red-500' : 'text-blue-500'} font-medium`}
                  >
                    R$ {Number(item.paymentChose.valor).toFixed(2).replace('.', ',')}
                  </Text>
                </View>
                <View className="flex-row justify-between my-3 items-center">
                  <Text className={`text-base ${item.payment ? 'text-red-500' : 'text-blue-500'}`}>Vencimento: {item.paymentChose.date}/{data.getMonth()}/{item.year} </Text>
                  {
                    item.payment?
                    <Button className="w-24 h-10 bg-green-500" title="Pagar "/>
                    :
                    <View className="w-24 h-10 bg-green-500 justify-center items-center rounded-lg">
                      <Text className="text-lg text-white font-semibold">Pago</Text>
                    </View>
                  }
                </View>
              </View>
            )
          }
          else
          {
            return null
          }
        }}
      />
    </View>
  )
}
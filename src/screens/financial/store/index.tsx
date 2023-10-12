import { View, Text, TouchableOpacity, FlatList, Alert, Image } from "react-native";
import { Feather } from '@expo/vector-icons'
import { Button } from "../../../components/common/Button";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationRoutesProps } from "../../../routes/stack.routes";

import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

export type StoreProps = {
  id: string
  title: string
  valor: string
  stock: string
  imageUri: string
}

export function Store() {
  const { user } = useAuth()
  const [stores, setStores] = useState<StoreProps[]>([])
  const [numberCrementDecrement, setNumberCrementDecrement] = useState(0)
  const navigation = useNavigation<StackNavigationRoutesProps>()

  async function handlestock(stockAtual: string, idProduct: string){
      const result = Number(stockAtual) + numberCrementDecrement

      if(result < 0) 
      {
        Alert.alert("Quantidade minima 0")
      }
      else
      {
        firestore()
          .collection('store')
          .doc(idProduct)
          .update({
            updatedAt: new Date(),
            stock: result
          })
      }
  }

  useEffect(() => {
    const subscribe = firestore()
    .collection('store')
    .where('academyId', '==', user.academyId)
    .onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as StoreProps[]
      setStores(data)
    })

    return () => subscribe()
  }, [])

  return (
    <View className="flex-1 p-3 bg-slate-200">
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View
            className="mt-2 mb-5 justify-center items-center"
          >
            <View className="h-80 w-72 justify-center items-center bg-white rounded-tr-lg rounded-tl-lg">
              { item.imageUri ?
                <Image 
                  source={{uri: item.imageUri}}
                  className="h-full w-full rounded-tr-lg rounded-tl-lg"
                />
                :
                <Feather name="camera-off" size={80}/>
              }
              <View className="bg-gray-400 w-full h-20 absolute bottom-0 opacity-60 rounded-sm"/>
              <View className="absolute bottom-0 w-full p-3">
                <Text className="text-xl text-white font-bold">{item.title}</Text>
                <Text className="text-xl text-white font-bold">R$ {item.valor}</Text>
              </View>
            </View>
            <View className="w-72 p-3">
              <View className={`bg-white w-72 ${user.isAdmin ? 'h-44' : 'h-12'} absolute opacity-40`}/>
              <Text className="text-base mb-3">Quantidade no estoque: {item.stock}</Text>

              {user.isAdmin && <>
                <View className="flex-row gap-4">
                  <TouchableOpacity
                    className="bg-white w-12 h-12 items-center justify-center rounded-lg shadow-sm shadow-gray-400"
                    onPress={() => setNumberCrementDecrement(numberCrementDecrement - 1)}
                  >
                    <Feather name="minus" size={25} />
                  </TouchableOpacity>
                  <View className="bg-white w-12 h-12 items-center justify-center rounded-lg">
                    <Text>{numberCrementDecrement}</Text>
                  </View>
                  <TouchableOpacity
                    className="bg-white w-12 h-12 items-center justify-center rounded-lg shadow-sm shadow-gray-400"
                    onPress={() => setNumberCrementDecrement(numberCrementDecrement + 1)}
                  >
                    <Feather name="plus" size={25} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="w-12 h-12 justify-center items-center border rounded-lg"
                    onPress={() => navigation.navigate('newStore', {item})}
                  >
                    <Feather name="edit" size={25}/>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  className="bg-green-400 my-3 items-center rounded-lg"
                  onPress={() => handlestock(item.stock, item.id)}
                >
                  <Text className="text-xl p-2 text-white font-bold">Atualizar</Text>
                </TouchableOpacity></>}
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
      {user.isAdmin && <Button 
        title="+" 
        className="w-16 rounded-full absolute bottom-3 right-3"
        onPress={() => navigation.navigate('newStore')}
      />}
    </View>
  )
}
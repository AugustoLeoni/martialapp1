import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Button } from "../../../components/common/Button";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationRoutesProps } from "../../../routes/stack.routes";
import { useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore';
import { useAuth } from "../../../hooks/useAuth";
import { MaterialIcons, Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors";

type ColorItem = {
  id: string;
  colorBelt: string;
  simbolBelt?: string;
  colorPrimary?: string;
  colorSecundary?: string;
  colorThird?: string;
  colorFourth?: string;
};

type GraduateState = {
  id: string
  title: string;
  colors: ColorItem[];
};


export type GraduateProps = {
  id: string
  title: string
  colors: string[]
}

export function Graduate() {
  const { user } = useAuth()
  const [graduate, setGraduate] = useState<GraduateState[]>([])

  const navigation = useNavigation<StackNavigationRoutesProps>()

  function handleDeleteGraduate(id: string){
    Alert.alert("Deseja excluir a graduação?", "", [
      {
        text: "Cancelar",
        onPress: () => console.log('cancelado'),
        style: 'cancel',
      },
      {
        text: "Ok",
        onPress: () => {
          firestore()
            .collection('graduate')
            .doc(id)
            .delete()
        }
      }
    ])
  }

  useEffect(() => {
    const subscribe = firestore()
    .collection('graduate')
    .where('academyId', '==', user.academyId)
    .onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        };
      }) as unknown as GraduateState[]
      setGraduate(data)
    })

    return () => subscribe()
  }, [])

  return (
    <View className="flex-1 p-3">
      <View>
        <FlatList 
          data={graduate}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.navigate('editGraduate', {item})}
              className="my-3 border p-2 rounded-lg border-gray-200"
            >
              <View className="flex-row justify-between">
                <View className="flex-row">
                  <Text className="text-xl">{item.title}</Text>
                  <MaterialIcons name="create" size={15} color={colors.gray[400]}/>
                </View>
                <TouchableOpacity onPress={() => handleDeleteGraduate(item.id)}>
                  <Feather name="trash-2" color={colors.red[500]} size={20}/>
                </TouchableOpacity>
              </View>
                <View className="flex-row flex-wrap">
                  {item.colors.map(item => 
                    <View
                      key={item.id}
                      style={{ backgroundColor: item.colorBelt}}
                      className="justify-center items-center w-16 h-16 m-0.5"
                    >
                      {
                        item.simbolBelt == 'star' &&
                        <View className="absolute justify-center items-center">
                          <MaterialIcons name="star" size={60} style={{position: "absolute"}} color={item.colorSecundary}/>
                          <MaterialIcons name="star" size={40} style={{position: "absolute"}} color={item.colorPrimary}/>
                        </View>
                      }
                      {
                        item.simbolBelt == 'belt' &&
                        <View className="flex-row gap-1">
                          <View 
                            className="h-16 w-2"
                            style={{backgroundColor: item.colorPrimary}}
                          />
    
                          <View 
                            className="h-16 w-2"
                            style={{backgroundColor: item.colorSecundary}}
                          />
    
                          <View 
                            className="h-16 w-2"
                            style={{backgroundColor: item.colorThird}}
                          />
    
                          <View 
                            className="h-16 w-2"
                            style={{backgroundColor: item.colorFourth}}
                          />
                        </View>
                      }
                    </View>
                  )}
                </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <Button 
        title="+" 
        className="w-16 rounded-full absolute bottom-3 right-3"
        onPress={() => navigation.navigate('editGraduate')}
      />
    </View>
  )
}
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons, Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationRoutesProps } from "../../routes/stack.routes";
import { useAuth } from "../../hooks/useAuth";
import firestore from '@react-native-firebase/firestore';

import userPhotoDefault from '../../assets/userPhotoDefault.png'
import { useEffect, useState } from "react";

type AcademyProps = {
  academyName: string
  userName: string
  academyPhotoUri: string
}

export function Header() {
  const { signOut, user } = useAuth()
  
  const navigation = useNavigation<StackNavigationRoutesProps>()

  const [academyData, setAcademyData] = useState<AcademyProps>()

  function handleLogout(){
    Alert.alert("Deseja sair?","", [
      {
        text: 'Cancelar',
        onPress: () => console.log("Cancelado"),
        style: 'cancel',
      },
      {
        text: 'Ok',
        onPress: () => signOut()
      }
    ])
  }
  
  useEffect(() => {
    const subscribe = firestore()
      .collection('Academy')
      .doc(user.academyId)
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.data();
        if (data) {
          const { academyName, userName, academyPhotoUri } = data;
          setAcademyData({ academyName, userName, academyPhotoUri });
        } else {
          // Trate o caso em que o documento não existe
          // setAcademyData(null); // Ou defina um valor padrão
        }
      })
      return () => subscribe()
  }, [])

  return(
    <View style={{backgroundColor: colors.blue[600]}} className="flex-row pt-16">
      <View className="w-full flex-row p-3 items-center justify-between">
        <Image
          source={academyData?.academyPhotoUri ? { uri: academyData?.academyPhotoUri} : userPhotoDefault}
          className="w-12 h-12 rounded-full"
        />
        <View>
          <Text className="text-white text-base flex-wrap mx-1">
            {academyData?.academyName}
          </Text>
          <Text className="text-white text-base flex-wrap mx-1">
            {user.isAdmin ? academyData?.userName : user.name}
          </Text>
        </View>

        <View className="flex-row gap-1">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              user.isAdmin ? navigation.navigate('expenses') : navigation.navigate('financial')
            }}
          >
            <MaterialIcons name="monetization-on" size={26} color={colors.white} />
          </TouchableOpacity>

          { user.isAdmin ?
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              user.isAdmin ? navigation.navigate('financial') : navigation.navigate('settings')
            }}
          >
            <MaterialIcons name="settings" size={26} color={colors.white} />
          </TouchableOpacity>
          :
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('classDay')}
          >
            <Feather name="calendar" size={26} color={colors.white} />
          </TouchableOpacity>
          }

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={26} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
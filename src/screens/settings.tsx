import { View, ScrollView, Image, TouchableOpacity, Alert, Text } from "react-native";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'

import userPhotoDefault from '../assets/userPhotoDefault.png'

type AcademyProps = {
  academyName: string
  name: string
  academyPhotoUri: string
  valor: string
  payment: boolean
}

export function Settings() {
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)

  const [academyPhoto, setAcademyPhoto] = useState('')
  const [userName, setUserName] = useState('')
  const [academyName, setAcademyName] = useState('')

  const [academyData, setAcademyData] = useState<AcademyProps>()

  async function handleAcademyPhoto() {
    const photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [4, 4],
      allowsEditing: true,
    })

    if (!photoSelected.canceled) {
      const photoInfo = await FileSystem.getInfoAsync(
        photoSelected.assets[0].uri,
      )

      if (photoInfo.exists && (photoInfo.size / 1024 / 1024) > 10) {
        return Alert.alert('Imagem muito grande')
      }

      return setAcademyPhoto(photoSelected.assets[0].uri)
    }
  }
  

  function handleAcademyInformation(){
      setLoading(true)
      if(academyPhoto){
        const fileName = new Date().getTime()
        const MIME = academyPhoto.match(/\.(?:.(?!\.))+$/)
        const reference = storage().ref(`/images/academy/${fileName}${MIME}`)
        
        reference
          .putFile(academyPhoto)
          .then(() => {
            Alert.alert('Upload concluido')
            storage()
              .ref(`/images/academy/${fileName}${MIME}`)
              .getDownloadURL()
              .then(async (file) => {
                firestore()
                  .collection('Academy')
                  .doc(user.academyId)
                  .update({
                    academyPhotoUri: file,
                    academyName: academyName,
                    userName: userName,
                    updatedAt: new Date()
                  })
                setLoading(false)
              })
          })
          .catch(error => {
            Alert.alert("Falha ao atualizar os dados da academia")
            console.log(error)
          })
      }
      else
      {
        firestore()
          .collection('Academy')
          .doc(user.academyId)
          .update({
            academyName: academyName,
            userName: userName,
            updatedAt: new Date()
          })
          .then(() => {
            setLoading(false)
          })
      }
  }

  useEffect(() => {
    const subscribe = firestore()
      .collection('Academy')
      .doc(user.academyId)
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.data();
        if (data) {
          const { academyName, name, academyPhotoUri, valor, payment } = data;
          setAcademyData({ academyName, name, academyPhotoUri, valor, payment  });
        } else {
          // Trate o caso em que o documento não existe
          // setAcademyData(null); // Ou defina um valor padrão
        }
      })
      return () => subscribe()
  }, [])

  useEffect(() => {
    if(academyData){
      setAcademyName(academyData.academyName)
      setUserName(user.name)
    }
  }, [academyData])

  return (
    <View className="flex-1 p-3 bg-slate-200">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="justify-center items-center">
          <TouchableOpacity activeOpacity={0.7} onPress={handleAcademyPhoto}>
            <Image
              source={academyData?.academyPhotoUri ? {uri: academyData.academyPhotoUri || academyPhoto} : userPhotoDefault}
              className="w-32 h-32 rounded-full"
            />
          </TouchableOpacity>
          <View className="mb-5 w-full">
            <Input
              placeholder="Nome"
              onChangeText={setUserName}
              value={userName}
            />
            <Input
              placeholder="Nome da Academia"
              onChangeText={setAcademyName}
              value={academyName}
            />
            {academyData && <><View className={`${academyData?.payment ? 'bg-green-500' : 'bg-red-500'} border-gray-200 border justify-center items-center p-3 rounded-lg`}>
              {academyData?.payment ?
                <Text className="text-2xl text-white">
                  Mensalidade paga
                </Text>
                :
                <Text className="text-2xl text-white">
                  Mensalidade não paga
                </Text>}
            </View><View className="bg-white p-4 rounded-lg mt-2">
                <Text className="text-xl">
                  Valor da mensalidade - {academyData?.valor}
                </Text>
              </View></>}
          
          </View>
          <Button 
            title="Salvar"
            className="bg-green-500 mt-36"
            loading={loading}
            onPress={handleAcademyInformation}
          />
        </View>
      </ScrollView>
    </View>
  )
}
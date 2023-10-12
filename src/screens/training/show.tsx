import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'

import { AntDesign, MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import colors from "tailwindcss/colors";

import { Input } from "../../components/common/Input";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

type FormDataProps = {
  title: string
  serie: string
  repeticion: string
  imageUri?: string
}

const loginSchema = yup.object({
  title: yup.string().required('.'),
  serie: yup.string().required('.'),
  repeticion: yup.string().required('.'),
})

export function Exercise({route}: any){
  const { user } = useAuth()
  const { item, groupSelected } = route?.params

  const navigation = useNavigation()

  const [trainingPhoto, setTrainingPhoto] = useState('')
  const [editable, setEditable] = useState(item ? false : true)
  const [showModal, setShowModal] = useState(false)

  const { control, handleSubmit, formState: {errors} } = useForm<FormDataProps>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      title: item?.title || '',
      serie: item?.serie || '',
      repeticion: item?.repeticion || '',
      imageUri: item?.imageUri || ''
    }
  })

  async function handleEditTraining(data: FormDataProps){
    if(item){
      if(editable){
        if(trainingPhoto){
          const fileName = new Date().getTime()
          const MIME = trainingPhoto.match(/\.(?:.(?!\.))+$/)
          const reference = storage().ref(`/images/training/${fileName}${MIME}`)
          
          reference
            .putFile(trainingPhoto)
            .then(() => {
              Alert.alert('Upload concluido')
              storage()
                .ref(`/images/training/${fileName}${MIME}`)
                .getDownloadURL()
                .then((file) => {
                  firestore()
                    .collection('training')
                    .doc(item.id)
                    .update({
                      imageUri: file,
                      updatedAt: new Date(),
                      title: data.title,
                      serie: data.serie,
                      repeticion: data.repeticion,
                    })
                })
            })
            .catch(error => {
              Alert.alert("Falha ao atualizar o treino")
              console.log(error)
            })
        } else {
          firestore()
            .collection('training')
            .doc(item.id)
            .update({
              updatedAt: new Date(),
              ...data
            })
        }
      }
        setEditable(!editable)
    } else {
      if(editable){
        if(trainingPhoto) {
          const fileName = new Date().getTime()
          const MIME = trainingPhoto.match(/\.(?:.(?!\.))+$/)
          const reference = storage().ref(`/images/training/${fileName}${MIME}`)
          
          reference
            .putFile(trainingPhoto)
            .then(() => {
              Alert.alert('Upload concluido')
              storage()
                .ref(`/images/training/${fileName}${MIME}`)
                .getDownloadURL()
                .then((file) => {
                  firestore()
                    .collection('training')
                    .add({
                      academyId: user.academyId,
                      group: groupSelected,
                      imageUri: file,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      title: data.title,
                      serie: data.serie,
                      repeticion: data.repeticion,
                    })
                })
            })
            .catch(error => {
              Alert.alert("Falha ao criar o treino")
              console.log(error)
            })
          } else {
            firestore()
              .collection('training')
              .add({
                academyId: user.academyId,
                group: groupSelected,
                imageUri: data.imageUri,
                createdAt: new Date(),
                updatedAt: new Date(),
                ...data
              })
              .catch(error => {
                Alert.alert("Falha ao criar o treino")
                console.log(error)
              })
          }
      }
        setEditable(!editable)
    }
    navigation.goBack()
  }

  async function handleTrainingPhoto() {
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

      return setTrainingPhoto(photoSelected.assets[0].uri)
    }
  }
  
  function handleDeleteTraining(id: string) {
    Alert.alert("Deseja deletar o Treino?", '', [
      {
        text: "Cancelar",
        onPress: () => console.log("cancelado"),
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: () => {
          firestore()
          .collection('training')
          .doc(id)
          .delete()
        navigation.goBack()
        }
      }
    ])
  }
  
  function handleDeleteImage(path: string){
    storage()
      .ref(path)
      .delete()
      .then(() => Alert.alert('Imagem deletada com sucesso'))
  }
  
  return (
    <View className="flex-1 bg-slate-200">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={{ backgroundColor: colors.blue[600]}} className="flex-row justify-between items-center px-3">
            <View className="w-full">
              <View className="flex-row items-center mx-auto my-3">
                <Ionicons name="body-outline" size={24} color={colors.gray[200]} />
                <Text className="text-gray-200 text-xl uppercase mx-2">
                  {groupSelected ? groupSelected: item.group }
                </Text>
              </View>
              <Controller 
                control={control}
                name="title"
                render={({ field: {onChange, value} }) => (
                  <Input
                    editable={editable}
                    value={value}
                    placeholder="Nome do exercício"
                    notMessage={false}
                    style={{ backgroundColor: colors.blue[600]}}
                    className={`text-white ${editable ? 'border-2' : 'border-0'} text-xl font-bold mb-3`}
                    onChangeText={onChange}
                    errorMessage={errors.title?.message}
                  />
                )}
              />
            </View>
          </View>
          <View className="p-6">
            <TouchableOpacity
              className="w-full h-72 rounded-lg justify-center items-center"
              style={{borderStyle: 'dashed', borderWidth: trainingPhoto || item?.imageUri ? 0 : 1}}
              activeOpacity={editable ? 0.7 : 1} onPress={() => editable ? handleTrainingPhoto() : {}}
            >
             { trainingPhoto || item?.imageUri ? <Image
                className="w-full h-72 rounded-lg"
                source={{ uri: trainingPhoto || item.imageUri }}
              />
              :
              <MaterialCommunityIcons name="camera" size={40}/>}
            </TouchableOpacity>

            <View className="bg-white flex-row justify-between items-center rounded-lg mt-5 p-3">
              <View className="justify-center items-center w-2/5">
                <MaterialCommunityIcons name="weight-lifter" size={24} color="black" />
                <Controller 
                  control={control}
                  name="serie"
                  render={({ field: {onChange, value} }) => (
                    <Input
                      editable={editable}
                      value={value}
                      placeholder="Series"
                      notMessage={false}
                      className={`h-10 p-2 text-base ${editable ? 'border-2' : 'border-0'} text-center`}
                      onChangeText={onChange}
                      errorMessage={errors.serie?.message}
                    />
                  )}
                />
              </View>
              <View className="justify-center items-center w-2/5">
                <AntDesign name="retweet" size={24} color="black" />
                <Controller 
                  control={control}
                  name="repeticion"
                  render={({ field: {onChange, value} }) => (
                    <Input
                      editable={editable}
                      value={value}
                      placeholder="Repetições"
                      notMessage={false}
                      className={`h-10 p-2 text-base ${editable ? 'border-2' : 'border-0'} text-center`}
                      onChangeText={onChange}
                      errorMessage={errors.repeticion?.message}
                    />
                  )}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
        {user.isAdmin && <View className="absolute bottom-3 right-3 gap-2">
          {showModal && <TouchableOpacity
            activeOpacity={0.7}
            className="bg-red-600 w-14 h-14 rounded-full justify-center items-center bottom-3 right-3"
            onPress={() =>  handleDeleteTraining(item.id)}
          >
            <Feather name={"trash"}size={30} color={'white'}/>
          </TouchableOpacity>}

          {showModal && <View>
          {editable ?
            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-green-500 w-14 h-14 rounded-full justify-center items-center bottom-3 right-3"
              onPress={handleSubmit(handleEditTraining)}
            >
              <Feather name={"check"}size={30} color={'white'}/>
            </TouchableOpacity>
            :
            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-blue-600 w-14 h-14 rounded-full justify-center items-center bottom-3 right-3"
              onPress={() => setEditable(!editable)}
            >
              <Feather name={"edit-2"}size={30} color={'white'}/>
            </TouchableOpacity>
          }
          </View>}

          <TouchableOpacity
             activeOpacity={0.7} 
            className="bg-blue-600 w-14 h-14 rounded-full justify-center items-center bottom-3 right-3"
            onPress={() => setShowModal(!showModal)}
          >
            <Feather name={showModal ? "arrow-down" : "arrow-up"}size={30} color={'white'}/>
          </TouchableOpacity>
        </View>}
    </View>
  )
}
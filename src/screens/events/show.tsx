import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { Feather } from '@expo/vector-icons'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'

import { Input } from "../../components/common/Input";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { formatarData, parseDate } from "../../utils/date";
import { useNavigation } from "@react-navigation/native";

type FormDataProps = {
  title: string
  time: string
  data: string
  description: string
  imageUri?: string
}

const loginSchema = yup.object({
  title: yup.string().required('.'),
  time: yup.string().required('.'),
  data: yup.string().required('.'),
  description: yup.string().required('.'),
})

export function ShowEvent({ route }: any){
  const { user } = useAuth()
  const item = route?.params || {}
  const navigation = useNavigation()

  const [editable, setEditable] = useState(route?.params ? false : true)
  const [showModal, setShowModal] = useState(false)
  const [eventPhoto, setEventPhoto] = useState('')

  const { control, handleSubmit, formState: {errors} } = useForm<FormDataProps>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      title: item?.title || '',
      time: item?.time || '',
      data: item?.data ? formatarData(item?.data) : '',
      description: item?.description || '',
      imageUri: item?.imageUri || ''
    }
  })

  async function handleEditEvent(data: FormDataProps){
    if(route?.params){
      if(editable){
        if(eventPhoto){
          const fileName = new Date().getTime()
          const MIME = eventPhoto.match(/\.(?:.(?!\.))+$/)
          const reference = storage().ref(`/images/events/${fileName}${MIME}`)
          
          reference
            .putFile(eventPhoto)
            .then(() => {
              Alert.alert('Upload concluido')
              storage()
                .ref(`/images/events/${fileName}${MIME}`)
                .getDownloadURL()
                .then((file) => {
                  firestore()
                    .collection('events')
                    .doc(item.id)
                    .update({
                      imageUri: file,
                      data: parseDate(data.data).toISOString(),
                      title: data.title,
                      description: data.description,
                      time: data.time,
                      updatedAt: new Date()
                    })
                })
            })
            .catch(error => {
              Alert.alert("Falha ao atualizar o evento")
              console.log(error)
            })
        } else {
          firestore()
            .collection('events')
            .doc(item.id)
            .update({
              data: parseDate(data.data).toISOString(),
              title: data.title,
              description: data.description,
              time: data.time,
              updatedAt: new Date()
            })
            .catch(error => {
              Alert.alert("Falha ao atualizar o evento")
              console.log(error)
            })
        }
      }
        setEditable(!editable)
    } else {
      if(editable){
        if(eventPhoto){
          const fileName = new Date().getTime()
          const MIME = eventPhoto.match(/\.(?:.(?!\.))+$/)
          const reference = storage().ref(`/images/events/${fileName}${MIME}`)
          
          reference
            .putFile(eventPhoto)
            .then(() => {
              Alert.alert('Upload concluido')
              storage()
                .ref(`/images/events/${fileName}${MIME}`)
                .getDownloadURL()
                .then((file) => {
                  firestore()
                    .collection('events')
                    .add({
                      academyId: user.academyId,
                      imageUri: file,
                      data: parseDate(data.data).toISOString(),
                      title: data.title,
                      description: data.description,
                      time: data.time,
                      createdAt: new Date(),
                      updatedAt: new Date()
                    })
                })
            })
            .catch(error => {
              Alert.alert("Falha ao criar o evento")
              console.log(error)
            })
        } else {
          firestore()
            .collection('events')
            .add({
              academyId: user.academyId,
              data: parseDate(data.data).toISOString(),
              title: data.title,
              description: data.description,
              time: data.time,
              createdAt: new Date(),
              updatedAt: new Date()
            })
            .catch(error => {
              Alert.alert("Falha ao criar o evento")
              console.log(error)
            })
        }
      }
        setEditable(!editable)
    }
    navigation.goBack()
  }

  async function handleEventPhoto() {
    const photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [6, 4],
      allowsEditing: true,
    })

    if (!photoSelected.canceled) {
      const photoInfo = await FileSystem.getInfoAsync(
        photoSelected.assets[0].uri,
      )

      if (photoInfo.exists && (photoInfo.size / 1024 / 1024) > 10) {
        return Alert.alert('Imagem muito grande')
      }

      return setEventPhoto(photoSelected.assets[0].uri)
    }
  }

  function handleDeleteEvent(id:string){
    Alert.alert("Deseja deletar o Evento?", '', [
      {
        text: "Cancelar",
        onPress: () => console.log("cancelado"),
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: () => {
          firestore()
            .collection('events')
            .doc(id)
            .delete()
          navigation.goBack()
        }
      }
    ])
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="bg-slate-200 ">
      <View className="items-center flex-1">
        <TouchableOpacity
          className="absolute w-full items-center h-56"
          activeOpacity={editable ? 0.7 : 1} 
          onPress={() => editable ? handleEventPhoto() : {}}
        >
          { eventPhoto || item.imageUri ?
            (<Image 
            source={{ uri: eventPhoto || item.imageUri || ''}}
            className="w-full h-56" 
            />)
            :
            (<Feather name="camera" size={30} style={{marginTop: 50}}/>)
          }
        </TouchableOpacity>

        <View className="bg-white w-11/12 py-4 mt-36 rounded-md">
          <Controller 
            control={control}
            name="title"
            render={({ field: {onChange, value} }) => (
              <Input 
                editable={editable}
                value={value}
                placeholder="Digite o Título"
                notMessage={false}
                className={`text-3xl font-bold ${editable ? 'border-2' : 'border-0'} focus:border-2 -my-2`}
                onChangeText={onChange}
                errorMessage={errors.title?.message}
              />
            )}
          />

          <Controller 
            control={control}
            name="data"
            render={({ field: {onChange, value} }) => (
              <Input 
                editable={editable}
                value={value}
                keyboardType="numeric"
                placeholder="Digite a data"
                notMessage={false}
                className={`text-gray-300 text-xs ${editable ? 'border-2' : 'border-0'} focus:border-2 h-11 -my-2`}
                onChangeText={(text) => {
                  if (text.length === 2 || text.length === 5) {
                    if (text.length > value.length) {
                      onChange(text + '/')
                      return
                    } else {
                      onChange(text.slice(0, -1))
                      return
                    }
                  }
                  if (text.length > 10) return
                  onChange(text)
                }}
                errorMessage={errors.data?.message}
              />
            )}
          />

          <Controller 
            control={control}
            name="time"
            render={({ field: {onChange, value} }) => (
              <Input 
                editable={editable}
                value={value}
                placeholder="Digite a hora"
                keyboardType="numeric"
                notMessage={false}
                className={`text-gray-300 text-xs ${editable ? 'border-2' : 'border-0'} focus:border-2 h-11 -my-2`}
                onChangeText={(text) => {
                  if (text.length === 2) {
                    if (text.length > value.length) {
                      onChange(text + ':')
                      return
                    } else {
                      onChange(text.slice(0, -1))
                      return
                    }
                  }
                  if (text.length > 5) return
                  onChange(text)
                }}
                errorMessage={errors.time?.message}
              />
            )}
          />
        </View>

        <View className="bg-white w-11/12 mt-6 rounded-md mb-16">
          <Text className="text-2xl font-bold m-4">
            Descrição
          </Text>
          <Controller 
            control={control}
            name="description"
            render={({ field: {onChange, value} }) => (
              <Input 
                editable={editable}
                value={value}
                placeholder="Descrição do evento"
                notMessage={false}
                multiline={true}
                numberOfLines={12}
                className={`text-gray-300 text-xs ${editable ? 'border-2' : 'border-0'} focus:border-2 h-44 -my-2`}
                onChangeText={onChange}
                errorMessage={errors.description?.message}
              />
            )}
          />
        </View>
        {user.isAdmin && <View className="absolute bottom-3 right-3 gap-2">
          {showModal && <TouchableOpacity
            activeOpacity={0.7}
            className="bg-red-600 w-14 h-14 rounded-full justify-center items-center bottom-3 right-3"
            onPress={() => handleDeleteEvent(item.id)}
          >
            <Feather name={"trash"}size={30} color={'white'}/>
          </TouchableOpacity>}

          {showModal && <View>
          {editable ?
            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-green-600 w-14 h-14 rounded-full justify-center items-center bottom-3 right-3"
              onPress={handleSubmit(handleEditEvent)}
            >
              <Feather name={"check"} size={30} color={'white'}/>
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
    </ScrollView>
  )
}
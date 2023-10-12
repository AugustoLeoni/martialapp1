import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'

import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import { useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../hooks/useAuth";
import { Input } from "../../../components/common/Input";

export function NewStore({route}: any){
  const { user } = useAuth()
  const { item } = route?.params || {}

  const navigation = useNavigation()

  const [title, setTitle] = useState(item?.title || '')
  const [valor, setValor] = useState(item?.valor || '')
  const [stock, setStock] = useState(item?.stock || 0)
  const [productPhoto, setProductPhoto] = useState(item?.imageUri || '')
  const [editable, setEditable] = useState(item ? false : true)
  const [showModal, setShowModal] = useState(false)

  async function handleEditStore(){
    if(item){
      if(editable){
        if(productPhoto){
          firestore()
          .collection('store')
          .doc(item.id)
          .update({
            updatedAt: new Date(),
            title: title,
            stock: stock,
            valor: valor,
          })
        } else {
          const fileName = new Date().getTime()
          const MIME = productPhoto.match(/\.(?:.(?!\.))+$/)
          const reference = storage().ref(`/images/store/${fileName}${MIME}`)
          
          reference
            .putFile(productPhoto)
            .then(() => {
              Alert.alert('Upload concluido')
              storage()
                .ref(`/images/store/${fileName}${MIME}`)
                .getDownloadURL()
                .then((file) => {
                  firestore()
                    .collection('store')
                    .doc(item.id)
                    .update({
                      imageUri: file,
                      updatedAt: new Date(),
                      title: title,
                      stock: stock,
                      valor: valor,
                    })
                })
            })
            .catch(error => {
              Alert.alert("Falha ao atualizar a loja")
              console.log(error)
            })
        }
      }
        setEditable(!editable)
    } else {
      if(editable){
        if(productPhoto) {
          const fileName = new Date().getTime()
          const MIME = productPhoto.match(/\.(?:.(?!\.))+$/)
          const reference = storage().ref(`/images/store/${fileName}${MIME}`)
          
          reference
            .putFile(productPhoto)
            .then(() => {
              Alert.alert('Upload concluido')
              storage()
                .ref(`/images/store/${fileName}${MIME}`)
                .getDownloadURL()
                .then((file) => {
                  firestore()
                    .collection('store')
                    .add({
                      academyId: user.academyId,
                      imageUri: file,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      title: title,
                      stock: stock,
                      valor: valor,
                    })
                })
            })
            .catch(error => {
              Alert.alert("Falha ao atualizar a loja")
              console.log(error)
            })
          } else {
            firestore()
              .collection('store')
              .add({
                academyId: user.academyId,
                imageUri: productPhoto,
                createdAt: new Date(),
                updatedAt: new Date(),
                title: title,
                stock: stock,
                valor: valor,
              })
              .catch(error => {
                Alert.alert("Falha ao atualizar a loja")
                console.log(error)
              })
          }
      }
        setEditable(!editable)
    }
    navigation.goBack()
  }

  async function handleProductPhoto() {
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

      return setProductPhoto(photoSelected.assets[0].uri)
    }
  }
  
  function handleDeleteProduct(id: string) {
    Alert.alert("Deseja deletar o Produto?", '', [
      {
        text: "Cancelar",
        onPress: () => console.log("cancelado"),
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: () => {
          firestore()
            .collection('store')
            .doc(id)
            .delete()
          navigation.goBack()
        }
      }
    ])
  }
  
  return (
    <View className="flex-1 bg-slate-200">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="justify-center items-center mt-5">
          <View className="h-80 w-72">
            <TouchableOpacity
              className="w-full h-full justify-center items-center bg-white"
              activeOpacity={editable ? 0.7 : 1} onPress={() => editable ? handleProductPhoto() : {}}
            >
             { productPhoto ? <Image
                className="w-full h-full rounded-lg"
                source={{ uri: productPhoto }}
              />
              :
              <MaterialCommunityIcons name="camera" size={40}/>}
            </TouchableOpacity>
           
            <View className="bg-gray-400 w-full h-20 absolute bottom-0 opacity-60 rounded-sm"/>
            <View className="absolute bottom-0 w-full">
              { editable ? 
              <Input 
                placeholder="Nome do produto"
                className="text-xl text-white font-bold w-72 h-8 -my-2 bg-gray-300"
                onChangeText={setTitle}
                value={title}
              />
              :
              <Text className="text-xl text-white font-bold">teste</Text>
              }
              { editable ?
              <Input 
                placeholder="Valor do produto"
                className="text-xl text-white font-bold w-72 h-8 -my-1 bg-gray-300"
                onChangeText={setValor}
                value={valor}
              />
              :
              <Text className="text-xl text-white font-bold">R$ 2,00</Text>
              }
            </View>
          </View>
          <View className="w-72 p-3">
            <View className={`bg-white w-72 ${user.isAdmin ? 'h-44' : 'h-12'} absolute opacity-40`}/>
            <Text className="text-base mb-3">Quantidade no estoque</Text>

            <View className="flex-row gap-4">
              <TouchableOpacity
                className="bg-white w-12 h-12 items-center justify-center rounded-lg shadow-sm shadow-gray-400"
                onPress={() => setStock(stock - 1)}
              >
                <Feather name="minus" size={25} />
              </TouchableOpacity>
              <View className="bg-white w-12 h-12 items-center justify-center rounded-lg">
                <Text>{stock}</Text>
              </View>
              <TouchableOpacity
                className="bg-white w-12 h-12 items-center justify-center rounded-lg shadow-sm shadow-gray-400"
                onPress={() => setStock(stock + 1)}
              >
                <Feather name="plus" size={25} />
              </TouchableOpacity>
              </View>
          </View>
        </View>
      </ScrollView>
        {user.isAdmin && <View className="absolute bottom-3 right-3 gap-2">
          {showModal && <TouchableOpacity
            activeOpacity={0.7}
            className="bg-red-600 w-14 h-14 rounded-full justify-center items-center bottom-3 right-3"
            onPress={() => handleDeleteProduct(item.id)}
          >
            <Feather name={"trash"}size={30} color={'white'}/>
          </TouchableOpacity>}

          {showModal && <View>
          {editable ?
            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-green-500 w-14 h-14 rounded-full justify-center items-center bottom-3 right-3"
              onPress={handleEditStore}
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
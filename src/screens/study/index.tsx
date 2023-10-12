import { Alert, Dimensions, FlatList, Modal, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { Button } from "../../components/common/Button";
import React, { useEffect, useState } from "react";
import Pdf from "react-native-pdf";
import { Input } from "../../components/common/Input";
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import { useAuth } from "../../hooks/useAuth";
import { Feather, MaterialIcons } from '@expo/vector-icons'
import colors from "tailwindcss/colors";
import { useFocusEffect } from "@react-navigation/native";

type PropsDocumentData = {
  id: string
  documentUri: string
  title: string
}

export function Study(){
  const { user } = useAuth()
  const [documentUriLocal, setDocumentUriLocal] = useState('')
  const [documentName, setDocumentName] = useState('Selecionado')
  const [documentData, setDocumentData] = useState<PropsDocumentData[]>([])
  const [text, setText] = useState('')
  const [title, setTitle] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showPdf, setShowPdf] = useState(false)
  const [source, setSource] = useState({ uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true })
  const [numberOfPages, setNumberOfPages] = useState(0)
  const [page, setPage] = useState(0)
  const [selectPdfViewMode, setSelectPdfViewMode] = useState(false)

  function handleNewDocument(){
    const fileName = new Date().getTime()
    const MIME = documentUriLocal.match(/\.(?:.(?!\.))+$/)
    const reference = storage().ref(`/document/study/${fileName}${MIME}`)
    
    reference
      .putFile(documentUriLocal)
      .then(() => {
        Alert.alert('Upload concluido')
        storage()
          .ref(`/document/study/${fileName}${MIME}`)
          .getDownloadURL()
          .then((file) => {
            firestore()
              .collection('study')
              .add({
                documentUri: file,
                title: text,
                academyId: user.academyId,
                createdAt: new Date(),
              })
          })
      })
      .catch(error => {
        Alert.alert("Falha ao adiconar PDF")
        console.log(error)
      })
      setText('')
      setDocumentName('')
  }

  async function handleDocument(){
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf'
      })
  
      if(result.canceled) {
        return Alert.alert('Voce não selecionou nenhum documento')
      }
      setDocumentUriLocal(result.assets[0].uri)
      setDocumentName(result.assets[0].name)
    } catch(error) {
      Alert.alert("Falha ao adicionar PDF")
      console.log(error)
    }
  }

  function handleDelete(id: string) {
    Alert.alert("Deseja deletar o pdf?", "", [
      {
        text: "Cancelar",
        onPress: () => console.log("cancelado"),
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: () => {
          firestore()
          .collection('study')
          .doc(id)
          .delete()
        }
      }
    ])
  }

  useEffect(() => {
    const subscribe = firestore()
      .collection('study')
      .where('academyId', '==', user.academyId)
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as PropsDocumentData[]
        setDocumentData(data)
      })

      return () => subscribe()
  }, [])

  return(
    <View className="flex-1 bg-slate-200">
      <FlatList 
        data={documentData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          return(
            <TouchableOpacity
              className="bg-white flex-row p-3 m-2 justify-between rounded-xl items-center"
              onPress={() => {
                setSource({ uri: item.documentUri, cache: true })
                setTitle(item.title)
                setShowPdf(!false)
              }}
            >
              <View className="flex-row items-center">
                <MaterialIcons name="arrow-drop-up" size={40}/>
                <Text className="text-2xl">{item.title}</Text>
              </View>
             { user.isAdmin &&
              <TouchableOpacity
                  onPress={() => {
                    handleDelete(item.id)
                  }}
                  activeOpacity={0.7}
                >
                  <Feather name="trash-2" size={20}/>
                </TouchableOpacity>
              }
            </TouchableOpacity>
          )
        }}
      />
      {user.isAdmin && <Button 
        title="+" 
        onPress={() => setShowModal(!showModal)}
        className="w-16 rounded-full absolute bottom-3 right-3"
      />}
      <Modal
        animationType="slide"
        visible={showPdf}
        onRequestClose={() => {
          setShowPdf(!showPdf);
        }}
      >
        <View className="flex-1">
          <View className="p-3 flex-row justify-between items-center border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowPdf(!showPdf)} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back-ios" size={20}/>
            </TouchableOpacity>
            <Text className="text-lg text-gray-300">{title}</Text>
            <TouchableOpacity onPress={() => setSelectPdfViewMode(!selectPdfViewMode)} activeOpacity={0.7} className="flex-row">
              <MaterialIcons name="horizontal-split" size={30} color={!selectPdfViewMode ? colors.gray[200] : colors.black}/>
              <MaterialIcons name="vertical-split" size={30} color={selectPdfViewMode ? colors.gray[200] : colors.black}/>
            </TouchableOpacity>
          </View>
          <View className="h-1 w-full bg-gray-100">
            <View style={{width: `${((page)/numberOfPages) * 100}%`}} className="bg-blue-500 h-2"/>
          </View>
          <Pdf
            trustAllCerts={false}
            source={source}
            horizontal={selectPdfViewMode}
            onLoadComplete={(numberOfPages,filePath) => {
              setNumberOfPages(numberOfPages)
            }}
            onPageChanged={(page,numberOfPages) => {
              setPage(page)
            }}
            onError={(error) => {
                console.log(error);
            }}
            onPressLink={(uri) => {
                console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}/>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}
      >
        <View className="flex-1 justify-center items-center p-10">
          <View className="w-full gap-1 bg-white p-3 rounded-xl items-end">
            <TouchableOpacity activeOpacity={0.7} onPress={() => setShowModal(!showModal)}>
              <Feather name="x-square" size={30} color={colors.red[400]}/>
            </TouchableOpacity>
            <Input placeholder="Titulo" onChangeText={setText} value={text}/>
            <Button 
              title="Adicionar um arquivo PDF"
              onPress={handleDocument}
            />
            <Text className="w-full border p-2 border-gray-300 text-gray-300">{documentName}</Text>
            <Button title="Salvar" onPress={handleNewDocument} style={{backgroundColor: colors.green[500]}}/>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  pdf: {
      flex:1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height,
  }
});
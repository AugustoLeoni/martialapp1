import { Alert, Dimensions, FlatList, Modal, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from "react";
import Pdf from "react-native-pdf";
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import colors from "tailwindcss/colors";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";

type PropsDocumentData = {
  id: string
  documentUri: string
}

export function ClassDay(){
  const { user } = useAuth()
  const [documentUriLocal, setDocumentUriLocal] = useState('')
  const [documentName, setDocumentName] = useState('Selecionado')
  const [documentData, setDocumentData] = useState<PropsDocumentData[]>()
  const [showModal, setShowModal] = useState(false)
  const [numberOfPages, setNumberOfPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  function handleNewDocument(idPDF: string){
    setLoading(true)
    if(documentData && idPDF != '')
    {
      const fileName = new Date().getTime()
      const MIME = documentUriLocal.match(/\.(?:.(?!\.))+$/)
      const reference = storage().ref(`/document/classDayPdf/${fileName}${MIME}`)
      
      reference
        .putFile(documentUriLocal)
        .then(() => {
          Alert.alert('Upload concluido')
          setShowModal(false)
          setDocumentName('')
          setLoading(false)
          storage()
            .ref(`/document/classDayPdf/${fileName}${MIME}`)
            .getDownloadURL()
            .then((file) => {
              firestore()
                .collection('classDayPdf')
                .doc(idPDF)
                .update({
                  documentUri: file,
                  updatedAt: new Date(),
                })
            })
        })
        .catch(error => {
          Alert.alert("Falha ao atualizar o PDF")
          console.log(error)
        })
    }
    else
    {
      const fileName = new Date().getTime()
      const MIME = documentUriLocal.match(/\.(?:.(?!\.))+$/)
      const reference = storage().ref(`/document/classDayPdf/${fileName}${MIME}`)
      
      reference
        .putFile(documentUriLocal)
        .then(() => {
          Alert.alert('Upload concluido')
          setShowModal(false)
          setDocumentName('')
          setLoading(false)
          storage()
            .ref(`/document/classDayPdf/${fileName}${MIME}`)
            .getDownloadURL()
            .then((file) => {
              firestore()
                .collection('classDayPdf')
                .add({
                  documentUri: file,
                  academyId: user.academyId,
                  createdAt: new Date(),
                })
            })
        })
        .catch(error => {
          Alert.alert("Falha ao adicionar o PDF")
          console.log(error)
        })
    }
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
      Alert.alert("Falha ao carregar o PDF")
      console.log(error)
    }
  }

  useEffect(() => {
    const subscribe = firestore()
      .collection('classDayPdf')
      .where('academyId', '==', user.academyId)
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          };
        }) as PropsDocumentData[]
        if(data.length > 0){
          setDocumentData(data)
        }
      })

      return () => subscribe()
  }, [])
  return(
    <View className="flex-1 bg-slate-200">
      <View className="flex-1">
          <View className="h-1 w-full bg-gray-100">
            <View style={{width: `${((page)/numberOfPages) * 100}%`}} className="bg-blue-500 h-2"/>
          </View>
         { documentData && documentData[0].documentUri && <Pdf
            trustAllCerts={false}
            source={{ uri: documentData ? documentData[0].documentUri : '', cache: true}}
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
            style={styles.pdf}/>}
        </View>
      {user.isAdmin && <Button 
        title="+" 
        onPress={() => setShowModal(!showModal)}
        className="w-16 rounded-full absolute bottom-3 right-3"
      />}

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
            <Button 
              title="Adicionar um arquivo PDF"
              onPress={handleDocument}
            />
            <Text className="w-full border p-2 border-gray-300 text-gray-300">{documentName}</Text>
            <Button 
              title="Salvar" 
              loading={loading} 
              onPress={() => handleNewDocument(documentData ? documentData[0].id : '')} 
              style={{backgroundColor: colors.green[500]}}
            />
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
import { FlatList, Modal, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import { useEffect, useState } from "react";
import { Image } from "react-native";

interface Option {
  id: string;
  imageUrl: string; 
  title: string;
  activeted: boolean;
}

interface Props {
  options: Option[]
  onChangeSelect: (id: string) => void
  text: string
  OptionComponent: React.ComponentType<{
    item: Option;
    selected: string;
    change: (id: string, title: string) => void;
  }>
  previewId: string
}

export function SelectInsignia({options, onChangeSelect, text, OptionComponent, previewId}: Props){
  const [tsx, setTxt] = useState(text)
  const [selected, setSelected] = useState(previewId)
  const [showModal, setShowModal] = useState(false)
  const [imageSelected, setImageSelected] = useState('https://www.bemdormirbemviver.com.br/wp-content/uploads/2021/05/nao-lavar-a-seco.png')

  function selectImageInsignia(){
    options.forEach(insignia => {
      if(insignia.id === previewId && previewId){
        setImageSelected(insignia.imageUrl)
      }
    })
  }

  function renderOption(item: Option){
    return (
      <OptionComponent item={item} selected={selected} change={(id: string, title: string) => {
        onChangeSelect(id)
        setSelected(id)
        setTxt(title)
        setShowModal(false)
      }}/>
    )
  }

  useEffect(() => {
    selectImageInsignia()
    const selectedOption = options.find(option => option.id === previewId)
    if (selectedOption) {
      setTxt(selectedOption.title)
      onChangeSelect(selectedOption.id)
      setSelected(selectedOption.id)
    }
  }, [previewId, options]);

  return (
    <View className="w-full my-2">
      <TouchableOpacity
        onPress={() => setShowModal(!showModal)}
        activeOpacity={0.7}
        className="border-2 h-16 rounded-lg border-gray-200 bg-white px-4 focus:border-blue-500 justify-center items-start"
      >
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-row items-center justify-center">
            <Image source={{uri: imageSelected}} className="w-12 h-12 mr-4" style={{resizeMode: 'contain'}}/>
            <Text className="text-lg text-gray-700">
              {tsx}
            </Text>
          </View>
          <MaterialIcons name={showModal ? "arrow-drop-up" : "arrow-drop-down"} size={30}/>
        </View>
      </TouchableOpacity>

      <Modal 
        animationType="slide" 
        visible={showModal} 
        onRequestClose={() => setShowModal(false)}
        className="bg-slate-200"
      >
        <SafeAreaView>
          <View className="p-3 flex-row justify-between items-center border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowModal(!showModal)} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back-ios" size={20}/>
            </TouchableOpacity>
            <Text className="text-lg text-gray-300">{text}</Text>
            <TouchableOpacity onPress={() => setShowModal(!showModal)} activeOpacity={0.7}>
              <Text className="text-sm text-blue-600 font-bold">Cancelar</Text>
            </TouchableOpacity>
          </View>

          <FlatList 
            data={options}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              return (
                renderOption(item)
              )
            }}
            ListFooterComponent={() => (
              <View className="h-20"/>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  )
}
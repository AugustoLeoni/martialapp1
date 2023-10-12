import { FlatList, Modal, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import { useEffect, useState } from "react";

type ColorItem = {
  id: string;
  colorBelt: string;
  simbolBelt?: string;
  colorPrimary?: string;
  colorSecundary?: string;
  colorThird?: string;
  colorFourth?: string;
};

interface Props {
  options: ColorItem[]
  onChangeSelect: (color: string) => void
  text: string
  previewColor: string
}

export function SelectGraduate({options, onChangeSelect, text, previewColor}: Props){
  const [color, setColor] = useState('')
  const [selected, setSelected] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [beltSelected, setBeltSelected] = useState({} as ColorItem)

  useEffect(() => {
    const result = options.find(obj => obj.id === previewColor)
    if(result){
      setBeltSelected(result)
    }
  }, [previewColor, color])

  return (
    <View className="w-full my-2">
      <TouchableOpacity
        onPress={() => setShowModal(!showModal)}
        activeOpacity={0.7}
        className="border-2 h-16 rounded-lg border-gray-200 bg-white px-4 focus:border-blue-500 justify-center items-start"
      >
        <View className="flex-row items-center justify-between w-full">
          {
            beltSelected && previewColor ?
              <View style={{backgroundColor: beltSelected.colorBelt}} className="h-10 w-2/3 border rounded-md justify-center items-center">
                  {
                    beltSelected.simbolBelt == 'star' &&
                    <View className="absolute justify-center items-center">
                      <MaterialIcons name="star" size={40} style={{position: "absolute"}} color={beltSelected.colorSecundary}/>
                      <MaterialIcons name="star" size={30} style={{position: "absolute"}} color={beltSelected.colorPrimary}/>
                    </View>
                  }
                  {
                    beltSelected.simbolBelt == 'belt' &&
                    <View className="flex-row gap-1">
                      <View 
                        className="h-10 w-2"
                        style={{backgroundColor: beltSelected.colorPrimary}}
                      />

                      <View 
                        className="h-10 w-2"
                        style={{backgroundColor: beltSelected.colorSecundary}}
                      />

                      <View 
                        className="h-10 w-2"
                        style={{backgroundColor: beltSelected.colorThird}}
                      />

                      <View 
                        className="h-10 w-2"
                        style={{backgroundColor: beltSelected.colorFourth}}
                      />
                    </View>
                  }
              </View>
            :
              <Text className="text-lg text-gray-700">
                {text}
              </Text>
          }
          <MaterialIcons name={showModal ? "arrow-drop-up" : "arrow-drop-down"} size={30}/>
        </View>
      </TouchableOpacity>

      <Modal 
        animationType="slide" 
        visible={showModal} 
        onRequestClose={() => setShowModal(!showModal)}
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
            data={options || []}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelected(item.id)
                    onChangeSelect(item.id)
                    setColor(item.colorBelt)
                    setShowModal(!showModal)
                  }}
                  activeOpacity={0.4}
                  className={`border-b-gray-200 border-b p-3 ${item.id === selected && 'bg-gray-100'}`}
                >
                  <View style={{backgroundColor: item.colorBelt}} className="h-10 border rounded-md justify-center items-center">
                  
                  {
                    item.simbolBelt == 'star' &&
                    <View className="absolute justify-center items-center">
                      <MaterialIcons name="star" size={40} style={{position: "absolute"}} color={item.colorSecundary}/>
                      <MaterialIcons name="star" size={30} style={{position: "absolute"}} color={item.colorPrimary}/>
                    </View>
                  }
                  {
                    item.simbolBelt == 'belt' &&
                    <View className="flex-row gap-1">
                      <View 
                        className="h-10 w-2"
                        style={{backgroundColor: item.colorPrimary}}
                      />

                      <View 
                        className="h-10 w-2"
                        style={{backgroundColor: item.colorSecundary}}
                      />

                      <View 
                        className="h-10 w-2"
                        style={{backgroundColor: item.colorThird}}
                      />

                      <View 
                        className="h-10 w-2"
                        style={{backgroundColor: item.colorFourth}}
                      />
                    </View>
                  }
                </View>
                </TouchableOpacity>
              )
            }}
          />
        </SafeAreaView>
      </Modal>
    </View>
  )
}
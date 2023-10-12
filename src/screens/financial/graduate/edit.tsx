import { View, ScrollView, TouchableOpacity, FlatList, Alert, Text } from "react-native";
import { Input } from "../../../components/common/Input";
import ColorPicker, {Panel3, BrightnessSlider, Panel2, Panel1, Panel4} from "reanimated-color-picker";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import firestore from '@react-native-firebase/firestore';

import { Feather, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native";

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
  title: string;
  colors: ColorItem[];
};

export function GraduateEdit({ route }: any){
  const { user } = useAuth()
  const { item } = route?.params || {}
  const navigation = useNavigation()
  
  const [colorId, setColorId] = useState('')
  const [typeChangeColor, setTypeChangeColor] = useState('belt')
  const [graduate, setGraduate] = useState<GraduateState>({
    title: item?.title || '',
    colors: item?.colors || [],
  })

  const onSelectColor = ({ hex }: any) => {
    if(typeChangeColor === 'belt'){
      const updatedColors = graduate.colors.map((colorMap) => {
        if (colorMap.id === colorId) {
          return { ...colorMap, colorBelt: hex };
        }
        return colorMap;
      });
  
      setGraduate({ ...graduate, colors: updatedColors });
    }
    if(typeChangeColor === 'primary'){
      const updatedColors = graduate.colors.map((colorMap) => {
        if (colorMap.id === colorId) {
          return { ...colorMap, colorPrimary: hex, colorSecundary: colorMap.simbolBelt === 'star' ? hex : ''};
        }
        return colorMap;
      });
  
      setGraduate({ ...graduate, colors: updatedColors });
    }
    if(typeChangeColor === 'secondary'){
      const updatedColors = graduate.colors.map((colorMap) => {
        if (colorMap.id === colorId) {
          return { ...colorMap, colorSecundary: hex };
        }
        return colorMap;
      });
  
      setGraduate({ ...graduate, colors: updatedColors });
    }
    if(typeChangeColor === 'third'){
      const updatedColors = graduate.colors.map((colorMap) => {
        if (colorMap.id === colorId) {
          return { ...colorMap, colorThird: hex };
        }
        return colorMap;
      });
  
      setGraduate({ ...graduate, colors: updatedColors });
    }
    if(typeChangeColor === 'fourth'){
      const updatedColors = graduate.colors.map((colorMap) => {
        if (colorMap.id === colorId) {
          return { ...colorMap, colorFourth: hex };
        }
        return colorMap;
      });
  
      setGraduate({ ...graduate, colors: updatedColors });
    }
  }

  function handleTypeChange(type: string){
    setTypeChangeColor(type)
  }

  function generateUniqueId() {
    const timestamp = new Date().getTime();
    const random = Math.random();
    const uniqueId = `${timestamp}-${random}`;
  
    return uniqueId;
  }

  function handleNewColor() {
    const newColor = 'white';
    const uniqueId = generateUniqueId()
    const newColors = [...graduate.colors, { id: uniqueId, colorBelt: newColor, simbolBelt: '', colorPrimary: '', colorSecundary: '' }];
    setGraduate({ ...graduate, colors: newColors });
    setColorId(uniqueId)
    setTypeChangeColor('belt')
  }

  function handleChangeSimbol() {
    const blackColor = 'black'
  
    if (colorId !== null) {
      const updatedColors = graduate.colors.map((color) => {
        if (color.id === colorId) {
          let newSimbol = '';
  
          switch (color.simbolBelt) {
            case '':
              newSimbol = 'star';
              break;
            case 'star':
              newSimbol = 'belt';
              break;
            case 'belt':
              newSimbol = '';
              break;
            default:
              break;
          }
          return {
            ...color,
            simbolBelt: newSimbol,
            colorPrimary: blackColor,
            colorSecundary: newSimbol === 'star' ? blackColor : '',
          };
        }
        return color;
      });
      setGraduate({ ...graduate, colors: updatedColors });
    }
  }

  function handleDeleteColor(colorIdDelete: string) {
    const updatedColors = graduate.colors.filter((color) => color.id !== colorIdDelete);

    setGraduate({ ...graduate, colors: updatedColors });

    if(updatedColors.length > 0){
      setColorId(updatedColors[updatedColors.length - 1].id)
      setTypeChangeColor('belt')
    }
  }

  function handleCrateGraduate() {
    if(route?.params){
      firestore()
        .collection('graduate')
        .doc(item.id)
        .update({
          ...graduate
        })
    } else {
      firestore()
        .collection('graduate')
        .add({
          academyId: user.academyId,
          ...graduate
        })
        .then(() => Alert.alert('Cadastro realizado com sucesso!'))
    }
    navigation.goBack()
  }

  return (
    <View>
      <Input 
        placeholder="Titulo da graduação" 
        className="mx-3"
        value={graduate.title}
        onChangeText={(text) =>
          setGraduate((prevState) => ({ ...prevState, title: text }))
        }
      />
      <View className="h-28 flex-row mx-3 flex-wrap">
        <FlatList 
          data={graduate.colors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity 
                onPress={() => {
                  setColorId(item.id)
                }}
              >
                <View 
                  style={{ backgroundColor: item.colorBelt}}
                  className={`
                    justify-center 
                    items-center
                    ${colorId === item.id ? 'w-20' : 'w-12'}
                    ${colorId === item.id ? 'h-20' : 'h-12'}
                  `}
                >
                  {
                    item.simbolBelt == 'star' &&
                    <View className="absolute justify-center items-center">
                      <MaterialIcons name="star" size={colorId === item.id ? 60 : 40} style={{position: "absolute"}} color={item.colorSecundary}/>
                      <MaterialIcons name="star" size={colorId === item.id ? 40 : 20} style={{position: "absolute"}} color={item.colorPrimary}/>
                    </View>
                  }
                  {
                    item.simbolBelt == 'belt' &&
                    <View className="flex-row gap-1">
                      <View 
                        className={`${colorId === item.id ? 'h-20' : 'h-12'} w-2`}
                        style={{backgroundColor: item.colorPrimary}}
                      />

                      <View 
                        className={`${colorId === item.id ? 'h-20' : 'h-12'} w-2`}
                        style={{backgroundColor: item.colorSecundary}}
                      />

                      <View 
                        className={`${colorId === item.id ? 'h-20' : 'h-12'} w-2`}
                        style={{backgroundColor: item.colorThird}}
                      />

                      <View 
                        className={`${colorId === item.id ? 'h-20' : 'h-12'} w-2`}
                        style={{backgroundColor: item.colorFourth}}
                      />
                    </View>
                  }
                </View>
              </TouchableOpacity>
            )
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
      <ScrollView>
        <View className="justify-center items-center my-8">
          <ColorPicker
            style={{ width: '60%' }}
            value="red"
            onComplete={onSelectColor}
          >
            <Panel4 />
            
          </ColorPicker>
        </View>
        
        <View className="flex-row justify-between px-3 mt-5">
          <View className="flex-row flex-wrap w-32">
            <TouchableOpacity
              className={`${typeChangeColor === 'belt' ? 'bg-blue-500' : 'bg-blue-400'} w-14 h-14 rounded-full items-center justify-center m-1`}
              onPress={() => handleTypeChange('belt')}
            >
              <View className="w-4 h-4 bg-white"/>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blue-400 w-14 h-14 rounded-full items-center justify-center m-1"
              onPress={handleChangeSimbol}
            >
              <Feather name="repeat" size={20} color={'white'}/>
            </TouchableOpacity>

            {graduate.colors.map(item => {
              if(item.id === colorId && item.simbolBelt === 'star'){
                return <View className="flex-row" key={item.id}>
                  <TouchableOpacity
                    className={`${typeChangeColor === 'primary' ? 'bg-blue-500' : 'bg-blue-400'} w-14 h-14 rounded-full items-center justify-center m-1`}
                    onPress={() => handleTypeChange('primary')}
                    >
                    <MaterialIcons name="star" size={20} color={'white'}/>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`${typeChangeColor === 'secondary' ? 'bg-blue-500' : 'bg-blue-400'} w-14 h-14 rounded-full items-center justify-center m-1`}
                    onPress={() => handleTypeChange('secondary')}
                  >
                    <Feather name="star" size={20} color={'white'} style={{position: 'absolute'}}/>
                  </TouchableOpacity>
                </View> 
              }
            })}

            {graduate.colors.map(item => {
              if(item.id === colorId && item.simbolBelt === 'belt'){
                return <View className="flex-row flex-wrap" key={item.id}>
                  <TouchableOpacity
                    className={`${typeChangeColor === 'primary' ? 'bg-blue-500' : 'bg-blue-400'} w-14 h-14 rounded-full items-center justify-center m-1`}
                    onPress={() => handleTypeChange('primary')}
                    >
                      <View className="flex-row gap-1">
                        <View className="h-6 w-1 bg-white"/>
                        <View className="h-6 w-1 bg-gray-300"/>
                        <View className="h-6 w-1 bg-gray-300"/>
                        <View className="h-6 w-1 bg-gray-300"/>
                      </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`${typeChangeColor === 'secondary' ? 'bg-blue-500' : 'bg-blue-400'} w-14 h-14 rounded-full items-center justify-center m-1`}
                    onPress={() => handleTypeChange('secondary')}
                  >
                    <View className="flex-row gap-1">
                        <View className="h-6 w-1 bg-gray-300"/>
                        <View className="h-6 w-1 bg-white"/>
                        <View className="h-6 w-1 bg-gray-300"/>
                        <View className="h-6 w-1 bg-gray-300"/>
                      </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`${typeChangeColor === 'third' ? 'bg-blue-500' : 'bg-blue-400'} w-14 h-14 rounded-full items-center justify-center m-1`}
                    onPress={() => handleTypeChange('third')}
                  >
                    <View className="flex-row gap-1">
                        <View className="h-6 w-1 bg-gray-300"/>
                        <View className="h-6 w-1 bg-gray-300"/>
                        <View className="h-6 w-1 bg-white"/>
                        <View className="h-6 w-1 bg-gray-300"/>
                      </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`${typeChangeColor === 'fourth' ? 'bg-blue-500' : 'bg-blue-400'} w-14 h-14 rounded-full items-center justify-center m-1`}
                    onPress={() => handleTypeChange('fourth')}
                  >
                    <View className="flex-row gap-1">
                        <View className="h-6 w-1 bg-gray-300"/>
                        <View className="h-6 w-1 bg-gray-300"/>
                        <View className="h-6 w-1 bg-gray-300"/>
                        <View className="h-6 w-1 bg-white"/>
                      </View>
                  </TouchableOpacity>
                </View> 
              }
            })}
            

          </View>
          <View className="flex-row flex-wrap w-32 justify-between">
            <TouchableOpacity
              className="bg-blue-400 w-14 h-14 rounded-full items-center justify-center"
              onPress={handleNewColor}
            >
              <Feather name="plus" size={20} color={'white'}/>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blue-400 w-14 h-14 rounded-full items-center justify-center"
              onPress={() => handleDeleteColor(colorId)}
            >
              <Feather name="x" size={20} color={'red'}/>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-green-400 w-32 h-14 rounded-full items-center justify-center mt-2"
              onPress={handleCrateGraduate} 
            >
              <Text className="text-white text-xl">Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
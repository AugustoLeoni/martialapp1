import { Image, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'

interface Option {
  id: string;
  imageUrl: string;
  title: string;
  activeted: boolean;
}

interface Props {
  item: Option;
  selected: string;
  change: (id: string, title: string) => void;
}

export function OptionInsignia({item, selected, change}: Props) {

  return (
    <TouchableOpacity 
      onPress={() => {
        change(item.id, item.title)
      }}
      className={`flex-row items-center justify-between border-b-gray-200 border-b p-3 ${item.id === selected && 'bg-gray-100'} `}
    >
      <View className="flex-row items-center justify-center">
        <Image source={{uri: item.imageUrl}} className="w-14 h-14 mr-4" style={{resizeMode: 'contain'}}/>
        <Text className={`text-base text-gray-400 ${item.id === selected ? 'font-bold' : 'font-normal'}`}>{item.title}</Text>
      </View>
      {
      item.activeted ?
        <MaterialIcons name="check" size={22} color={'green'}/>
        :
        <MaterialIcons name="close" size={22} color={'red'}/>
      }
    </TouchableOpacity>
  )
}
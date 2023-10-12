import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'

interface Option {
  id: string;
  title: string;
  payment: boolean
}

interface Props {
  item: Option;
  selected: string;
  change: (id: string, title: string) => void;
}


export function OptionMonthyComponent({item, selected, change}: Props) {

  return (
    <TouchableOpacity 
      onPress={() => {
        change(item.id, item.title)
      }}
      className={`flex-row items-center justify-between border-b-gray-200 border-b p-3 ${item.id === selected && 'bg-gray-100'} `}
    >
      <Text className={`text-base text-gray-400 ${item.id === selected ? 'font-bold' : 'font-normal'}`}>{item.title}</Text>
      {
      item.payment ?
        <MaterialIcons name="check" size={22} color={'green'}/>
        :
        <MaterialIcons name="close" size={22} color={'red'}/>
      }
    </TouchableOpacity>
  )
}
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import { useEffect } from "react";

interface Option {
  id: string;
  title: string;
}

interface Props {
  item: Option;
  selected: string;
  change: (id: string, title: string) => void;
}


export function OptionComponent({item, selected, change}: Props) {

  return (
    <TouchableOpacity 
      onPress={() => {
        change(item.id, item.title)
      }}
      className={`flex-row items-center justify-between border-b-gray-200 border-b p-3 ${item.id === selected && 'bg-gray-100'}`}
    >
      <Text className={`text-base text-gray-400 ${item.id === selected ? 'font-bold' : 'font-normal'}`}>{item.title}</Text>
      {item.id === selected && <MaterialIcons name="check" size={22} color={'green'}/>}
    </TouchableOpacity>
  )
}
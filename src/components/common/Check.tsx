import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import colors from "tailwindcss/colors";
import { MaterialIcons } from '@expo/vector-icons'

interface Props {
  title: string
  onChangeCheck: (check: boolean) => void
  activated: boolean
}

export function Check({title, onChangeCheck, activated}: Props){
  return (
    <View>
      <Text className="text-xl">
        {title}
      </Text>
      <View className="flex-row justify-between items-center">
        <View className="flex-row justify-center items-center">
          <TouchableOpacity 
            onPress={() => onChangeCheck(true)}
          >
            <MaterialIcons name={!activated ? "check-box" : "check-box-outline-blank"} size={40} color={!activated ? colors.blue[600] : colors.gray[400]}/>
          </TouchableOpacity>
          <Text className="text-lg ml-2">Sim</Text>
        </View>
        <View className="flex-row justify-center items-center">
          <TouchableOpacity 
            onPress={() => onChangeCheck(false)}
          >
            <MaterialIcons name={activated ? "check-box" : "check-box-outline-blank"} size={40} color={activated ? colors.blue[600] : colors.gray[400]}/>
          </TouchableOpacity>
          <Text className="text-lg ml-2">Não</Text>
        </View>
      </View>
    </View>
  )
}
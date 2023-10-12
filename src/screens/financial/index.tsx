import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import colors from "tailwindcss/colors";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationRoutesProps } from "../../routes/stack.routes";

export function Financial() {
  const navigation = useNavigation<StackNavigationRoutesProps>()

  return (
    <View className="flex-1 bg-slate-200">
      <View className="p-3">
        <TouchableOpacity
          activeOpacity={0.6}
          className="bg-white my-4 py-4 px-2 rounded-xl flex-row justify-between items-center shadow-md shadow-gray-400"
          onPress={() => navigation.navigate('settings')}
        >
          <Text className="text-2xl">Dados da Conta</Text>
          <MaterialIcons name="arrow-right" size={40} color={colors.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          className="bg-white mb-4 py-4 px-2 rounded-xl flex-row justify-between items-center shadow-md shadow-gray-400"
          onPress={() => navigation.navigate('payment')}
        >
          <Text className="text-2xl">Criação das Mensalidades</Text>
          <MaterialIcons name="arrow-right" size={40} color={colors.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          className="bg-white mb-4 py-4 px-2 rounded-xl flex-row justify-between items-center shadow-md shadow-gray-400"
          onPress={() => navigation.navigate('graduate')}
        >
          <Text className="text-2xl">Criação das Graduações</Text>
          <MaterialIcons name="arrow-right" size={40} color={colors.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          className="bg-white mb-4 py-4 px-2 rounded-xl flex-row justify-between items-center shadow-md shadow-gray-400"
          onPress={() => navigation.navigate('store')}
        >
          <Text className="text-2xl">Produtos da Loja</Text>
          <MaterialIcons name="arrow-right" size={40} color={colors.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          className="bg-white mb-4 py-4 px-2 rounded-xl flex-row justify-between items-center shadow-md shadow-gray-400"
          onPress={() => navigation.navigate('classDay')}
        >
          <Text className="text-2xl">Horários de Aula</Text>
          <MaterialIcons name="arrow-right" size={40} color={colors.gray[400]} />
        </TouchableOpacity>


      </View>
    </View>
  )
}
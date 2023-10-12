import { Text, TouchableOpacity, View } from "react-native"
import {Feather} from '@expo/vector-icons'
import colors from "tailwindcss/colors"
import { useAuth } from "../hooks/useAuth"

export function Blocked(){
  const {signOut} = useAuth()
  return (
    <View className="flex-1 justify-center items-center bg-slate-200 p-5">
      <Feather name="lock" size={50} color={colors.red[500]}/>
      <Text className="text-xl text-center my-4">
        Usuário bloqueado pelo administrador.
      </Text>
      <Text>
        Para mais informações, entre em contato com o seu Professor.
      </Text>
      <TouchableOpacity onPress={signOut}>
        <Text className="text-blue-600 font-semibold text-lg mt-5">
          Voltar
        </Text>
      </TouchableOpacity>
    </View>
  )
}
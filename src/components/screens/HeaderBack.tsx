import { Text, TouchableOpacity, View } from "react-native";
import colors from "tailwindcss/colors";
import { Feather } from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native";

type Props = {
  title?: string
}

export function HeaderBack({title}: Props) {
  const navigation = useNavigation()

  return(
    <View style={{backgroundColor: colors.blue[600]}} className="pt-16 pl-4 pb-2 flex-row items-center">
      <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
        <Feather name='arrow-left' size={32} color={colors.white}/>
      </TouchableOpacity>
      <Text className="ml-4 text-white text-2xl flex-wrap">
        {title}
      </Text>
    </View>
  )
}
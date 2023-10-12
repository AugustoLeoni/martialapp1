import { ActivityIndicator, Text, View } from "react-native";
import colors from "tailwindcss/colors";

export function LoadingScreen(){
  return (
    <View className="flex-1 justify-center items-center bg-slate-200">
      <ActivityIndicator size={40} color={colors.blue[600]} />
    </View>
  )
}
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { styled } from 'nativewind'

type Props = TouchableOpacityProps & {
  title: string
  loading?: boolean
}

function ButtonStyled({title, loading, ...rest}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="h-16 w-full bg-blue-600 border-blue-400 rounded-lg justify-center items-center"
      {...rest}
    >
      {
        loading ?
        <ActivityIndicator size={30} color={'white'}/>
        :
        <Text className="text-lg text-white font-semibold">
          {title}
        </Text>
      }
    </TouchableOpacity>
  )
}

const Button = styled(ButtonStyled)
export { Button }
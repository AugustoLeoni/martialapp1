import { TextInput, View, Text, TextInputProps } from "react-native";
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'

type Props = TextInputProps & {
  errorMessage?: string | null
  isInvalid?: boolean
  notMessage?: boolean
}

export function Input({errorMessage = null, isInvalid = false, notMessage = true, ...rest}: Props) {
  const invalid = !!errorMessage || isInvalid

  return (
    <View className="w-full my-2">
      <TextInput
        className={`border-2 h-16 rounded-lg border-gray-200 bg-white px-4 focus:border-blue-500 ${invalid && 'border-red-500'} text-gray-700 text-lg `}
        {...rest}
      />

      {invalid && 
        notMessage &&
        <View className="flex-row items-center ml-2" >
          <Feather name="alert-circle" size={15} color={colors.red[500]}/>
          <Text className="text-red-500 ml-1 font-bold">
            {errorMessage}
          </Text>
        </View>
      }

    </View>
  )
}
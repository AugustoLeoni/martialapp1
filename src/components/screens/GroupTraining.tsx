import { memo } from "react"
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native"

type Props = TouchableOpacityProps & {
  name: string
  isActive: boolean
}

function GroupTrainingComponent({name, isActive, ...rest }: Props){
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`border-2 ${isActive ? 'border-blue-600' : 'border-gray-200'} mx-2 px-2 py-1 rounded-md bg-white`}
      {...rest}
    >
      <Text className={`uppercase text-lg font-bold ${isActive ? 'text-blue-600' : 'text-gray-200'} `}>
        {name}
      </Text>
    </TouchableOpacity>
  )
}

export const GroupTraining = memo(GroupTrainingComponent, (prevProps, nextProps) => {
  return Object.is(prevProps.isActive, nextProps.isActive)
}) 
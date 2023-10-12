import { memo } from 'react'
import { Text, TouchableOpacity, View, TouchableOpacityProps, Image } from 'react-native'
import { Entypo, MaterialIcons } from '@expo/vector-icons'

type Props = TouchableOpacityProps & {
  item: {
    title: string
    serie: string
    repeticion: string
    imageUri: string
    group: string
  }
}

function ExerciseCardComponent({item, ...rest}: Props){
  return (
    <TouchableOpacity
      className='my-2'
      activeOpacity={0.7} 
      {...rest}
    >
      <View className='bg-white p-4 rounded-md flex-row justify-between items-center'>
        {
        item.imageUri ? 
          <Image 
            className='w-16 h-16 rounded-md'
            source={{ uri: item.imageUri}}
          />
          :
          <View className='w-16 h-16 rounded-md justify-center items-center'>
            <MaterialIcons name='no-photography' size={60}/>
          </View>
        }

        <View className='flex-1 mx-6'>
          <Text className='mb-4 text-xl font-semibold'>{item.title}</Text>

          <Text className='text-gray-300'>
            {item.serie} x {item.repeticion}
          </Text>
        </View>

        <Entypo name='chevron-thin-right' size={30}/>
      </View>
    </TouchableOpacity>
  )
}

export const ExerciseCard = memo(ExerciseCardComponent, (prevProps, nextProps) => {
  return Object.is(prevProps.item, nextProps.item)
})
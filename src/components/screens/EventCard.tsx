import React, { memo } from 'react'
import { Image, Text, View } from "react-native";
import { Button } from "../common/Button";
import { formatarData } from '../../utils/date';

type Props = {
  item: {
    id: string
    title: string
    time: string
    data: string
    imageUri: string
  },
  onPress: () => void
}

function EventCardComponent({ item, onPress }:Props){
  return (
    <View className="my-5 bg-white rounded-md mx-3">
      <View className="h-28">
        {
          item.imageUri ?
            <Image  
            source={{ uri: item.imageUri}} 
            className="w-full h-full rounded-md"
          />
          :
          <View>

          </View>
        } 
      </View>

      <View className="flex-row justify-between items-center p-4">
        <View>
          <Text className="text-xl font-bold mb-2">{item.title}</Text>
          <Text className="text-gray-300 mb-2">
            {formatarData(item.data)}
          </Text>
          <Text className="text-gray-300">
            {item.time}h
          </Text>
        </View>
        <Button title="+" onPress={onPress} className="w-8 h-8 rounded-full"/>
      </View>
    </View>
  )
}

export const EventCard = memo(EventCardComponent, (prevProps, nextProps) => {
  return Object.is(prevProps.item, nextProps.item)
})
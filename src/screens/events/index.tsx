import { FlatList, View } from "react-native";
import { Button } from "../../components/common/Button";
import { EventCard } from "../../components/screens/EventCard";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationRoutesProps } from "../../routes/stack.routes";
import { useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore';
import { useAuth } from "../../hooks/useAuth";

export type EventsDataProps = {
  id: string
  title: string
  time: string
  data: string
  imageUri: string
}

export function Events() {
  const { user } = useAuth()
  const [dataEvents, setDataEvents] = useState<EventsDataProps[]>([])

  const navigation = useNavigation<StackNavigationRoutesProps>()

  useEffect(() => {
    const subscribe = firestore()
      .collection('events')
      .where('academyId', '==', user.academyId)
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as EventsDataProps[]
        setDataEvents(data)
      })

      return () => subscribe()
  }, [])

  return (
    <View className="flex-1 bg-slate-200">
      <FlatList 
        data={dataEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return(
            <EventCard item={item} onPress={() => navigation.navigate('showEvent', item)}/>
          )
        }}
      />

      <Button 
      title="+" 
      className="w-16 rounded-full absolute bottom-3 right-3"
      onPress={() => navigation.navigate('showEvent')}
      />
      
    </View>
  )
}
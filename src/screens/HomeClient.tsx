import { FlatList, Image, Modal, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import PagerView from 'react-native-pager-view';
import Popover from 'react-native-popover-view';


import { useNavigation } from "@react-navigation/native";
import { EventCard } from "../components/screens/EventCard";
import { StackClientNavigationRoutesProps } from "../routes/client.stack.routes";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { MaterialIcons, Feather } from '@expo/vector-icons'

import firestore from '@react-native-firebase/firestore';
import { useAuth } from "../hooks/useAuth";

type EventsDataProps = {
  id: string
  title: string
  time: string
  data: string
  imageUri: string
}

interface Option {
  id: string;
  imageUrl: string;
  title: string;
  activeted: boolean;
  description: string
}

type ColorItem = {
  id: string;
  colorBelt: string;
  simbolBelt?: string;
  colorPrimary?: string;
  colorSecundary?: string;
  colorThird?: string;
  colorFourth?: string;
};


interface GraduateProps {
  academyId: string
  colors: ColorItem[]
  title: string
}


export function HomeClient() {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(0);
  const [dataEvents, setDataEvents] = useState<EventsDataProps[]>([])
  const [graduate, setGraduate] = useState<GraduateProps | undefined>(undefined)
  const [showModal, setShowModal] = useState(false)

  const navigation = useNavigation<StackClientNavigationRoutesProps>()
  
  const handlePageChange = (event: any) => {
    const { position } = event.nativeEvent;
    setCurrentPage(position);
  }

  useEffect(() => {
    firestore()
      .collection('graduate')
      .doc(user.graduateId)
      .get()
      .then(response => {
        const data = response.data() as GraduateProps
        
        return setGraduate(data)
      })
  }, [])

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
      <View className="flex-1 px-3 py-1 bg-slate-200">
        <View className="justify-center items-center">
          <Text className="text-xl">{graduate?.title}</Text>
          <View className="flex-row flex-wrap items-center">
            {
              graduate?.colors.map(item => {
                return (
                  <View key={item.id}
                    style={{backgroundColor: item.colorBelt}}
                    className={`
                      ${user.graduate === item.id ? 'w-16' : 'w-10 '}
                      ${user.graduate === item.id ? 'h-16' : 'h-10 '}
                       justify-center items-center m-0.5
                    `}
                  >
                    {
                        item.simbolBelt == 'star' &&
                        <View className="absolute justify-center items-center">
                          <MaterialIcons name="star" size={user.graduate === item.id ? 60 : 30} style={{position: "absolute"}} color={item.colorSecundary}/>
                          <MaterialIcons name="star" size={user.graduate === item.id ? 50 : 20} style={{position: "absolute"}} color={item.colorPrimary}/>
                        </View>
                      }
                      {
                        item.simbolBelt == 'belt' &&
                        <View className="flex-row gap-1">
                          <View 
                            className={`
                              ${user.graduate === item.id ? 'h-16' : 'h-10 '}
                              ${user.graduate === item.id ? 'w-2' : 'w-1 '}
                            `}
                            style={{backgroundColor: item.colorPrimary}}
                          />
    
                          <View 
                            className={`
                              ${user.graduate === item.id ? 'h-16' : 'h-10 '}
                              ${user.graduate === item.id ? 'w-2' : 'w-1 '}
                            `}
                            style={{backgroundColor: item.colorSecundary}}
                          />
    
                          <View 
                            className={`
                              ${user.graduate === item.id ? 'h-16' : 'h-10 '}
                              ${user.graduate === item.id ? 'w-2' : 'w-1 '}
                            `}
                            style={{backgroundColor: item.colorThird}}
                          />
    
                          <View 
                            className={`
                              ${user.graduate === item.id ? 'h-16' : 'h-10 '}
                              ${user.graduate === item.id ? 'w-2' : 'w-1 '}
                            `}
                            style={{backgroundColor: item.colorFourth}}
                          />
                        </View>
                      }
                  </View>
                )
              })
            }
          </View>
        </View>
        <View className="justify-center items-center mt-3 mb-2">
          <View className="flex-row justify-center items-center w-full">
            <Text className="text-xl mb-2">Insígnas Conquistadas</Text>
            <TouchableOpacity
              onPress={() => setShowModal(!showModal)}
              className="absolute right-0"
            >
              <MaterialIcons name="more-horiz" size={40}/>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap">
          </View>
          <FlatList 
            data={user.insigniasStudent as Option[]}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <Popover
                from={(
                  <TouchableOpacity>
                      <Image source={{uri: item.imageUrl}} className={`w-16 h-16 ${item.activeted ? 'opacity-100' : 'opacity-30'}`} style={{resizeMode: 'contain'}}/>
                  </TouchableOpacity>
                )}>
                <Text className="text-lg p-2">{item.description}</Text>
              </Popover>
              )}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <PagerView className="h-60" initialPage={0} onPageSelected={handlePageChange}>
          {dataEvents.map((item)=> <EventCard key={item.id} item={item} onPress={() => navigation.navigate('events', item)}/>)}
        </PagerView>
        <View className="flex-row justify-center items-center mt-2">
            {
            dataEvents.map((item, index) => (
                <View key={item.id} className={`
                  ${currentPage === index ? 'w-4 ' : 'w-2'}
                  ${currentPage === index ? 'h-4 ' : 'h-2'}
                  ${currentPage === index ? 'bg-blue-400' : 'bg-gray-200'}
                  rounded-full 
                  mx-1
                `}/>
            ))
            }
        </View>
        <Modal 
        animationType="slide" 
        visible={showModal} 
        onRequestClose={() => setShowModal(false)}
        className="bg-slate-200"
      >
        <SafeAreaView>
          <View className="p-3 flex-row justify-between items-center border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowModal(!showModal)} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back-ios" size={20}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowModal(!showModal)} activeOpacity={0.7}>
              <Text className="text-sm text-blue-600 font-bold">Cancelar</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-wrap flex-row mt-10 justify-center">
            {
              user.insigniasStudent.map(item => {
                return (
                  <View key={item.id} className="justify-center items-center w-16 h-16">
                    <Image source={{uri: item.imageUrl}} className={`w-16 h-16 ${item.activeted ? 'opacity-100' : 'opacity-30'}`} style={{resizeMode: 'contain'}}/>
                  </View>
                )
              })
            }
          </View>
          {/* <FlatList 
            data={user.insigniasStudent as Option[]}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              return (
                <View className="justify-center items-center w-16 h-16">
                  <Image source={{uri: item.imageUrl}} className={`w-16 h-16 ${item.activeted ? 'opacity-100' : 'opacity-30'}`} style={{resizeMode: 'contain'}}/>
                </View>
              )
            }}
            ListFooterComponent={() => (
              <View className="h-20"/>
            )}
          /> */}
        </SafeAreaView>
      </Modal>
      </View>
  )
}

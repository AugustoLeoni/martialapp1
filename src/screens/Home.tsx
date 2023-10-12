import { View, Text, FlatList, ScrollView, Image} from "react-native";

import { useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore'
import { useAuth } from "../hooks/useAuth";
import { formatarData } from "../utils/date";
import { EventsDataProps } from "./events";

type monthyProps = {
  id: string,
  title: string,
  payment: boolean
}

type StudentDataProps = {
  id: string
  birthday: string
  monthyPaymentRealized: monthyProps[]
  name: string
  start: string
}


export function Home() {
  const { user } = useAuth()
  const [dataStudent, setDataStudent] = useState<StudentDataProps[]>([])
  const [birthday, setBirthday] = useState<StudentDataProps[]>([])
  const [birthdayTraining, setBirthdayTraining] = useState<StudentDataProps[]>([])
  const [dataEvents, setDataEvents] = useState<EventsDataProps[]>([])

  const [studentPaymentTrue, setStudentPaymentTrue] = useState(0)
  const [studentPaymentFalse, setStudentPaymentFalse] = useState(0)
  
  function birthdayMonth(){
    const currentMonth = new Date().getMonth();

    setBirthday(dataStudent.filter(item => {
      const birthdayMonth = new Date(item.birthday).getMonth();
      return birthdayMonth === currentMonth;
    }))
  }

  function birthdayMonthTraining(){
    const currentMonth = new Date().getMonth();

    setBirthdayTraining(dataStudent.filter(item => {
      const birthdayMonth = new Date(item.start).getMonth();
      return birthdayMonth === currentMonth;
    }))
  }

  function monthyPaymentLenght(){
    const date = new Date()
    let trueCount = 0;
    let falseCount = 0;

    dataStudent.map(item => {
      if(item.monthyPaymentRealized[date.getMonth()].payment){
        trueCount += 1
      } else {
        falseCount += 1
      }
    })
  
    setStudentPaymentTrue(trueCount);
    setStudentPaymentFalse(falseCount);
  }

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

  useEffect(() => {
    const subscribe = firestore()
      .collection('users')
      .where('isAdmin', '==', false)
      .where('academyId', '==', user.academyId)
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            birthday: data.birthday,
            monthyPaymentRealized: data.monthyPaymentRealized,
            name: data.name,
            start: data.start,
          };
        }) as unknown as StudentDataProps[]

        setDataStudent(data)
      })
      return () => subscribe()
  }, [])

  useEffect(() => {
    birthdayMonth()
    birthdayMonthTraining()
    monthyPaymentLenght()
  },[dataStudent])

  return (
    <View className="flex-1 p-3 items-center bg-slate-200">
        <Text className="text-2xl mb-3">
          BEM VINDO
        </Text>
        <View className="flex-row justify-between w-full">
          <Text className="text-sm">
            Número de Alunos cadastrados: 
          </Text>
          <Text className="text-sm font-bold">
            {dataStudent.length}
          </Text>
        </View>
        <View className="flex-row justify-between w-full">
          <Text className="text-sm">
            Número de Alunos que pagaram: 
          </Text>
          <Text className="text-sm font-bold">
            {studentPaymentTrue}
          </Text>
        </View>
        <View className="flex-row justify-between w-full">
          <Text className="text-sm">
            Número de Alunos que faltam pagar: 
          </Text>
          <Text className="text-sm font-bold">
            {studentPaymentFalse}
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="h-52">
          <View className="px-10 items-center bg-white">
            <Text className="text-2xl mt-4">
              Aniversariantes do Mês
            </Text>
            { birthday &&
            <FlatList 
              data={birthday}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => (
                <View className="flex-row justify-between items-center border-b border-gray-200">
                  <Text className="text-lg text-gray-300">{item.name} </Text>
                  <Text className="text-sm text-gray-300"> - {formatarData(item.birthday)}</Text>
                </View>
              )}
              className="w-full px-5"
            />
            }
          </View>
          <View className=" h-full mx-2"/>
          <View className="px-8 items-center bg-white">
            <Text className="text-2xl mt-4">
              Aniversariantes de Treino
            </Text>
            { birthdayTraining &&
            <FlatList 
              data={birthdayTraining}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => (
                <View className="flex-row justify-between items-center border-b border-gray-200">
                  <Text className="text-lg text-gray-300">{item.name} </Text>
                  <Text className="text-lg text-gray-300"> - {formatarData(item.start)}</Text>
                </View>
              )}
              className="w-full px-5"
            />
            }
          </View>
        </ScrollView>
        <Text className="text-2xl mt-2 mb-2">
          Próximos Eventos
        </Text>
        <FlatList 
          data={dataEvents}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return(
              <View style={{minWidth: 200}} className="bg-white rounded-md mx-3 mb-10"> 
                <Image source={{ uri: item.imageUri}} className="w-full h-20 rounded-tr-lg rounded-tl-lg"/>
                <View className="px-4">
                    <Text className="text-xl font-bold mb-2">{item.title}</Text>
                    <Text className="text-gray-300 mb-2">
                      {formatarData(item.data)}
                    </Text>
                    <Text className="text-gray-300">
                      {item.time}
                    </Text>
                </View>
              </View>
            )
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
    </View>
  )
}
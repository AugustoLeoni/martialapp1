import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import colors from "tailwindcss/colors";

import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationRoutesProps } from "../../routes/stack.routes";
import firestore from '@react-native-firebase/firestore';
import { useAuth } from "../../hooks/useAuth";

type StudentDataProps = {
  id: string
  name: string
  birthday: string
  cellphone: string
  telephone: string
  paymentRealized: boolean
  graduate: string
  graduateId: string
  email: string
  bloodType: string
  fainting: string
  lesion: string
  medication: string
  healthInsurance: string
  frequency: string
  expectation: string
  start: string
  financialPlan: string
  monthyPaymentRealized: any
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

type Props = {
  id: string
  title: string;
  colors: ColorItem[];
}

export function Students(){
  const { user } = useAuth()
  const [text, setText] = useState('');
  const [textFilter, setTextFilter] = useState(false);
  const [student, setStudent] = useState<StudentDataProps[]>([])
  const [graduate, setGraduate] = useState<Props[]>([])

  const navigation = useNavigation<StackNavigationRoutesProps>()

  // const handleTextChange = () => {
  //   setTextFilter(!textFilter)
  //   setStudent(
  //     student.filter((item) => {
  //       if (item.name.indexOf(text) > -1) {
  //         return true
  //       } else {
  //         return false
  //       }
  //     }),
  //   )
  // }

  useEffect(() => {
    const subscribe = firestore()
    .collection('users')
    .where('isAdmin', '==', false)
    .where('academyId', '==', user.academyId)
    .onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as StudentDataProps[]

      const array = [] as StudentDataProps[]
      const date = new Date()
      data.map(item => {
        if(item.monthyPaymentRealized[date.getMonth()].payment){
          array.push(item)
        } else {
          array.unshift(item)
        }
      })
      setStudent(array)
    })

    return () => subscribe()
  },[])

  useEffect(() => {
    firestore()
    .collection('graduate')
    .where('academyId', '==', user.academyId)
    .get()
    .then(response => {
      const data = response.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as Props[]
      setGraduate(data)
    })
    .catch(error => {
      Alert.alert("Falha ao carregar dados")
      console.log(error)
    })
  }, [])

  return(
    <View className="flex-1 bg-slate-200">
      <View className="flex-1">
        {/* <Input 
          placeholder="Procurar aluno" 
          className="rounded-full mx-3"
          onChangeText={setText}
          value={text}
          onSubmitEditing={handleTextChange}
        /> */}
        <FlatList 
          data={student}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const date = new Date(new Date(item.start))
            const nowDate = new Date()
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            
            const month = item.monthyPaymentRealized[nowDate.getMonth()]
            
            const studentBelt = graduate.map(obj => {
              const finish = obj.colors.filter(belt => belt.id === item.graduate)
              if(finish){
                return finish[0]
              }
            })

            return(
              <TouchableOpacity
                activeOpacity={0.6}
                className="bg-white my-3 p-6 mx-3 rounded-xl flex-row justify-between shadow-md shadow-gray-400"
                onPress={() => navigation.navigate('editStudents', item)}
              >
                <View>
                  <Text className="text-xl">{item.name}</Text>
                  <View className="flex-row justify-between items-center w-60">
                    <View className="flex-row items-center mr-2">
                      <Text>{graduate.find(obj => obj.id === item.graduateId)?.title} - </Text>
                      <View className="h-5 w-20 rounded-sm my-2 border justify-center items-center" style={{backgroundColor: studentBelt[0]?.colorBelt}}>
                        {
                          studentBelt[0]?.simbolBelt == 'star' &&
                          <View className="absolute justify-center items-center">
                            <MaterialIcons name="star" size={20} style={{position: "absolute"}} color={studentBelt[0]?.colorSecundary}/>
                            <MaterialIcons name="star" size={14} style={{position: "absolute"}} color={studentBelt[0]?.colorPrimary}/>
                          </View>
                        }
                        {
                          studentBelt[0]?.simbolBelt == 'belt' &&
                          <View className="flex-row gap-1">
                            <View 
                              className="h-5 w-2"
                              style={{backgroundColor: studentBelt[0]?.colorPrimary}}
                            />

                            <View 
                              className="h-5 w-2"
                              style={{backgroundColor: studentBelt[0]?.colorSecundary}}
                            />

                            <View 
                              className="h-5 w-2"
                              style={{backgroundColor: studentBelt[0]?.colorThird}}
                            />

                            <View 
                              className="h-5 w-2"
                              style={{backgroundColor: studentBelt[0]?.colorFourth}}
                            />
                          </View>
                        }
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <View className={`h-5 w-5 rounded-full ${month.payment ? 'bg-green-300' : 'bg-red-400'} `}/>
                      <Text> Pago</Text>
                    </View>
                  </View>
                  <Text className="text-sm">Data de entrada: {formattedDate}</Text>
                </View>
                <MaterialIcons name="arrow-right" size={40} color={colors.gray[400]} />
              </TouchableOpacity>
            )
          }}
        />
        <Button
          title="+"
          className="w-16 rounded-full absolute bottom-3 right-3"
          onPress={() => navigation.navigate('editStudents')}
        />
      </View>
    </View>
  )
}
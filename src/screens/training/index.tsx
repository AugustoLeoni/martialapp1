import { Alert, FlatList, Modal, RefreshControl, Text, TouchableOpacity, View } from "react-native";

import React, { useEffect, useState } from "react";
import { GroupTraining } from "../../components/screens/GroupTraining";
import { Button } from "../../components/common/Button";
import { ExerciseCard } from "../../components/screens/ExerciseCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationRoutesProps } from "../../routes/stack.routes";
import firestore from '@react-native-firebase/firestore';
import { Input } from "../../components/common/Input";
import { Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors";
import { useAuth } from "../../hooks/useAuth";

type TrainingDataProps = {
  id: string
  title: string
  group: string
  imageUri: string
  serie: string
  repeticion: string
}

export function Training(){
  const { user } = useAuth()
  const [groups, setGroups] = useState<string[]>(['costas'])
  const [groupName, setGroupName] = useState('')
  const [dataTraining, setDataTraining] = useState<TrainingDataProps[]>([])
  const [counterGroupSelected, setCounterGroupSelected] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [groupSelected, setGroupSelected] = useState('')

  const navigation = useNavigation<StackNavigationRoutesProps>()

  function handleModalVisibilit() {
    setModalVisible(!modalVisible)
  }

  function handleListTraining() {
    const encontrouPalavra = groups.includes(groupName)
    if (encontrouPalavra) {
      return Alert.alert('Lista ja existente')
    }
    setGroupSelected(groupName)
    setGroups((prevState) => [groupName, ...prevState])
    setGroupName('')
    handleModalVisibilit()
  }

  function exerciseTipesList() {
    const arrayTipesList = ['']
    dataTraining.map((data) => {
      return arrayTipesList.push(data.group)
    })

    if (arrayTipesList[0] === '') {
      arrayTipesList.splice(0, 1)
    }

    const filter = arrayTipesList.filter(
      (item, index) => arrayTipesList.indexOf(item) === index,
    )
    setGroups(filter)
    setGroupSelected(filter[0])
    numberExercise(filter[0])
  }

  function numberExercise(exerciseTipe: String) {
    let counter = 0
    dataTraining.map((data) => {
      return data.group === exerciseTipe ? (counter += 1) : (counter += 0)
    })
    setCounterGroupSelected(counter)
  }

  useEffect(() => {
    const subscribe = firestore()
      .collection('training')
      .where('academyId', '==', user.academyId)
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as TrainingDataProps[]
        setDataTraining(data)
      })

      return () => subscribe()
  }, [])

  useEffect(() => {
    exerciseTipesList()
  }, [dataTraining])

  return (
    <View className="flex-1 bg-slate-200">
      <View className="p-3">
        <View>
          <FlatList
            className="my-2"
            data={groups}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              return (
                <GroupTraining 
                name={item}
                isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
                onPress={() => {
                  numberExercise(item)
                  setGroupSelected(item)
                }}
              />
              )
            }}
            showsHorizontalScrollIndicator={false}

            ListHeaderComponent={() => (
              user.isAdmin && <Button 
                title="+"
                className="h-10 w-10 mr-1"
                onPress={handleModalVisibilit}
              />
            )}
            horizontal
          />
        </View>

          <View className="flex-row justify-between my-1">
            <Text className="text-xl">Exercícios</Text>
            <Text className="text-xl">{counterGroupSelected}</Text>
          </View>
          
          <FlatList 
            data={dataTraining}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              if(item.group === groupSelected) {
                return (
                  <ExerciseCard item={item} onPress={() => navigation.navigate('exercise', {item})}/>
                )
              }
              return null
            }}
            showsVerticalScrollIndicator={false}
            className="mb-20"
          />

      </View>
      {groupSelected &&
        user.isAdmin && <Button 
        title="+" 
        className="w-16 rounded-full absolute bottom-3 right-3"
        onPress={() => navigation.navigate('exercise', {groupSelected})}
        />
    }

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View className="flex-1 justify-center items-center">
          <View className="bg-white w-3/4 p-4 rounded-lg items-end">
            <TouchableOpacity activeOpacity={0.7} onPress={handleModalVisibilit}>
              <Feather name="x-square" size={30} color={colors.red[400]}/>
            </TouchableOpacity>
            <Input placeholder="Nome do Treino" onChangeText={setGroupName} value={groupName}/>
            <Button title="Criar treino" onPress={handleListTraining}/>
          </View>
        </View>
      </Modal>
    </View>
  )
}
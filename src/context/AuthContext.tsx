import { ReactNode, createContext, useEffect, useState } from "react";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from "react-native";
import { UserDTO } from "../dtos/UserDTO";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dataInsignias, monthyPaymentData } from "../utils/data";

type loginProps = {
  email: string
  password: string
}

export type AuthContextDataProps = {
  user: UserDTO
  login: loginProps
  loading: boolean
  signIn: (email: string, password: string) => void
  CreateStudentAccount: (data: UserDTO) => void
  signOut: () => void
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps){
  const [user, setUser] = useState<UserDTO>()
  const [login, setLogin] = useState({} as loginProps)
  const [loading, setLoading] = useState(false)
  const userStorageKey = '@martialapp:user'

  function parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  async function signIn(email: string, password: string){
    setLoading(true)
    auth()
    .signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
      firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(async (response) => {
          const userData: UserDTO = {
            id: response.id,
            name: "",
            paymentMonthyId: '',
            email: user.email || '',
            activated: false,
            academyId: "",
            monthyPaymentRealized: [],
            insigniasStudent: {},
            birthday: "",
            paymentId: "",
            graduateId: "",
            graduate: "",
            photoUrl: "",
            start: "",
            ...response.data(),
          }

          await AsyncStorage.setItem(userStorageKey, JSON.stringify({email, password}))
          setLoading(false)
          return setUser(userData)

        })
        .catch(error => {
          Alert.alert("Falha ao realizar o Login")
          console.log(error)
        })
    })
    .catch(error => {
      setLoading(false)
      if(error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'){
        Alert.alert('Email e/ou senha inválida!')
      }
    })
  }

  async function CreateStudentAccount(datas: UserDTO) {
    try {
      const { user: authUser } = await auth().createUserWithEmailAndPassword(datas.email, '123456');

      const userData: UserDTO = {
        id: authUser.uid,
        name: datas.name || "",
        email: datas.email || "",
        activated: datas.activated || false,
        isAdmin: false,
        paymentMonthyId: datas.paymentMonthyId || '',
        monthyPaymentRealized: datas.monthyPaymentRealized || monthyPaymentData,
        insigniasStudent: dataInsignias,
        academyId: user.academyId || "",
        birthday: parseDate(datas.birthday).toISOString() || "",
        cellphone: datas.cellphone || "",
        telephone: datas.telephone || "",
        bloodType: datas.bloodType || "",
        fainting: datas.fainting || false,
        lesion: datas.lesion || false,
        medication: datas.medication || false,
        healthInsurance: datas.healthInsurance || false,
        frequency: datas.frequency || "",
        expectation: datas.expectation || "",
        paymentId: datas.paymentId || "",
        graduateId: datas.graduateId || "",
        graduate: datas.graduate || "",
        photoUrl: "",
        start: parseDate(datas.start).toISOString() || "",   
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
  
      await firestore()
        .collection('users')
        .doc(authUser.uid)
        .set(userData);
  
      Alert.alert('Aluno cadastrado com sucesso!');
    } catch (error) {
      Alert.alert("Falha ao cadastrar aluno")
      console.log(error);
    }
  }

  async function signOut(){
    auth().signOut()
    setLogin({} as loginProps)
    setUser(undefined)
    await AsyncStorage.removeItem(userStorageKey)
  }

  async function LoadUser(){
    const userStorage = await AsyncStorage.getItem(userStorageKey)
    if(userStorage) {
      const userLogged = JSON.parse(userStorage) as loginProps
      setLogin(userLogged)
    }
  }

  useEffect(() => {
    LoadUser()
  } ,[])

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signIn,
      signOut,
      CreateStudentAccount,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

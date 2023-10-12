import { NavigationContainer } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'

import StackRoutes from './stack.routes'
import ClientStackRoutes from './client.stack.routes'
import { Login } from '../screens/Login'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { LoadingScreen } from '../screens/LoadingScreen'
import { Blocked } from '../screens/Blocked'

type User = {
  uid: string
}

export default function Routes() {
  const { user, login } = useAuth()
  const [userLogged, setUserLogged] = useState<User | null>(null)

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userInfo => {
      setUserLogged(userInfo)
    })

    return subscriber
  }, [])

  return (
    <NavigationContainer>
      {
        user === undefined ? 
        (<Login />)
        :
        (
          (userLogged && user.isAdmin) == undefined ?
            <LoadingScreen />
            :
            user.activated ? <Blocked /> :
            user.isAdmin ? <StackRoutes /> : <ClientStackRoutes />
        )
      }
      {/* {
        user != undefined ?
        (userLogged && user.isAdmin) == undefined ?
          <LoadingScreen />
          :
          !user.activated ? <Blocked /> :
          user.isAdmin ? <StackRoutes /> : <ClientStackRoutes />
        : 
          <Login />
      } */}
    </NavigationContainer>
  )
}

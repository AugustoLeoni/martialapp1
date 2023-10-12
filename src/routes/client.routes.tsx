import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs'

import { MaterialIcons } from '@expo/vector-icons'

import { Home } from '../screens/Home'
import { Study } from '../screens/study'
import { Students } from '../screens/students'
import { Events } from '../screens/events'
import colors from 'tailwindcss/colors'
import { Header } from '../components/screens/Header'
import { Training } from '../screens/training'
import { HomeClient } from '../screens/HomeClient'
import { Store } from '../screens/financial/store'


type ClientRoutesProps = {
  home: undefined
  training: undefined
  study: undefined
  store: undefined
}

export type ClientNavigatorRoutesProps =
  BottomTabNavigationProp<ClientRoutesProps>

const Tab = createBottomTabNavigator()

export function ClientRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <Header />,
        tabBarStyle: {
          backgroundColor: colors.blue[600]
        },
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.white,
        tabBarActiveBackgroundColor: colors.blue[800],
      }}
      
    >
      <Tab.Screen
        name="home"
        component={HomeClient}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
          tabBarLabel: 'Inicio',
        }}
      />
      <Tab.Screen
        name="training"
        component={Training}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
          tabBarLabel: 'Treinos',
        }}
      />
      <Tab.Screen
        name="study"
        component={Study}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="book" color={color} size={size} />
          ),
          tabBarLabel: 'Estudo',
        }}
      />
      <Tab.Screen
        name="store"
        component={Store}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="store" color={color} size={size} />
          ),
          tabBarLabel: 'Loja',
        }}
      />
    </Tab.Navigator>

  )
}

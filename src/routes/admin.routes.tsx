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


type AdminRoutesProps = {
  home: undefined
  events: undefined
  students: undefined
  study: undefined
  training: undefined
}

export type AdminNavigatorRoutesProps =
  BottomTabNavigationProp<AdminRoutesProps>

const Tab = createBottomTabNavigator()

export function AdminRoutes() {
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
        component={Home}
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
        name="students"
        component={Students}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" color={color} size={size} />
          ),
          tabBarLabel: 'Alunos',
        }}
      />
      <Tab.Screen
        name="event"
        component={Events}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event" color={color} size={size} />
          ),
          tabBarLabel: 'Eventos',
        }}
      />
    </Tab.Navigator>

  )
}

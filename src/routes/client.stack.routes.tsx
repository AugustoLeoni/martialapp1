import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'

import { Exercise } from '../screens/training/show'
import { HeaderBack } from '../components/screens/HeaderBack'
import { AdminRoutes } from './admin.routes'
import { EditStudentRegister } from '../screens/students/edit'
import { ShowEvent } from '../screens/events/show'
import { Financial } from '../screens/financial'
import { Settings } from '../screens/settings'
import { Expenses } from '../screens/financial/expenses'
import { Graduate } from '../screens/financial/graduate'
import { Payment } from '../screens/financial/payment'
import { GraduateEdit } from '../screens/financial/graduate/edit'
import { EditPayment } from '../screens/financial/payment/new'
import { EditExpenses } from '../screens/financial/expenses/edit'
import { ClientRoutes } from './client.routes'
import { MonthlyPayment } from '../screens/financial/payment/monthlyPayment'
import { Login } from '../screens/Login'
import { ClassDay } from '../screens/financial/classDay'


type StackClientProps = {
  clientHome: undefined
  exercise: undefined
  settings: undefined
  financial: undefined
  events: {}
  login: undefined
  classDay: undefined
}

export type StackClientNavigationRoutesProps =
  NativeStackNavigationProp<StackClientProps>

const { Navigator, Screen } = createNativeStackNavigator<StackClientProps>()

export default function ClientStackRoutes() {
  return (
    <Navigator>
      <Screen 
        name='clientHome'
        component={ClientRoutes}
        options={{ headerShown: false}}
      />
      <Screen 
        name="exercise" 
        component={Exercise}
        options={{
          header:(props) => <HeaderBack />,
        }}
      />
      <Screen 
        name="settings" 
        component={Settings}
        options={{
          header:(props) => <HeaderBack />,
        }}
      />
      <Screen 
        name="financial" 
        component={MonthlyPayment}
        options={{
          header:(props) => <HeaderBack />,
        }}
      />
      <Screen 
        name="events" 
        component={ShowEvent}
        options={{
          header:(props) => <HeaderBack />,
        }}
      />
      <Screen 
        name="login" 
        component={Login}
        options={{
          header:(props) => <HeaderBack />,
        }}
      />
      <Screen 
        name="classDay" 
        component={ClassDay}
        options={{
          header:(props) => <HeaderBack />,
        }}
      />
    </Navigator>
  )
}

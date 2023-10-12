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
import { Store } from '../screens/financial/store'
import { NewStore } from '../screens/financial/store/new'
import { ClassDay } from '../screens/financial/classDay'

type StackProps = {
  adminHome: undefined
  training: undefined
  financial: undefined
  settings: undefined
  expenses: undefined
  graduate: undefined
  payment: undefined
  classDay:undefined
  exercise?: {}
  editStudents?: {}
  showEvent?: {}
  editGraduate?: {}
  editPayment?: {}
  editExpenses?: {}
  store?: {}
  newStore?: {}
}

export type StackNavigationRoutesProps =
  NativeStackNavigationProp<StackProps>

const { Navigator, Screen } = createNativeStackNavigator<StackProps>()

export default function StackRoutes() {
  return (
    <Navigator>
      <Screen 
        name='adminHome'
        component={AdminRoutes}
        options={{ headerShown: false}}
      />
      <Screen 
        name="exercise" 
        component={Exercise}
        options={{
          header:(props) => <HeaderBack title='Cadastro de exercicios'/>,
        }}
      />
      <Screen 
        name="editStudents" 
        component={EditStudentRegister}
        options={{
          header:(props) => <HeaderBack title='Cadastro de alunos' />,
        }}
      />
      <Screen 
        name="showEvent" 
        component={ShowEvent}
        options={{
          header:(props) => <HeaderBack title='Eventos'/>,
        }}
      />
      <Screen 
        name="financial" 
        component={Financial}
        options={{
          header:(props) => <HeaderBack title='Configurações'/>,
        }}
      />

      <Screen 
        name="settings" 
        component={Settings}
        options={{
          header:(props) => <HeaderBack title='Configurações'/>,
        }}
      />

      <Screen 
        name="expenses" 
        component={Expenses}
        options={{
          header:(props) => <HeaderBack title='Contas'/>,
        }}
      />

      <Screen 
        name="graduate" 
        component={Graduate}
        options={{
          header:(props) => <HeaderBack title='Graduações'/>,
        }}
      />

      <Screen 
        name="payment" 
        component={Payment}
        options={{
          header:(props) => <HeaderBack title='Mensalidades'/>,
        }}
      />

      <Screen 
        name="editGraduate" 
        component={GraduateEdit}
        options={{
          header:(props) => <HeaderBack title='Edite a graduação'/>,
        }}
      />

      <Screen 
        name="editPayment" 
        component={EditPayment}
        options={{
          header:(props) => <HeaderBack title='Edite a mensalidade'/>,
        }}
      />

      <Screen 
        name="editExpenses" 
        component={EditExpenses}
        options={{
          header:(props) => <HeaderBack title='Edite as despesas'/>,
        }}
      />

      <Screen 
        name="store" 
        component={Store}
        options={{
          header:(props) => <HeaderBack title='Produtos da loja'/>,
        }}
      />
      <Screen 
        name="newStore" 
        component={NewStore}
        options={{
          header:(props) => <HeaderBack title='Novo Produto'/>,
        }}
      />

      <Screen 
        name="classDay" 
        component={ClassDay}
        options={{
          header:(props) => <HeaderBack title='Horarios de aula'/>,
        }}
      />
    </Navigator>
  )
}

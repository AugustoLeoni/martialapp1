import { StatusBar } from 'expo-status-bar';
import Routes from './src/routes';
import colors from 'tailwindcss/colors';
import { AuthContextProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthContextProvider>
        <StatusBar style='light' translucent backgroundColor={colors.blue[600]}/>
        <Routes />
    </AuthContextProvider>
  )
}
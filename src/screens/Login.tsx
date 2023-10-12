import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import auth from '@react-native-firebase/auth'

import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";

import Logo from '../assets/logoMartialApp.png'
import { useEffect, useState } from "react";

export function Login() {
  const { signIn, loading, login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin(){
    signIn(email, password)
  }

  function handleForgotPassword(){
    auth()
      .sendPasswordResetEmail(email)
      .then(() => Alert.alert('Enviamos um link no seu e-mail para você redefinir sua senha'))
  }

  useEffect(() => {
    setEmail(login.email)
    setPassword(login.password)

    
  }, [login])

  return (
    <View className="flex-1 items-center justify-center px-3 pb-3">
      <Image source={Logo} className="w-60 h-60"/>

      <Input 
        placeholder="email"
        onChangeText={setEmail}
        keyboardType="email-address"
        value={email}
      />

      <Input 
        placeholder="password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <Button 
        title='Entrar' 
        className="mt-10"
        loading={loading}
        onPress={handleLogin}
      />

      <TouchableOpacity 
        activeOpacity={0.7} 
        className="m-5" 
        // onPress={handleForgotPassword}
      >
        <Text className="text-blue-600">Esqueceu a senha?</Text>
      </TouchableOpacity>
    </View>
  )
}
import { Alert, View } from "react-native";
import { Input } from "../../../components/common/Input";
import { Button } from "../../../components/common/Button";
import firestore from '@react-native-firebase/firestore';

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from "../../../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

type PaymentProps = {
  title: string
  valor: string
  date: string
  discount: string
  panality: string
}

const Schema = yup.object({
  title: yup.string().required(),
  valor: yup.string().required(),
  date: yup.string().required(),
  discount: yup.string().required(),
  panality: yup.string().required(),
})

export function EditPayment({ route }: any){
  const { user } = useAuth()
  const item = route?.params || {}
  const navigation = useNavigation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentProps>({
    resolver: yupResolver(Schema),
    defaultValues: {
      title: item?.title || '',
      valor: item?.valor || '',
      date: item?.date || '',
      discount: item?.discount || '',
      panality: item?.panality || '',
    },
  })

  function handleCreateFinancial(data: PaymentProps){
    if(route?.params){
      firestore()
        .collection('payment')
        .doc(item.id)
        .update({
          ...data
        })
    } else {
      firestore()
        .collection('payment')
        .add({
          academyId: user.academyId,
          ...data
        })
        .then(() => Alert.alert('Cadastro realizado com sucesso!'))
    }
    navigation.goBack()
  }

  return (
    <View className="flex-1 p-3 bg-slate-200">
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <Input
            className="mt-5"
            placeholder="Titulo"
            onChangeText={onChange}
            value={value}
            errorMessage={errors.title?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="valor"
        render={({ field: { onChange, value } }) => (
          <Input
            className="mt-5"
            keyboardType="numeric"
            placeholder="Valor"
            onChangeText={onChange}
            value={value}
            errorMessage={errors.valor?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="date"
        render={({ field: { onChange, value } }) => (
          <Input
            className="mt-5"
            keyboardType="numeric"
            placeholder="Dia de vencimento"
            onChangeText={onChange}
            value={value}
            errorMessage={errors.date?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="discount"
        render={({ field: { onChange, value } }) => (
          <Input
            className="mt-5"
            keyboardType="numeric"
            placeholder="Disconto (pagar antes do vencimento)"
            onChangeText={onChange}
            value={value}
            errorMessage={errors.discount?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="panality"
        render={({ field: { onChange, value } }) => (
          <Input
            className="mt-5"
            keyboardType="numeric"
            placeholder="Penalidade (pagar após o vencimento)"
            onChangeText={onChange}
            value={value}
            errorMessage={errors.panality?.message}
          />
        )}
      />

      <Button title="Salvar" className="mt-8" onPress={handleSubmit(handleCreateFinancial)}/>
    </View>
  )
}
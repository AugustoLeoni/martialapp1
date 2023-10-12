import { Alert, ScrollView, View } from "react-native";

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Input } from "../../components/common/Input";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import firestore from '@react-native-firebase/firestore';
import { PaymentProps } from "../financial/payment";
import { GraduateProps } from "../financial/graduate";
import { Select } from "../../components/screens/Select";
import { OptionComponent } from "../../components/common/OptionComponent";
import { SelectGraduate } from "../../components/screens/SelectGraduate";
import { Check } from "../../components/common/Check";
import { useNavigation } from "@react-navigation/native";
import { formatarData, parseDate } from "../../utils/date";
import { dataBloodType, dataFrequency, dataInsignias, monthyPaymentData } from "../../utils/data";
import { OptionMonthyComponent } from "../../components/common/OptionMonthyComponent";
import { SelectMonthy } from "../../components/screens/SelectMonthy";
import { SelectInsignia } from "../../components/screens/SelectInsignia";
import { OptionInsignia } from "../../components/common/OptionInsignia";

type RegisterDataProps = {
  name: string
  birthday: string
  cellphone: string
  email: string
  start: string
}

type ColorItem = {
  id: string;
  colorBelt: string;
  simbolBelt?: string;
  colorPrimary?: string;
  colorSecundary?: string;
  colorThird?: string;
  colorFourth?: string;
};

const RegisterScheme = yup.object({
  name: yup.string().required('Informe o nome.'),
  birthday: yup
    .string()
    .min(10, 'Digite no formato xx/xx/xxxx')
    .max(10, 'Digite no formato xx/xx/xxxx')
    .required(),
  cellphone: yup
    .string()
    .min(15, 'Digite no formato (00) 00000-0000')
    .max(15, 'Digite no formato (00) 00000-0000')
    .required(),
  email: yup
    .string()
    .email('Ex: teste@email.com')
    .required('Informe o E-mail.'),
  start: yup.string().required('Digite a data de inicio'),
})

export function EditStudentRegister({ route }: any){
  const item = route?.params || {}
  const {user} = useAuth()
  const navigation = useNavigation()

  const { CreateStudentAccount } = useAuth()
  const [payment, setPayment] = useState<PaymentProps[]>([])
  const [graduate, setGraduate] = useState<GraduateProps[]>([])

  const [bloodType, setBloodType] = useState(item?.bloodType || '')
  const [frequency, setFrequency] = useState(item?.frequency || '')
  
  const [fainting, setFainting] = useState<boolean>(item?.fainting)
  const [faintingReason, setFaintingReason] = useState(item?.faintingReason || '')

  const [lesion, setLesion] = useState<boolean>(item?.lesion)
  const [lesionReason, setLesionReason] = useState(item?.lesionReason || '')
  
  const [medication, setMedication] = useState<boolean>(item?.medication)
  const [medicationReason, setMedicationReason] = useState(item?.medicationReason || '')

  const [healthInsurance, setHealthInsurance] = useState<boolean>(item?.healthInsurance)
  const [healthInsuranceReason, setHealthInsuranceReason] = useState(item?.healthInsuranceReason || '')

  const [telephone, setTelephone] = useState(item?.telephone || '')
  const [expectation, setExpectation] = useState(item?.expectation || '')

  const [chosePaymentMonthy, setChosePaymentmonthy] = useState(item?.paymentMonthyId || '')
  const [chosePayment, setChosePayment] = useState(item?.paymentId || '')

  const [choseGraduate, setChoseGraduate] = useState(item?.graduateId || '')
  const [beltChose, setBeltChose] = useState<ColorItem[] | any>()
  const [beltChoseGraduate, setBeltChoseGraduate] = useState(item?.graduate)
  const [paymentRealized, setPaymentRealized] = useState(false)
  const [monthyPaymentRealized, setMonthyPaymentRealized] = useState(item?.monthyPaymentRealized || monthyPaymentData)

  const [insigniaConquered , setInsigniaConquered] = useState(false)
  const [insigniaSelected, setInsigniaSelected] = useState('')
  const [insignias, setInsignias] = useState(item?.insigniasStudent || dataInsignias)

  const [activated, setActivated] = useState(item?.activated)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDataProps>({
    resolver: yupResolver(RegisterScheme),
    defaultValues: {
      name: item?.name || '',
      birthday: item?.birthday ? formatarData(item?.birthday) : '',
      cellphone: item?.cellphone || '',
      email: item?.email || '',
      start: item?.start ? formatarData(item?.start) : '',
    },
  })

  function handlePayment(){
    const [paymentChose] = payment.filter(obj => obj.id === chosePayment)

    if (chosePaymentMonthy) {
      const updatedMonthlyRealized = monthyPaymentRealized.map((monthy: { id: any; }) => {
        if (monthy.id === chosePaymentMonthy) {
          return { ...monthy, payment: paymentRealized, year: new Date().getFullYear(), paymentChose: paymentChose};
        }
        return monthy;
      });
      setMonthyPaymentRealized(updatedMonthlyRealized)
    }
  }

  function handleInsignia(){
    if (insigniaSelected) {
      const updatedInsigniaConquered = insignias.map((insignia: { id: string; }) => {
        if (insignia.id === insigniaSelected) {
          return { ...insignia, activeted: insigniaConquered };
        }
        return insignia;
      });
      setInsignias(updatedInsigniaConquered)
    }
  }

  function handleCreateStudentAccount(data: RegisterDataProps){
    if(route?.params){
      firestore()
        .collection('users')
        .doc(item?.id)
        .update({
          paymentId: chosePayment, 
          graduateId: choseGraduate,
          graduate: beltChoseGraduate,
          activated: activated,
          paymentMonthyId: chosePaymentMonthy,
          telephone: telephone,
          expectation: expectation,
          fainting: fainting,
          faintingReason: faintingReason,
          lesion: lesion,
          monthyPaymentRealized: monthyPaymentRealized,
          insigniasStudent: insignias,
          lesionReason: lesionReason,
          medication: medication,
          medicationReason: medicationReason,
          healthInsurance: healthInsurance,
          healthInsuranceReason: healthInsuranceReason,
          bloodType: bloodType,
          frequency: frequency,
          ...data,
          birthday: parseDate(data.birthday).toISOString() || "",
          start: parseDate(data.start).toISOString() || "",   
          updatedAt: new Date().toISOString(),
        })
    } else {
      CreateStudentAccount({
        paymentId: chosePayment, 
        graduateId: choseGraduate,
        graduate: beltChoseGraduate,
        activated: activated,
        paymentMonthyId: chosePaymentMonthy,
        monthyPaymentRealized: monthyPaymentRealized,
        insigniasStudent: insignias,
        telephone: telephone,
        expectation: expectation,
        fainting: fainting,
        faintingReason: faintingReason,
        lesion: lesion,
        lesionReason: lesionReason,
        medication: medication,
        medicationReason: medicationReason,
        healthInsurance: healthInsurance,
        healthInsuranceReason: healthInsuranceReason,
        bloodType: bloodType,
        frequency: frequency,
        id: "",
        academyId: "",
        photoUrl: "",
        ...data
      })
    }
    navigation.goBack()
  }

  function handleDeleteStudent(){
    Alert.alert("Deseja excluir o Aluno", "", [
      {
        text: "Cancelar",
        onPress: () => console.log('cancelou'),
        style: 'cancel',
      },
      {
        text: "Ok",
        onPress: () => {
          firestore()
            .collection('users')
            .doc(item.id)
            .delete()
          navigation.goBack()
        }
      }
    ])
  }

  function paymentRealizedConfirm(){
    const data = new Date().getMonth() + 1
    monthyPaymentRealized.forEach((monthy: { id: string; payment: boolean | ((prevState: boolean) => boolean); }) => {
      if(monthy.id === data.toString()){
        setPaymentRealized(monthy.payment)
      }
    })
  }
  function paymentRealizedConfirmChange(){
    monthyPaymentRealized.forEach((monthy: { id: string; payment: boolean | ((prevState: boolean) => boolean); }) => {
      if(monthy.id === chosePaymentMonthy){
        console.log(monthy.payment)
        setPaymentRealized(monthy.payment)
      }
    })
  }

  function insigniaConfirmChange(){
    insignias.forEach((insignia: { id: string; activeted: boolean | ((prevState: boolean) => boolean); }) => {
      if(insignia.id === insigniaSelected){
        setInsigniaConquered(insignia.activeted)
      }
    })
  }

  useEffect(() => {
    handlePayment()
  }, [paymentRealized])

  useEffect(() => {
    paymentRealizedConfirmChange()
  }, [chosePaymentMonthy])

  useEffect(() => {
    handleInsignia()
  }, [insigniaConquered])

  useEffect(() => {
    insigniaConfirmChange()
  }, [insigniaSelected])

  useEffect(() => {
    const result = graduate.find(obj => obj.id === choseGraduate)
    if (result) {
      setBeltChose(result.colors)
    }
  }, [choseGraduate, graduate])

  useEffect(() => {
    firestore()
      .collection('graduate')
      .where('academyId', '==', user.academyId)
      .get()
      .then(response => {
        const data = response.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as GraduateProps[]
        setGraduate(data)
      })
      .catch(error => {
        Alert.alert("Falha ao carregar dados")
        console.log(error)
      })

    firestore()
      .collection('payment')
      .where('academyId', '==', user.academyId)
      .get()
      .then(response => {
        const data = response.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as PaymentProps[]
        setPayment(data)
      })
      .catch(error => {
        Alert.alert("Falha ao carregar dados")
        console.log(error)
      })

    paymentRealizedConfirm()
  }, [])

  return (
    <View className="flex-1 bg-slate-200"> 
      <View className="flex-1 px-3">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                className="mt-5"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="birthday"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Data de aniversário"
                keyboardType="numeric"
                onChangeText={(text) => {
                  if (text.length === 2 || text.length === 5) {
                    if (text.length > value.length) {
                      onChange(text + '/')
                      return
                    } else {
                      onChange(text.slice(0, -1))
                      return
                    }
                  }
                  if (text.length > 10) return
                  onChange(text)
                }}
                value={value}
                errorMessage={errors.birthday?.message}
              />
            )}
          />
           <Controller
            control={control}
            name="cellphone"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Celular"
                keyboardType="numeric"
                onChangeText={(text) => {
                  if (text.length === 2) {
                    if (text.length > value.length) {
                      onChange('(' + text + ') ')
                      return
                    }
                  }
                  if (text.length === 10) {
                    if (text.length > value.length) {
                      onChange(text + '-')
                      return
                    }
                  }
                  if (text.length > 15) return
                  onChange(text)
                }}
                value={value}
                errorMessage={errors.cellphone?.message}
              />
            )}
          />

          <Input
            placeholder="Telefone"
            keyboardType="numeric"
            onChangeText={setTelephone}
            value={telephone}
          />
     
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Check 
            title="Houve algum caso de desmaio?"
            onChangeCheck={(check) => setFainting(check)}
            activated={!fainting}
          />
          { fainting &&
            <Input
              placeholder="Qual motivo?"
              onChangeText={setFaintingReason}
              value={faintingReason}
            />
          }

          <Check 
            title="Houve algum caso de lesão?"
            onChangeCheck={(check) => setLesion(check)}
            activated={!lesion}
          />
          { lesion &&
            <Input
              placeholder="Qual motivo?"
              onChangeText={setLesionReason}
              value={lesionReason}
            />
          }

          <Check 
            title="Utilizando medicação?"
            onChangeCheck={(check) => setMedication(check)}
            activated={!medication}
          />
          { medication &&
            <Input
              placeholder="Qual motivo e medicação?"
              onChangeText={setMedicationReason}
              value={medicationReason}
            />
          }

          <Check 
            title="Possui plano de saúde?"
            onChangeCheck={(check) => setHealthInsurance(check)}
            activated={!healthInsurance}
          />
          { healthInsurance &&
            <Input
              placeholder="Qual plano?"
              onChangeText={setHealthInsuranceReason}
              value={healthInsuranceReason}
            />
          }
          <Select 
            options={dataBloodType}
            onChangeSelect={(id) => setBloodType(id)}
            text="Selecione o tipo sanguíneo"
            OptionComponent={OptionComponent}
            previewId={bloodType}
          />
          <Select 
            options={dataFrequency}
            onChangeSelect={(id) => setFrequency(id)}
            text="Frequência semanal"
            OptionComponent={OptionComponent}
            previewId={frequency}
          />

          <Input
            placeholder="Quais os resultados esperados?"
            onChangeText={setExpectation}
            value={expectation}
          />

          <Controller
            control={control}
            name="start"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Data de início"
                keyboardType="numeric"
                onChangeText={(text) => {
                  if (text.length === 2 || text.length === 5) {
                    if (text.length > value.length) {
                      onChange(text + '/')
                      return
                    } else {
                      onChange(text.slice(0, -1))
                      return
                    }
                  }
                  if (text.length > 10) return
                  onChange(text)
                }}
                value={value}
                errorMessage={errors.start?.message}
              />
            )}
          />

          <Select 
            options={payment}
            onChangeSelect={(id) => setChosePayment(id)}
            text="Selecione um plano"
            OptionComponent={OptionComponent}
            previewId={chosePayment}
          />

          <Select 
            options={graduate}
            onChangeSelect={(id) => setChoseGraduate(id)}
            text="Selecione uma Graduação"
            OptionComponent={OptionComponent}
            previewId={choseGraduate}
          />

          {beltChose && <SelectGraduate 
            options={beltChose}
            onChangeSelect={(color) => setBeltChoseGraduate(color)}
            text="Selecione a Graduação"
            previewColor={beltChoseGraduate}
          />}

          <SelectMonthy 
            options={monthyPaymentRealized}
            onChangeSelect={(id) => setChosePaymentmonthy(id)}
            text="Selecione o mês"
            OptionComponent={OptionMonthyComponent}
            previewId={chosePaymentMonthy}
          />
          
          {chosePaymentMonthy && <Check 
            title="Realizaou o Pagamento"
            onChangeCheck={(check) => setPaymentRealized(check)}
            activated={!paymentRealized}
          />} 

          <SelectInsignia 
            options={insignias}
            onChangeSelect={(id) => setInsigniaSelected(id)}
            text="Selecione as insígnias"
            OptionComponent={OptionInsignia}
            previewId={insigniaSelected}
          />
          
          {insigniaSelected && <Check 
            title="Atribuir a insignia ao aluno?"
            onChangeCheck={(check) => setInsigniaConquered(check)}
            activated={!insigniaConquered}
          />}

          <Check 
            title="Bloquear Aluno:"
            onChangeCheck={(check) => setActivated(check)}
            activated={!activated}
          />

          <Button
            className="mb-6 mt-3 bg-green-500"
            title={route?.params ? 'Salvar' : 'Cadastrar aluno'}
            onPress={handleSubmit(handleCreateStudentAccount)}
          />
          {route?.params && (
            <Button title="Excluir" className="mb-6 bg-red-500" onPress={handleDeleteStudent}/>
          )}
        </ScrollView>
    
      </View>
    </View>
  )
}
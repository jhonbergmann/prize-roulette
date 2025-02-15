import {useEffect, useRef, useState} from 'react'
import {Text, View} from 'react-native'
import * as Haptics from 'expo-haptics'
import {Audio} from 'expo-av'

import {Header} from '../../components/header'
import {Roulette} from '../../components/roulette'
import {Button} from '../../components/button'
import {Modal} from '../../components/modal'

export default function Dashboard() {
  const [result, setResult] = useState<{id: number; title: string; text: string} | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  const rouletteSoundRef = useRef<Audio.Sound | null>(null)
  const winSoundRef = useRef<Audio.Sound | null>(null)

  const rouletteRef = useRef<{spin: () => void}>(null)

  const playWheelSound = async () => {
    const {sound} = await Audio.Sound.createAsync(require('../../assets/sounds/roulette.mp3'), {})
    rouletteSoundRef.current = sound
    await sound.playAsync()
  }

  const playWinSound = async () => {
    const {sound} = await Audio.Sound.createAsync(require('../../assets/sounds/win.mp3'), {})
    winSoundRef.current = sound
    await sound.playAsync()
  }

  const segments = [
    {id: 1, title: 'R$50', text: 'Voucher\npara Compras'},
    {id: 2, title: 'R$10', text: 'Desconto\nCombustível'},
    {id: 3, title: 'R$5', text: 'Recarga\nde Celular'},
    {id: 4, title: 'R$30', text: 'Pix\nInstantâneo'},
    {id: 5, title: '99 Cupons', text: 'Prêmios\nExclusivos'},
    {id: 6, title: 'R$20', text: 'Pagamento\nde Boleto'},
  ]

  useEffect(() => {
    return () => {
      if (rouletteSoundRef.current) rouletteSoundRef.current.unloadAsync()
      if (winSoundRef.current) winSoundRef.current.unloadAsync()
    }
  }, [])

  const onSpin = () => {
    rouletteRef.current?.spin()
    setResult(null)
    playWheelSound()
  }

  const onFinished = async (segment: any) => {
    rouletteSoundRef.current && (await rouletteSoundRef.current.stopAsync())
    setResult(segment)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    await playWinSound()
    setModalVisible(true)
  }

  return (
    <View style={{flex: 1, justifyContent: 'space-around', backgroundColor: '#FFF'}}>
      <Header />

      <Roulette
        ref={rouletteRef}
        segments={segments}
        winningSegment={result}
        winningColor={'#F8A152'}
        segColors={['#FFFFFF', '#FDF5DE']}
        textColors={['#948C78', '#948C78']}
        onFinished={onFinished}
      />

      <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16}}>
        <Text style={{textAlign: 'center', paddingHorizontal: 16}}>
          Você tem até <Text style={{color: '#EB7F40', fontWeight: 'bold'}}>1</Text> chance(s) de ganhar durante o período da campanha
        </Text>

        <Button onPress={onSpin} title="Girar (1)" />

        <Text>
          Expira em <Text style={{color: '#EB7F40', fontWeight: 'bold'}}>2</Text> dias
        </Text>
      </View>

      <Modal visible={modalVisible} prize={`${result?.title} em ${result?.text}.` as string} onClose={() => setModalVisible(false)} />
    </View>
  )
}

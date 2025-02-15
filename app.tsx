import {useRef, useState} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {StatusBar} from 'expo-status-bar'

import {Roulette} from './src/components/roulette'

export default function App() {
  const [result, setResult] = useState<{id: number; title: string; text: string} | null>(null)

  const wheelRef = useRef<{spin: () => void}>(null)

  const segments = [
    {id: 1, title: 'R$20', text: 'Boletos Parcelado'},
    {id: 2, title: 'R$1', text: 'Corridas'},
    {id: 3, title: 'R$5', text: 'Recarga'},
    {id: 4, title: 'R$30', text: 'Pix Parcelado'},
    {id: 5, title: '99 Cupons', text: '99Pop'},
    {id: 6, title: 'R$20', text: 'Pix Parcelado'},

    // add more segments as needed.
  ]

  const onFinished = (segment: any) => {
    setResult(segment)
  }

  const onSpin = () => {
    wheelRef.current?.spin()
    setResult(null)
  }

  return (
    <>
      <StatusBar style="auto" />

      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'column', alignItems: 'center', marginTop: 32}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 16}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Temporada Premiada</Text>
            <View style={{width: 30}} />
          </View>
          <Text style={{fontSize: 28, fontWeight: 'bold'}}>Até 99 cupons de</Text>
          <Text style={{fontSize: 28, fontWeight: 'bold'}}>99Pop</Text>
        </View>

        <View>
          <Roulette ref={wheelRef} segments={segments} winningSegment={result} winningColor={'#F8A152'} segColors={['#FFFFFF', '#FDF5DE']} textColors={['#948C78', '#948C78']} onFinished={onFinished} />
        </View>

        <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16}}>
          <Text style={{textAlign: 'center', paddingHorizontal: 16}}>
            Você tem até <Text style={{color: '#EB7F40', fontWeight: 'bold'}}>1</Text> chance(s) de ganhar durante o período da campanha
          </Text>
          <TouchableOpacity
            onPress={onSpin}
            style={{
              backgroundColor: '#FFCA00',
              height: 60,
              width: 300,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 24,
              marginVertical: 16,
            }}
          >
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>Girar (1)</Text>
          </TouchableOpacity>
          <Text>
            Expira em <Text style={{color: '#EB7F40', fontWeight: 'bold'}}>2</Text> dias
          </Text>
        </View>
      </View>
    </>
  )
}

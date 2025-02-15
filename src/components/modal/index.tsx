import React, {useEffect, useState} from 'react'
import {Modal as NativeModal, View, Text, TouchableOpacity} from 'react-native'
import LottieView from 'lottie-react-native'

interface ModalProps {
  visible: boolean
  prize: string
  onClose: () => void
}

export const Modal = ({visible, prize, onClose}: ModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setShowConfetti(true)
        setTimeout(() => {
          setShowConfetti(false)
        }, 5000)
      }, 4000)
    }
  }, [visible])

  return (
    <NativeModal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <View style={{width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center', elevation: 5}}>
          <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 10}}>Parabéns!</Text>
          <Text style={{fontSize: 18, marginBottom: 20}}>Você ganhou</Text>
          <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 20}}>{prize}</Text>
          <TouchableOpacity style={{backgroundColor: '#FFCA00', padding: 10, borderRadius: 24}} onPress={onClose}>
            <Text style={{color: 'black', fontWeight: 'bold'}}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showConfetti && (
        <LottieView
          style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', transform: [{scale: 1.5}], elevation: 99}}
          speed={0.5}
          source={require('../../assets/lotties/confetti.json')}
          autoPlay
          loop={false}
        />
      )}
    </NativeModal>
  )
}

import {Text, View} from 'react-native'

interface HeaderProps {
  title?: string
}

export const Header = ({title = `Ganhe até 99 cupons!\nÉ só girar e conquistar!`}: HeaderProps) => {
  return (
    <View style={{marginTop: 32}}>
      <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center'}}>{title}</Text>
    </View>
  )
}

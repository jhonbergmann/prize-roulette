import {TouchableOpacity, Text} from 'react-native'

interface ButtonProps {
  onPress: () => void
  title: string
}

export const Button = ({onPress, title}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{backgroundColor: '#FFCA00', height: 60, width: 300, alignItems: 'center', justifyContent: 'center', borderRadius: 24, marginVertical: 16}}
    >
      <Text style={{fontSize: 24, fontWeight: 'bold'}}>{title}</Text>
    </TouchableOpacity>
  )
}

import { StyleSheet } from 'react-native'

import { RootTabScreenProps } from '../types'
import Colors from '../constants/Colors'
import { Text, Title, View, Button } from '../components/Themed'
import { useAuth } from '../context/auth'

export default function Home({ navigation }: RootTabScreenProps<'Home'>) {
	const { wallet, logout } = useAuth()
	return (
		<View>
			<Title>Home</Title>
			<Text>Wallet: {wallet?.getAddressString()}</Text>
			<Button onPress={logout}>Log out</Button>
		</View>
	)
}

const styles = StyleSheet.create({})

import { useState } from 'react'
import {
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from 'react-native'

import { MainStackScreenProps } from '../types'
import { View, Button, layoutStyle } from '../components/Themed'
import Input from '../components/Input'
import Header from '../components/Header'

export default function UsernameChange(
	props: MainStackScreenProps<'UsernameChange'>
) {
	const { username } = props.route.params

	const [newUsername, setNewUsername] = useState(username)

	return (
		<ScrollView
			style={{ width: '100%' }}
			contentContainerStyle={styles.fullScreen}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.fullScreen}
			>
				<View style={styles.container}>
					<View>
						<Header
							{...props}
							style={styles.header}
							title="Change username"
						/>

						<Input
							value={newUsername}
							onChange={setNewUsername}
							label="Username"
							placeholder='@username'
						/>
					</View>

					<Button onPress={() => {}} showLoadingSpinner>
						Change username
					</Button>
				</View>
			</KeyboardAvoidingView>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	fullScreen: {
		width: '100%',
		flex: 1,
	},
	container: {
		...layoutStyle,
		marginBottom: 8,
		flex: 1,
		justifyContent: 'space-between',
	},
	header: {
		marginBottom: 32,
	},
})

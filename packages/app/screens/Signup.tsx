import {
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from 'react-native'
import { useState, useEffect } from 'react'
import { z } from 'zod'

import { RootTabScreenProps } from '../types'
import Colors from '../constants/Colors'
import {
	Text,
	Title,
	TextLink,
	View,
	Button,
	ErrorMessage,
} from '../components/Themed'
import Input from '../components/Input'
import { useAuth } from '../context/auth'
import { validate } from '../utils/validation'

const schema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email'),
	password: z
		.string()
		.min(1, 'Password is required')
		.min(8, 'Password must be at least 8 characters long'),
})

export default function Signup({ navigation }: RootTabScreenProps<'Signup'>) {
	const [email, setEmail] = useState('')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [isButtonDisabled, setIsButtonDisabled] = useState(true)

	const { signup } = useAuth()

	async function handleSignup() {
		try {
			await validate({
				schema,
				data: { email, password },
			})

			setIsButtonDisabled(false)

			await signup(email, username, password)

			setIsButtonDisabled(true)
			setError('')
		} catch (e) {
			if (!(e instanceof Error)) return
			let message = e.message
			if (!message || message === 'Failed to fetch')
				message =
					'An unexpected error occurred - Please try again later'
			setIsButtonDisabled(true)
			setError(message)
		}
	}

	useEffect(() => {
		if (email && password) setIsButtonDisabled(false)
	}, [email, password])

	return (
		<ScrollView contentContainerStyle={styles.wrapper}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.container}
			>
				<View>
					<Title>Sign up</Title>

					<Input
						value={email}
						onChange={setEmail}
						placeholder="Email"
					/>

					<Input
						value={username}
						onChange={setUsername}
						placeholder="Username"
					/>

					<Input
						value={password}
						onChange={setPassword}
						placeholder="Password"
						// secureTextEntry
					/>

					{!!error && <ErrorMessage>{error}</ErrorMessage>}
				</View>

				<View>
					<Button
						onPress={handleSignup}
						disabled={isButtonDisabled}
						showLoadingSpinner
					>
						Sign up
					</Button>

					<View style={styles.pageSwitch}>
						<Text style={styles.pageSwitchText}>
							Have an account?{' '}
						</Text>

						<TextLink
							style={styles.pageSwitchText}
							onClick={() => navigation.navigate('Login')}
						>
							Log in
						</TextLink>
					</View>
				</View>
			</KeyboardAvoidingView>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'center',
	},
	container: {
		width: '100%',
		maxWidth: 310,
		flex: 1,
		justifyContent: 'space-between',
	},
	pageSwitch: {
		height: 20,
		marginBottom: 64,
		textAlign: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	pageSwitchText: {
		fontSize: 14,
		color: Colors.primary400,
	},
})

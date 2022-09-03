import { useState, useEffect } from 'react'
import {
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from 'react-native'
import { z } from 'zod'

import { AuthTabScreenProps } from '../types'
import Colors from '../constants/Colors'
import {
	Text,
	Title,
	TextLink,
	View,
	Button,
	ErrorMessage,
	layoutStyle,
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

export default function Login({ navigation }: AuthTabScreenProps<'Login'>) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [isButtonDisabled, setIsButtonDisabled] = useState(true)

	const { login } = useAuth()

	async function handleLogin() {
		try {
			await validate({
				schema,
				data: { email, password },
			})

			setIsButtonDisabled(false)

			await login(email, password)

			setIsButtonDisabled(true)
			setError('')
		} catch (e) {
			console.error(e)
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
						<Title style={styles.title}>Log in</Title>

						<Input
							value={email}
							onChange={setEmail}
							label="Email"
							keyboardType="email-address"
						/>

						<Input
							value={password}
							onChange={setPassword}
							label="Password"
							// secureTextEntry
						/>

						{!!error && <ErrorMessage>{error}</ErrorMessage>}

						<TextLink
							style={styles.forgotPassword}
							onPress={() => {}}
						>
							Forgot password?
						</TextLink>
					</View>

					<View>
						<Button
							onPress={handleLogin}
							disabled={isButtonDisabled}
							showLoadingSpinner
						>
							Log in
						</Button>

						<View style={styles.pageSwitch}>
							<Text style={styles.pageSwitchText}>
								Don't have an account?{' '}
							</Text>
							<TextLink
								style={styles.pageSwitchText}
								onPress={() => navigation.navigate('Signup')}
							>
								Sign up
							</TextLink>
						</View>
					</View>
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
	title: {
		marginTop: 8,
		marginBottom: 32,
	},
	forgotPassword: {
		flex: 1,
		fontSize: 14,
		marginTop: 6,
	},
	pageSwitch: {
		height: 20,
		marginBottom: 20,
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

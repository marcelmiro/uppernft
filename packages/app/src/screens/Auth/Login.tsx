import { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'

import { AuthTabScreenProps } from '@app/navigation/types'
import Colors from '@app/constants/Colors'
import {
	Text,
	Title,
	TextLink,
	View,
	Button,
	ErrorMessage,
	LayoutScrollView,
	layoutStyle,
} from '@app/components/Themed'
import Input from '@app/components/Input'
import { useLogin } from '@app/lib/auth'
import { parseErrorMessage } from '@app/utils/trpc'

export default function Login({ navigation }: AuthTabScreenProps<'Login'>) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [isButtonDisabled, setIsButtonDisabled] = useState(true)

	const { login, isLoading } = useLogin({
		onMutate() {
			setError('')
		},
		onSuccess() {
			setIsButtonDisabled(true)
			setError('')
		},
		onError(e) {
			setIsButtonDisabled(true)
			setError(parseErrorMessage(e))
		},
	})

	function handleLogin() {
		return login({ email: email.trim(), password: password.trim() })
	}

	useEffect(() => {
		if (email && password) setIsButtonDisabled(false)
		else setIsButtonDisabled(true)
	}, [email, password])

	return (
		<LayoutScrollView>
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

					<ErrorMessage>{error}</ErrorMessage>

					<TextLink style={styles.forgotPassword}>
						Forgot password?
					</TextLink>
				</View>

				<View>
					<Button
						onPress={handleLogin}
						disabled={isButtonDisabled}
						isLoading={isLoading}
					>
						Log in
					</Button>

					<View style={styles.pageSwitchContainer}>
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
		</LayoutScrollView>
	)
}

const styles = StyleSheet.create({
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
	pageSwitchContainer: {
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

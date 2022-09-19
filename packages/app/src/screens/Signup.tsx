import { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { z } from 'zod'

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
import { useSignup } from '@app/lib/auth'
import { parseErrorMessage } from '@app/utils/trpc'

export default function Signup({ navigation }: AuthTabScreenProps<'Signup'>) {
	const [email, setEmail] = useState('')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [isButtonDisabled, setIsButtonDisabled] = useState(true)

	const { signup, isLoading } = useSignup({
		onSuccess() {
			setIsButtonDisabled(true)
			setError('')
		},
		onError(e) {
			setIsButtonDisabled(true)
			setError(parseErrorMessage(e))
		},
	})

	function handleSignup() {
		return signup({
			email: email.trim(),
			username: username.trim(),
			password: password.trim(),
		})
	}

	useEffect(() => {
		if (email && username && password) setIsButtonDisabled(false)
		else setIsButtonDisabled(true)
	}, [email, username, password])

	return (
		<LayoutScrollView>
			<View style={styles.container}>
				<View>
					<Title style={styles.title}>Sign up</Title>

					<Input
						value={email}
						onChange={setEmail}
						label="Email"
						keyboardType="email-address"
					/>

					<Input
						value={username}
						onChange={setUsername}
						label="Username"
					/>

					<Input
						value={password}
						onChange={setPassword}
						label="Password"
						// secureTextEntry
					/>

					<ErrorMessage>{error}</ErrorMessage>
				</View>

				<View>
					<Button
						onPress={handleSignup}
						disabled={isButtonDisabled || isLoading}
						isLoading={isLoading}
					>
						Sign up
					</Button>

					<View style={styles.pageSwitchContainer}>
						<Text style={styles.pageSwitchText}>
							Have an account?{' '}
						</Text>

						<TextLink
							style={styles.pageSwitchText}
							onPress={() => navigation.navigate('Login')}
						>
							Log in
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

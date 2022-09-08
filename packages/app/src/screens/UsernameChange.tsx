import { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'

import { MainStackScreenProps } from '@/navigation/types'
import {
	View,
	Button,
	LayoutScrollView,
	layoutStyle,
} from '@/components/Themed'
import Input from '@/components/Input'
import Header from '@/components/Header'

export default function UsernameChange(
	props: MainStackScreenProps<'UsernameChange'>
) {
	const { username } = props.route.params

	const [newUsername, setNewUsername] = useState(username)
	const [isButtonDisabled, setIsButtonDisabled] = useState(false)

	useEffect(() => {
		if (!newUsername || username === newUsername) setIsButtonDisabled(true)
		setIsButtonDisabled(!newUsername || username === newUsername)
	}, [newUsername])

	return (
		<LayoutScrollView>
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
						placeholder="@username"
					/>
				</View>

				<Button
					onPress={props.navigation.goBack}
					disabled={isButtonDisabled}
				>
					Change username
				</Button>
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
	header: {
		marginBottom: 32,
	},
})

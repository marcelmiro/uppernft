import { useState } from 'react'
import { StyleSheet } from 'react-native'

import { MainStackScreenProps } from '@app/navigation/types'
import {
	View,
	Button,
	LayoutScrollView,
	layoutStyle,
} from '@app/components/Themed'
import Input from '@app/components/Input'
import Header from '@app/components/Header'

export default function UsernameChange(
	props: MainStackScreenProps<'UsernameChange'>
) {
	const { username } = props.route.params

	const [newUsername, setNewUsername] = useState(username)
	const [isButtonDisabled, setIsButtonDisabled] = useState(true)

	function handleNewUsername(value: string) {
		setNewUsername(value)
		setIsButtonDisabled(!value || username === value)
	}

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
						onChange={handleNewUsername}
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

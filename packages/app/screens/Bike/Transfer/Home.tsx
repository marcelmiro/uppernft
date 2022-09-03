import { useState } from 'react'
import {
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Pressable,
} from 'react-native'

import Colors from '../../../constants/Colors'
import { BikeTransferStackScreenProps } from '../../../types'
import { View, Text, Button, layoutStyle } from '../../../components/Themed'
import Header from '../../../components/Header'
import Input, { KeyboardType } from '../../../components/Input'

const inputTypes = ['username', 'email', 'address'] as const

type InputType = typeof inputTypes[number]

const placeholders: Record<InputType, string> = {
	username: '@username',
	email: 'email@email.com',
	address: '0x0000000000000000000000000',
}

const keyboardTypes: Record<InputType, KeyboardType> = {
	username: 'default',
	email: 'email-address',
	address: 'default',
}

export default function BikeTransferHome(
	props: BikeTransferStackScreenProps<'TransferHome'>
) {
	const [inputType, setInputType] = useState<InputType>(inputTypes[0])
	const [inputValue, setInputValue] = useState('')

	function changeInputType(type: InputType) {
		setInputType(type)
		setInputValue('')
	}

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
							title="Transfer"
						/>

						<View style={styles.inputTypeContainer}>
							<Pressable
								style={[
									styles.inputTypeButton,
									inputType === 'username' &&
										styles.inputTypeButtonActive,
								]}
								onPress={() => changeInputType('username')}
							>
								<Text>Username</Text>
							</Pressable>

							<Pressable
								style={[
									styles.inputTypeButton,
									inputType === 'email' &&
										styles.inputTypeButtonActive,
								]}
								onPress={() => changeInputType('email')}
							>
								<Text>Email</Text>
							</Pressable>

							<Pressable
								style={[
									styles.inputTypeButton,
									inputType === 'address' &&
										styles.inputTypeButtonActive,
								]}
								onPress={() => changeInputType('address')}
							>
								<Text>Address</Text>
							</Pressable>
						</View>

						<Input
							value={inputValue}
							onChange={setInputValue}
							label={
								inputType[0].toUpperCase() + inputType.slice(1)
							}
							placeholder={placeholders[inputType]}
							keyboardType={keyboardTypes[inputType]}
						/>
					</View>

					<Button
						onPress={() =>
							props.navigation.replace('AfterTransferInfo')
						}
						showLoadingSpinner
					>
						Transfer
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
	inputTypeContainer: {
		height: 48,
		backgroundColor: Colors.primary150,
		borderRadius: 10,
		marginBottom: 8,
		paddingVertical: 4,
		paddingHorizontal: 2,
		flexDirection: 'row',
		alignItems: 'stretch',
	},
	inputTypeButton: {
		flex: 1,
		marginHorizontal: 2,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
	},
	inputTypeButtonActive: {
		backgroundColor: Colors.primary0,
	},
})

import { useState } from 'react'
import { StyleSheet, Pressable } from 'react-native'

import Colors from '@/constants/Colors'
import { BikeTransferStackScreenProps } from '@/navigation/types'
import { trpc, parseErrorMessage } from '@/utils/trpc'
import {
	View,
	Text,
	Button,
	LayoutScrollView,
	layoutStyle,
	ErrorMessage,
} from '@/components/Themed'
import Header from '@/components/Header'
import Input, { KeyboardType } from '@/components/Input'

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
	const { serialNumber } = props.route.params

	const [inputType, setInputType] = useState<InputType>(inputTypes[0])
	const [inputValue, setInputValue] = useState('')
	const [isButtonDisabled, setIsButtonDisabled] = useState(true)

	const {
		mutate: mutateTransfer,
		isLoading,
		error,
	} = trpc.useMutation(['item.transfer'], {
		onSuccess() {
			props.navigation.replace('AfterTransferInfo')
		},
		onError() {
			setIsButtonDisabled(true)
		},
	})

	function changeInputType(type: InputType) {
		setInputType(type)
		setInputValue('')
	}

	function handleInputValue(value: string) {
		setInputValue(value)
		setIsButtonDisabled(!value)
	}

	return (
		<LayoutScrollView>
			<View style={styles.container}>
				<View>
					<Header {...props} style={styles.header} title="Transfer" />

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
						onChange={handleInputValue}
						label={inputType[0].toUpperCase() + inputType.slice(1)}
						placeholder={placeholders[inputType]}
						keyboardType={keyboardTypes[inputType]}
					/>

					<ErrorMessage>{parseErrorMessage(error)}</ErrorMessage>
				</View>

				<Button
					onPress={() =>
						mutateTransfer({
							serialNumber,
							transfereeType: inputType,
							transfereeValue: inputValue,
						})
					}
					isLoading={isLoading}
					disabled={isButtonDisabled}
				>
					Transfer
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

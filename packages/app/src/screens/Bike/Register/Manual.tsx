import { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'

import { BikeRegisterStackScreenProps } from '@/navigation/types'
import { trpc, parseErrorMessage } from '@/utils/trpc'
import {
	View,
	Button,
	layoutStyle,
	LayoutScrollView,
	ErrorMessage,
} from '@/components/Themed'
import Header from '@/components/Header'
import Input from '@/components/Input'

export default function BikeRegisterHome(
	props: BikeRegisterStackScreenProps<'ManualRegister'>
) {
	const [serialNumber, setSerialNumber] = useState('')
	const [isButtonDisabled, setIsButtonDisabled] = useState(false)

	const { data, isLoading, error, refetch } = trpc.useQuery(
		['item.registrable', { serialNumber }],
		{
			enabled: false,
			retry: false,
			refetchOnMount: false,
		}
	)

	function handleSerialNumberChange(value: string) {
		setSerialNumber(value.toUpperCase())
	}

	useEffect(() => {
		setIsButtonDisabled(!serialNumber)
	}, [serialNumber])

	useEffect(() => {
		if (data) props.navigation.navigate('ConfirmRegister', data)
	}, [data])

	return (
		<LayoutScrollView>
			<View style={styles.container}>
				<View>
					<Header
						{...props}
						style={styles.header}
						title="Enter serial number"
					/>

					<Input
						value={serialNumber}
						onChange={handleSerialNumberChange}
						label="Serial number"
						placeholder="HP59218BM3N7"
					/>

					<ErrorMessage>{parseErrorMessage(error)}</ErrorMessage>
				</View>

				<Button
					onPress={() => refetch()}
					isLoading={isLoading}
					disabled={isButtonDisabled}
				>
					Register bike
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

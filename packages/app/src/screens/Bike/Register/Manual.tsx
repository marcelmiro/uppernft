import { useState } from 'react'
import { StyleSheet } from 'react-native'

import { BikeRegisterStackScreenProps } from '@app/navigation/types'
import { parseErrorMessage } from '@app/utils/trpc'
import {
	View,
	Button,
	layoutStyle,
	LayoutScrollView,
	ErrorMessage,
} from '@app/components/Themed'
import Header from '@app/components/Header'
import Input from '@app/components/Input'
import { useRegistrableQuery } from '@app/screens/Bike/Register/Home'

export default function BikeRegisterHome(
	props: BikeRegisterStackScreenProps<'ManualRegister'>
) {
	const [serialNumber, setSerialNumber] = useState('')
	const [isButtonDisabled, setIsButtonDisabled] = useState(true)

	const { isLoading, error, refetch } = useRegistrableQuery({
		serialNumber,
		navigation: props.navigation,
		onError() {
			setIsButtonDisabled(true)
		},
	})

	function handleSerialNumberChange(value: string) {
		setSerialNumber(value.toUpperCase())
		setIsButtonDisabled(!value)
	}

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

import { useState } from 'react'
import { StyleSheet } from 'react-native'

import { BikeRegisterStackScreenProps } from '../../../types'
import {
	View,
	Button,
	layoutStyle,
	LayoutScrollView,
} from '../../../components/Themed'
import Header from '../../../components/Header'
import Input from '../../../components/Input'

export default function BikeRegisterHome(
	props: BikeRegisterStackScreenProps<'ManualRegister'>
) {
	const [serialNumber, setSerialNumber] = useState('')

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
						onChange={setSerialNumber}
						label="Serial number"
						placeholder="HP59218BM3N7"
					/>
				</View>

				<Button
					onPress={() =>
						props.navigation.navigate('ConfirmRegister', {
							id: 'HP59218BM3N7',
							name: 'Spark RC SL EVO AXS',
							imageUri: 'https://i.imgur.com/jtj2sHj.png',
						})
					}
					showLoadingSpinner
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

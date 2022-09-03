import { StyleSheet } from 'react-native'

import Colors from '../../../constants/Colors'
import { BikeRegisterStackScreenProps } from '../../../types'
import { View, Text, layoutStyle, Button } from '../../../components/Themed'
import IconClock from '../../../assets/icons/clock.svg'

export default function BikeRegisterAfterInfo({
	navigation,
}: BikeRegisterStackScreenProps<'AfterRegisterInfo'>) {
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<IconClock {...styles.icon} />

				<Text style={styles.title}>
					Registration is being processed
				</Text>

				<Text style={styles.subtitle}>
					We are now processing the registration and may take a few
					minutes to complete.
				</Text>
			</View>

			<Button onPress={navigation.goBack}>Got it</Button>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		...layoutStyle,
		marginBottom: 8,
		flex: 1,
	},
	content: {
		maxWidth: 290,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		paddingBottom: '10%',
	},
	icon: {
		width: 48,
		height: 48,
		fill: Colors.primary,
	},
	title: {
		fontWeight: '500',
		fontSize: 18,
		textAlign: 'center',
		marginTop: 16,
		marginBottom: 12,
	},
	subtitle: {
		textAlign: 'center',
		fontSize: 14,
		color: Colors.primary400,
	},
})

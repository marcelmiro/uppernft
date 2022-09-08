import { StyleSheet } from 'react-native'

import Colors from '@/constants/Colors'
import { BikeRegisterStackScreenProps } from '@/navigation/types'
import { View, Text, TextLink, layoutStyle } from '@/components/Themed'
import Header from '@/components/Header'
import IconScanner from '@/icons/scanner.svg'

export default function BikeRegisterHome(
	props: BikeRegisterStackScreenProps<'RegisterHome'>
) {
	return (
		<View style={styles.container}>
			<Header {...props} includeTitle={false} />

			<View style={styles.contentContainer}>
				<IconScanner {...styles.contentIcon} />

				<Text style={styles.contentTitle}>Scan the NFC tag</Text>

				<Text style={styles.contentSubtitle}>
					The tag can be found in the bike frame. Activate the phone's
					NFC and move the phone close to the tag.
				</Text>
			</View>

			<TextLink
				onPress={() => props.navigation.navigate('ManualRegister')}
				hitSlop={16}
			>
				Manually enter the serial number
			</TextLink>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		...layoutStyle,
		flex: 1,
		marginBottom: 32,
		alignItems: 'center',
	},
	contentContainer: {
		maxWidth: 290,
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		paddingBottom: '10%',
	},
	contentIcon: {
		width: 48,
		height: 48,
		fill: Colors.primary,
	},
	contentTitle: {
		fontWeight: '500',
		fontSize: 18,
		textAlign: 'center',
		marginTop: 16,
		marginBottom: 12,
	},
	contentSubtitle: {
		textAlign: 'center',
		fontSize: 14,
		color: Colors.primary400,
	},
})

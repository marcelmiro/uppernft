import { StyleSheet } from 'react-native'

import Colors from '@/constants/Colors'
import { View, Text, layoutStyle } from '@/components/Themed'
import IconWarning from '@/icons/warning.svg'

export default function ErrorScreen() {
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<IconWarning {...styles.icon} />

				<Text style={styles.title}>An unexpected error occurred</Text>

				<Text style={styles.subtitle}>
					We are currently experiencing difficulties and ask for your
					patience while we solve it.
				</Text>
			</View>
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

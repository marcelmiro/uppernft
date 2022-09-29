import { StyleSheet, Image, Dimensions } from 'react-native'

import Colors from '@app/constants/Colors'
import { BikeRegisterStackScreenProps } from '@app/navigation/types'
import { trpc } from '@app/utils/trpc'
import {
	View,
	Text,
	Button,
	LayoutScrollView,
	layoutStyle,
} from '@app/components/Themed'
import Header from '@app/components/Header'

const { width } = Dimensions.get('window')
const imageHeight = parseInt(String(width / 1.8))

export default function BikeRegisterConfirm(
	props: BikeRegisterStackScreenProps<'ConfirmRegister'>
) {
	const { serialNumber, name, imageUri } = props.route.params

	const { mutate: mutateRegister, isLoading } = trpc.useMutation(
		['item.register'],
		{
			onSuccess() {
				props.navigation.reset({
					routes: [{ name: 'AfterRegisterInfo' }],
				})
			},
		}
	)

	return (
		<LayoutScrollView>
			<View style={styles.container}>
				<Header {...props} style={styles.header} includeTitle={false} />

				<View style={styles.content}>
					<View style={styles.bikeContainer}>
						<Image
							style={styles.bikeImage}
							source={{ uri: imageUri }}
							resizeMode="cover"
						/>
						<Text style={styles.bikeTitle}>{name}</Text>
						<Text style={styles.bikeSubtitle}>
							{serialNumber.toUpperCase()}
						</Text>
					</View>

					<Text style={styles.confirmText}>
						Please confirm that your bike matches the details shown
						above.
					</Text>
				</View>

				<Button
					onPress={() => mutateRegister({ serialNumber })}
					isLoading={isLoading}
				>
					Confirm
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
	content: {
		width: '100%',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	bikeContainer: {
		width: '100%',
		backgroundColor: Colors.primary0,
		paddingTop: 4,
		paddingHorizontal: 24,
		paddingBottom: 24,
		borderRadius: 16,
		alignItems: 'center',
	},
	bikeImage: {
		width: '100%',
		maxWidth: 360,
		height: imageHeight,
	},
	bikeTitle: {
		fontWeight: '500',
		fontSize: 18,
		marginVertical: 8,
		textAlign: 'center',
	},
	bikeSubtitle: {
		fontSize: 14,
		color: Colors.primary400,
		textAlign: 'center',
	},
	confirmText: {
		fontWeight: '500',
		fontSize: 18,
		textAlign: 'center',
		marginTop: 28,
		paddingHorizontal: 16,
	},
})

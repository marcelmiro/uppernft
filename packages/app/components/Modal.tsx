import { StyleSheet } from 'react-native'
import DefaultModal from 'react-native-modal'

import Colors from '../constants/Colors'
import { View } from './Themed'

interface ModalProps {
	show: boolean
	handleClose(): void
	children: React.ReactNode
}

export default function Modal({ show, handleClose, children }: ModalProps) {
	return (
		<DefaultModal
			isVisible={show}
			backdropColor={Colors.primary}
			backdropOpacity={0.9}
			onBackButtonPress={handleClose}
			onBackdropPress={handleClose}
			swipeDirection="down"
			onSwipeComplete={handleClose}
			panResponderThreshold={64}
			statusBarTranslucent
			useNativeDriverForBackdrop
			style={{ margin: 0 }}
		>
			<View style={styles.wrapper}>
				<View style={styles.container}>
					<View style={styles.swipeBarContainer}>
						<View style={styles.swipeBar} />
					</View>

					<View>{children}</View>
				</View>
			</View>
		</DefaultModal>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'stretch',
		justifyContent: 'flex-end',
	},
	container: {
		maxHeight: '80%',
		backgroundColor: Colors.primary0,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		paddingHorizontal: 24,
		paddingBottom: 36,
	},
	swipeBarContainer: {
		width: '100%',
		height: 36,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
	},
	swipeBar: {
		width: 42,
		maxWidth: '100%',
		height: 4,
		backgroundColor: Colors.primary200,
		borderRadius: 42,
		alignSelf: 'center',
	},
})

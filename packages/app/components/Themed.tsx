import {
	StyleSheet,
	Text as DefaultText,
	View as DefaultView,
	Pressable,
	TouchableOpacity,
	ActivityIndicator,
	PressableProps,
	GestureResponderEvent,
} from 'react-native'
import { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'

import Colors from '../constants/Colors'

type TextLinkProps = DefaultText['props'] & {
	onClick(): void
}

type ButtonProps = DefaultText['props'] & {
	onPress: PressableProps['onPress']
	disabled?: boolean
	showLoadingSpinner?: boolean
}

export function Text(props: DefaultText['props']) {
	const { style, ...otherProps } = props
	return <DefaultText style={[styles.text, style]} {...otherProps} />
}

export function View(props: DefaultView['props']) {
	const { style, ...otherProps } = props
	return <DefaultView style={[styles.view, style]} {...otherProps} />
}

export function Button({
	onPress,
	disabled,
	showLoadingSpinner = false,
	...props
}: ButtonProps) {
	const [isLoading, setIsLoading] = useState(false)

	async function handlePress(e: GestureResponderEvent) {
		if (!onPress) return
		try {
			setIsLoading(true)
			await onPress(e)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Pressable
			onPress={handlePress}
			style={({ pressed }) => [
				styles.button,
				disabled && styles.buttonDisabled,
				pressed && styles.buttonPressed,
				isLoading && styles.buttonPressed,
			]}
			disabled={disabled}
		>
			{showLoadingSpinner && isLoading && (
				<ActivityIndicator
					size="small"
					color={Colors.primary0}
					style={styles.loadingSpinner}
				/>
			)}
			<Text style={styles.buttonText} {...props} />
		</Pressable>
	)
}

export function Title({ style, ...props }: DefaultText['props']) {
	return <Text style={[styles.title]} {...props} />
}

export function TextLink({ onClick, style, ...props }: TextLinkProps) {
	return (
		<Text>
			<TouchableOpacity onPress={onClick}>
				<Text style={[style, styles.textLink]} {...props} />
			</TouchableOpacity>
		</Text>
	)
}

export function ErrorMessage({ style, ...props }: DefaultText['props']) {
	/**
	 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
	 */
	return (
		<View style={styles.errorContainer}>
			<Text style={[style, styles.errorMessage]}>
				<FontAwesome
					name="exclamation-circle"
					style={styles.errorIcon}
				/>
				&nbsp;
			</Text>
			<Text style={[style, styles.errorMessage]} {...props} />
		</View>
	)
}

const styles = StyleSheet.create({
	text: {
		color: Colors.primary,
		fontWeight: '400',
		fontSize: 16,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 32,
		color: Colors.primary,
		textAlign: 'center',
		marginVertical: 32,
	},
	textLink: {
		color: Colors.accent,
	},
	view: {},
	button: {
		height: 50,
		minHeight: 50,
		maxHeight: 50,
		width: '100%',
		marginVertical: 16,
		backgroundColor: Colors.accent,
		borderRadius: 16,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonDisabled: {
		backgroundColor: Colors.accent200,
	},
	buttonPressed: {
		backgroundColor: Colors.accent400,
	},
	buttonText: {
		fontWeight: '500',
		fontSize: 16,
		color: Colors.primary100,
	},
	loadingSpinner: {
		marginRight: 12,
	},
	errorContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 2,
	},
	errorIcon: {
		color: Colors.error,
		fontSize: 16,
	},
	errorMessage: {
		color: Colors.error,
		fontSize: 14,
	},
})

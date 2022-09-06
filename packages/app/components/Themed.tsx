import { useState } from 'react'
import {
	StyleSheet,
	Text as DefaultText,
	View as DefaultView,
	Pressable,
	TouchableOpacity,
	ActivityIndicator,
	PressableProps,
	GestureResponderEvent,
	StyleProp,
	ViewStyle,
	Switch as DefaultSwitch,
	ScrollView,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

import Colors from '../constants/Colors'

type TextLinkProps = DefaultText['props'] & {
	onPress(): void
	containerStyle?: DefaultText['props']['style']
	hitSlop?: number
}

type ButtonProps = DefaultText['props'] & {
	onPress: PressableProps['onPress']
	disabled?: boolean
	showLoadingSpinner?: boolean
	containerStyle?: StyleProp<ViewStyle>
}

export function Text(props: DefaultText['props']) {
	const { style, ...otherProps } = props
	return <DefaultText style={[styles.text, style]} {...otherProps} />
}

export function View(props: DefaultView['props']) {
	const { style, ...otherProps } = props
	return <DefaultView style={[styles.view, style]} {...otherProps} />
}

export function LayoutScrollView(props: DefaultView['props']) {
	const { style, ...otherProps } = props
	return (
		<ScrollView
			style={[{ flexGrow: 1 }, style]}
			contentContainerStyle={{ flexGrow: 1 }}
			{...otherProps}
		/>
	)
}

export function Button({
	onPress,
	disabled,
	showLoadingSpinner = false,
	containerStyle,
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
				containerStyle,
				disabled && styles.buttonDisabled,
				pressed && styles.buttonPressed,
				isLoading && styles.buttonPressed,
			]}
			disabled={disabled || isLoading}
		>
			{showLoadingSpinner && isLoading && (
				<ActivityIndicator
					size="small"
					color={Colors.primary0}
					style={styles.loadingSpinner}
				/>
			)}
			<Text style={[styles.buttonText, props.style]} {...props} />
		</Pressable>
	)
}

export function Title({ style, ...props }: DefaultText['props']) {
	return <Text style={[styles.title, style]} {...props} />
}

export function TextLink({
	onPress,
	style,
	containerStyle,
	hitSlop = 8,
	...props
}: TextLinkProps) {
	const hitSlopInsets = {
		top: hitSlop,
		left: hitSlop,
		bottom: hitSlop,
		right: hitSlop,
	}
	return (
		<Text style={containerStyle}>
			<TouchableOpacity onPress={onPress} hitSlop={hitSlopInsets}>
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

export function Switch(props: DefaultSwitch['props']) {
	return (
		<DefaultSwitch
			thumbColor={(props.value && Colors.accent) || undefined}
			trackColor={{ true: Colors.accent200 }}
			{...props}
		/>
	)
}

export const layoutStyle = {
	width: '100%',
	marginTop: 48,
	marginBottom: 16,
	paddingHorizontal: 20,
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
	},
	textLink: {
		fontWeight: '500',
		color: Colors.accent,
	},
	view: {},
	button: {
		width: '100%',
		height: 50,
		minHeight: 50,
		maxHeight: 50,
		marginVertical: 16,
		backgroundColor: Colors.accent,
		borderRadius: 16,
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

import { useState, useRef } from 'react'
import { StyleSheet, TextInput, Pressable } from 'react-native'

import Colors from '@app/constants/Colors'
import { Text, View } from '@app/components/Themed'

export type KeyboardType = TextInput['props']['keyboardType']

interface InputProps {
	value: string
	onChange(value: string): void
	label: string
	placeholder?: string
	secureTextEntry?: boolean
	keyboardType?: KeyboardType
}

export default function Input({
	value,
	onChange,
	label,
	placeholder,
	secureTextEntry = false,
	keyboardType = 'default',
}: InputProps) {
	const [isFocused, setIsFocused] = useState(false)
	const inputRef = useRef<TextInput>(null)

	return (
		<View style={[styles.container, isFocused && styles.containerFocus]}>
			<Pressable onPress={() => inputRef.current?.focus()} hitSlop={16}>
				<Text style={styles.label}>{label}</Text>
			</Pressable>

			<TextInput
				value={value}
				onChangeText={onChange}
				placeholder={placeholder || label}
				placeholderTextColor={Colors.primary300}
				style={styles.input}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				secureTextEntry={secureTextEntry}
				keyboardType={keyboardType}
				ref={inputRef}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: Colors.primary150,
		borderWidth: 2,
		borderColor: 'transparent',
		marginVertical: 8,
	},
	containerFocus: {
		borderColor: Colors.primary400,
	},
	label: {
		color: Colors.primary400,
		fontSize: 12,
		marginBottom: 4,
	},
	input: {
		color: Colors.primary,
		fontSize: 16,
		flexWrap: 'nowrap',
	},
})

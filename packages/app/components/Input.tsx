import { StyleSheet, TextInput, Pressable } from 'react-native'
import { useState, useRef } from 'react'

import Colors from '../constants/Colors'
import { Text, View } from '../components/Themed'

interface InputProps {
	value: string
	onChange(value: string): void
	placeholder: string
	secureTextEntry?: boolean
}

export default function Input({
	value,
	onChange,
	placeholder,
	secureTextEntry = false,
}: InputProps) {
	const [isFocused, setIsFocused] = useState(false)
	const inputRef = useRef<TextInput>(null)

	return (
		<View style={[styles.container, isFocused && styles.containerFocus]}>
			<Pressable onPress={() => inputRef.current?.focus()} hitSlop={16}>
				<Text style={styles.label}>{placeholder}</Text>
			</Pressable>

			<TextInput
				value={value}
				onChangeText={onChange}
				placeholder={placeholder}
				style={styles.input}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				secureTextEntry={secureTextEntry}
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
	},
})

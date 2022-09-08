import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { ParamListBase, Route } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import Colors from '@/constants/Colors'
import { View, Title } from '@/components/Themed'
import IconArrowRight from '@/icons/arrow-right.svg'

interface HeaderProps {
	navigation: NativeStackNavigationProp<ParamListBase>
	route: Route<string>
	title?: string
	includeTitle?: boolean
	style?: StyleProp<ViewStyle>
}

export default function Header({
	navigation,
	route: { name },
	title,
	includeTitle = true,
	style,
}: HeaderProps) {
	return (
		<View style={[styles.container, style]}>
			<Pressable onPress={navigation.goBack} hitSlop={32}>
				<IconArrowRight {...styles.backArrow} />
			</Pressable>

			{includeTitle && (
				<Title style={styles.title}>{title || name}</Title>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
	},
	backArrow: {
		width: 20,
		height: 20,
		fill: Colors.primary,
		rotation: 180,
	},
	title: {
		textAlign: 'left',
		marginTop: 12,
	},
})

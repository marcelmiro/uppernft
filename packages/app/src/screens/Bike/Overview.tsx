import { useMemo } from 'react'
import {
	StyleSheet,
	ActivityIndicator,
	Pressable,
	FlatList,
	ScrollView,
} from 'react-native'

import Colors from '@/constants/Colors'
import { MainStackScreenProps } from '@/navigation/types'
import { inferQueryOutput, trpc } from '@/utils/trpc'
import { View, Text, layoutStyle } from '@/components/Themed'
import Header from '@/components/Header'

interface ItemProps {
	label: string
	value: string
}

const IMMUTABLE_COMPONENTS = [
	'model name',
	'model code',
	'serial number',
	'frame',
]

function propToLabel(text: string) {
	text = text.replace(/([A-Z])/g, ' $1')
	return text[0].toUpperCase() + text.slice(1).toLowerCase()
}

function getComponents(data: inferQueryOutput<'item.overview'>) {
	const { id, createdAt, updatedAt, ...components } = data.components

	const items: ItemProps[] = [
		{
			label: 'Model name',
			value: data.model.name,
		},
		{
			label: 'Model code',
			value: data.model.code,
		},
		{
			label: 'Serial number',
			value: data.serialNumber,
		},
	]

	for (const [key, value] of Object.entries(components)) {
		if (!value) continue
		items.push({ label: propToLabel(key), value })
	}

	return items
}

function Item({ label, value }: ItemProps) {
	const isComponentEditable = !IMMUTABLE_COMPONENTS.includes(
		label.toLowerCase()
	)

	return (
		<View style={styles.item}>
			<Text style={styles.itemLabel}>{label}</Text>
			<Text style={styles.itemValue}>{value}</Text>

			{isComponentEditable && (
				<Pressable onPress={() => {}} style={styles.itemButton}>
					<Text style={styles.itemButtonText}>Change</Text>
				</Pressable>
			)}
		</View>
	)
}

export default function BikeOverview(
	props: MainStackScreenProps<'BikeOverview'>
) {
	const { serialNumber } = props.route.params

	const { data, isLoading } = trpc.useQuery(
		['item.overview', { serialNumber }],
		{ refetchOnMount: false }
	)

	const components = useMemo(() => {
		return data ? getComponents(data) : null
	}, [data])

	const header = <Header {...props} title="Overview" />

	if (!isLoading && !components) {
		props.navigation.goBack()
		return null
	}

	if (isLoading)
		return (
			<View style={styles.loaderWrapper}>
				{header}

				<View style={styles.loaderContainer}>
					<ActivityIndicator
						size="large"
						color={Colors.accent}
						style={styles.loader}
					/>
				</View>
			</View>
		)

	return (
		<>
			<View style={styles.headerContainer}>{header}</View>

			<ScrollView style={{ width: '100%', flex: 1 }}>
				<ScrollView
					horizontal
					style={{ width: '100%', flex: 1 }}
					contentContainerStyle={{ width: '100%' }}
				>
					<FlatList
						data={components}
						renderItem={({ item }) => <Item {...item} />}
						keyExtractor={(item) => item.label}
						style={styles.container}
						contentContainerStyle={styles.content}
					/>
				</ScrollView>
			</ScrollView>
		</>
	)
}

const styles = StyleSheet.create({
	loaderWrapper: {
		...layoutStyle,
		flex: 1,
	},
	loaderContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loader: {
		marginBottom: '10%',
	},
	headerContainer: {
		...layoutStyle,
		marginBottom: 24,
	},
	container: {
		flex: 1,
		marginBottom: layoutStyle.marginBottom,
	},
	content: {
		marginHorizontal: layoutStyle.paddingHorizontal,
		paddingVertical: 4,
		paddingHorizontal: 16,
		backgroundColor: Colors.primary0,
		borderRadius: 16,
	},
	item: {
		marginVertical: 12,
	},
	itemLabel: {
		fontSize: 14,
		color: Colors.primary400,
		marginBottom: 4,
	},
	itemValue: {
		fontWeight: '500',
		fontSize: 16,
	},
	itemButton: {
		marginTop: 6,
		height: 32,
		paddingHorizontal: 10,
		backgroundColor: Colors.accent100,
		borderRadius: 8,
		alignSelf: 'flex-start',
		justifyContent: 'center',
		alignItems: 'center',
	},
	itemButtonText: {
		fontWeight: '500',
		fontSize: 14,
		color: Colors.accent,
	},
})

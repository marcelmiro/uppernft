import { useState } from 'react'
import {
	StyleSheet,
	Pressable,
	TextInput,
	Image,
	ActivityIndicator,
	RefreshControl,
	FlatList,
	ScrollView,
} from 'react-native'

import { MainStackScreenProps } from '@/navigation/types'
import Colors from '@/constants/Colors'
import { trpc, inferQueryOutput } from '@/utils/trpc'
import { Text, View, Button, layoutStyle } from '@/components/Themed'
import IconAccount from '@/icons/profile.svg'
import IconTray from '@/icons/tray.svg'

type Item = inferQueryOutput<'user.items'>[number]

interface EmptyViewProps {
	refreshControlProps: RefreshControl['props']
}

interface PopulatedViewProps {
	items: Item[]
	onItemPress(item: Item): void
	refreshControlProps: RefreshControl['props']
}

function LoadingView() {
	return (
		<View style={styles.loaderContainer}>
			<ActivityIndicator
				size="large"
				color={Colors.accent}
				style={styles.loader}
			/>
		</View>
	)
}

function EmptyView({ refreshControlProps }: EmptyViewProps) {
	return (
		<RefreshControl
			{...refreshControlProps}
			style={[styles.emptyContainer, refreshControlProps.style]}
		>
			<ScrollView
				style={styles.fullScreen}
				contentContainerStyle={styles.emptyContent}
			>
				<IconTray {...styles.emptyIcon} />

				<Text style={styles.emptyTitle}>
					You have no registered bikes
				</Text>

				<Text style={styles.emptySubtitle}>
					Register a bike by clicking the button below. If you wish to
					learn more about this app, you can find our guides in your
					account page.
				</Text>
			</ScrollView>
		</RefreshControl>
	)
}

function PopulatedView({
	items,
	onItemPress,
	refreshControlProps,
}: PopulatedViewProps) {
	function Item(item: Item) {
		return (
			<Pressable
				onPress={() => onItemPress(item)}
				style={({ pressed }) => [
					styles.itemContainer,
					pressed && styles.itemContainerPressed,
				]}
				key={item.id}
			>
				<Image
					style={styles.itemImage}
					source={{ uri: item.model.smallImageUri }}
				/>
				<View style={{ flex: 1 }}>
					<Text style={styles.itemTitle}>{item.model.name}</Text>
					<Text style={styles.itemSubtitle}>{item.serialNumber}</Text>
				</View>
			</Pressable>
		)
	}

	return (
		<FlatList
			data={items}
			renderItem={({ item }) => <Item {...item} />}
			keyExtractor={(item) => item.serialNumber}
			refreshControl={<RefreshControl {...refreshControlProps} />}
			style={styles.contentWrapper}
			contentContainerStyle={styles.content}
		/>
	)
}

export default function Home({ navigation }: MainStackScreenProps<'Home'>) {
	const [isRefreshing, setIsRefreshing] = useState(false)

	const { data, isLoading, isFetching, error, refetch } = trpc.useQuery(
		['user.items'],
		{
			onSettled() {
				setIsRefreshing(false)
			},
		}
	)

	const refreshControlProps: RefreshControl['props'] = {
		refreshing: isRefreshing && isFetching,
		onRefresh() {
			if (isRefreshing) return
			setIsRefreshing(true)
			refetch()
		},
	}

	function navigateItem(item: Item) {
		const {
			createdAt: _createdAt,
			updatedAt: _updatedAt,
			...model
		} = item.model
		const {
			createdAt: __createdAt,
			updatedAt: __updatedAt,
			...restItem
		} = item
		navigation.navigate('BikeMenu', { ...restItem, model })
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Pressable onPress={() => navigation.navigate('Account')}>
					<IconAccount {...styles.accountIcon} />
				</Pressable>

				<TextInput
					style={styles.searchBox}
					placeholder="Search serial number"
				/>
			</View>

			{isLoading ? (
				<LoadingView />
			) : !data || data.length === 0 ? (
				<EmptyView refreshControlProps={refreshControlProps} />
			) : (
				<PopulatedView
					items={data}
					onItemPress={navigateItem}
					refreshControlProps={refreshControlProps}
				/>
			)}

			<Button
				onPress={() =>
					navigation.navigate('BikeRegister', {
						screen: 'RegisterHome',
					})
				}
			>
				Register bike
			</Button>
		</View>
	)
}

const styles = StyleSheet.create({
	fullScreen: {
		width: '100%',
		flex: 1,
	},
	container: {
		...layoutStyle,
		marginBottom: 8,
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	accountIcon: {
		width: 28,
		height: 28,
		fill: Colors.primary,
	},
	searchBox: {
		flex: 1,
		marginLeft: 16,
		height: 38,
		paddingHorizontal: 12,
		borderRadius: 12,
		backgroundColor: Colors.primary150,
		color: Colors.primary,
		fontSize: 14,
	},
	loaderContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loader: {
		marginBottom: '10%',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		maxWidth: 290,
		paddingBottom: '10%',
	},
	emptyIcon: {
		width: 48,
		height: 48,
		fill: Colors.primary,
	},
	emptyTitle: {
		fontWeight: '500',
		fontSize: 18,
		textAlign: 'center',
		marginTop: 16,
		marginBottom: 12,
	},
	emptySubtitle: {
		textAlign: 'center',
		fontSize: 14,
		color: Colors.primary400,
	},
	contentWrapper: {
		width: '100%',
		marginTop: 32,
	},
	content: {
		width: '100%',
		backgroundColor: Colors.primary0,
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	itemContainer: {
		marginVertical: 4,
		paddingVertical: 10,
		paddingHorizontal: 8,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 8,
	},
	itemContainerPressed: {
		backgroundColor: Colors.primary200,
	},
	itemImage: {
		width: 48,
		height: 48,
		marginRight: 16,
	},
	itemTitle: {
		fontWeight: '500',
		fontSize: 16,
		marginBottom: 4,
	},
	itemSubtitle: {
		fontSize: 14,
		color: Colors.primary400,
	},
})

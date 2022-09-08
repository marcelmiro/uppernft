import {
	StyleSheet,
	Pressable,
	TextInput,
	Image,
	ScrollView,
} from 'react-native'

import { MainStackScreenProps } from '@/navigation/types'
import Colors from '@/constants/Colors'
import { Text, View, Button, layoutStyle } from '@/components/Themed'
import IconAccount from '@/icons/profile.svg'
import IconTray from '@/icons/tray.svg'

interface Item {
	id: string
	name: string
	imageUri: string
	isStolen: boolean
}

interface PopulatedViewProps {
	items: Item[]
	navigation: MainStackScreenProps<'Home'>['navigation']
}

const isEmpty = false

const bikes: Item[] = [
	{
		id: 'HP59218BM3N7',
		name: 'Spark RC SL EVO AXS',
		imageUri: 'https://i.imgur.com/jtj2sHj.png',
		isStolen: false,
	},
	{
		id: 'C31151F82NS1',
		name: "Quick CX Women's 1",
		imageUri: 'https://i.imgur.com/GM1MJOt.png',
		isStolen: true,
	},
]

function EmptyView() {
	return (
		<View style={styles.emptyContainer}>
			<IconTray {...styles.emptyIcon} />

			<Text style={styles.emptyTitle}>You have no registered bikes</Text>

			<Text style={styles.emptySubtitle}>
				Register a bike by clicking the button below. If you wish to
				learn more about this app, you can find our guides in your
				account page.
			</Text>
		</View>
	)
}

function PopulatedView({ items, navigation }: PopulatedViewProps) {
	return (
		<ScrollView
			style={styles.contentWrapper}
			contentContainerStyle={styles.content}
		>
			{items.map((bike) => (
				<Pressable
					onPress={() => navigation.navigate('BikeMenu', bike)}
					style={({ pressed }) => [
						styles.itemContainer,
						pressed && styles.itemContainerPressed,
					]}
					key={bike.id}
				>
					<Image
						style={styles.itemImage}
						source={{ uri: bike.imageUri }}
					/>
					<View style={{ flex: 1 }}>
						<Text style={styles.itemTitle}>{bike.name}</Text>
						<Text style={styles.itemSubtitle}>{bike.id}</Text>
					</View>
				</Pressable>
			))}
		</ScrollView>
	)
}

export default function Home({ navigation }: MainStackScreenProps<'Home'>) {
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

			{isEmpty ? (
				<EmptyView />
			) : (
				<PopulatedView items={bikes} navigation={navigation} />
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
	emptyContainer: {
		maxWidth: 290,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
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

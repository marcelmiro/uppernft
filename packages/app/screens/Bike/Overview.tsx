import {
	StyleSheet,
	ActivityIndicator,
	ScrollView,
	Pressable,
} from 'react-native'

import Colors from '../../constants/Colors'
import { MainStackScreenProps } from '../../types'
import { View, Text, layoutStyle } from '../../components/Themed'
import Header from '../../components/Header'

interface ItemProps {
	label: string
	value: string
	isEditable?: boolean
}

const isLoading = false

const data: ItemProps[] = [
	{ label: 'Model name', value: 'Spark RC SL EVO AXS' },
	{ label: 'Model code', value: '286249' },
	{ label: 'Serial number', value: 'HP59218BM3N7' },
	{
		label: 'Fork',
		value: 'FOX 34 SC Float Factory Air / Kashima FIT4',
		isEditable: true,
	},
	{
		label: 'Rear shock',
		value: 'FOX NUDE 5 Factory EVOL Trunnion SCOTT custom w. travel / geo adj.',
	},
	{ label: 'Remote system', value: 'SCOTT TwinLoc 2' },
	{ label: 'Rear derailleur', value: 'SRAM XX1 Eagle AXS' },
	{ label: 'Shifters', value: 'SRAM Eagle AXS Rocker Controller' },
	{
		label: 'Crankset',
		value: 'SRAM XX1 Eagle AXS Carbon crankarm / Power Meter DUB / 55mm CL / 32T',
	},
	{ label: 'Chain', value: 'SRAM CN XX1 Eagle', isEditable: true },
	{ label: 'Cassette', value: 'SRAM XX1 XG1299 / 10-52 T' },
	{ label: 'Brakes', value: 'Shimano XTR M9100 Disc', isEditable: true },
	{ label: 'Rotor', value: 'Shimano RT-MT900 CL / 180/F and 160/R' },
	{
		label: 'Handlebar',
		value: 'Syncros Fraser iC SL XC Carbon',
		isEditable: true,
	},
	{ label: 'Seat', value: 'Syncros Belcarra SL Regular 1.0' },
	{
		label: 'Headset',
		value: 'Syncros - Acros Angle adjust & Cable Routing HS System',
	},
	{ label: 'Wheelset', value: 'Syncros Silverton SL2-30 CL full Carbon' },
	{
		label: 'Front tire',
		value: 'Maxxis Rekon Race / 29x2.4" / 120TPI Foldable Bead',
	},
	{
		label: 'Rear tire',
		value: 'Maxxis Rekon Race / 29x2.4" / 120TPI Foldable Bead',
	},
]

function Item({ label, value, isEditable = false }: ItemProps) {
	return (
		<View style={styles.item}>
			<Text style={styles.itemLabel}>{label}</Text>
			<Text style={styles.itemValue}>{value}</Text>
			{isEditable && (
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
	const header = <Header {...props} title="Overview" />

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
		<View style={{ width: '100%', flex: 1 }}>
			<View style={styles.headerContainer}>{header}</View>

			<ScrollView style={styles.container}>
				<View style={styles.content}>
					{data.map((item) => (
						<Item {...item} key={item.label} />
					))}
				</View>
			</ScrollView>
		</View>
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
		...layoutStyle,
		marginTop: 0,
	},
	content: {
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

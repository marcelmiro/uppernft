import * as React from 'react'
import {
	StyleSheet,
	ScrollView,
	ActivityIndicator,
	Pressable,
} from 'react-native'
import { SvgProps } from 'react-native-svg'

import Colors from '@/constants/Colors'
import { MainStackScreenProps } from '@/navigation/types'
import { View, Text, layoutStyle } from '@/components/Themed'
import Header from '@/components/Header'
import IconPlus from '@/icons/plus.svg'
import IconArrowBidirectional from '@/icons/arrow-bidirectional.svg'
import IconWrench from '@/icons/wrench.svg'
import IconWrite from '@/icons/write.svg'
import IconLink from '@/icons/link.svg'

const isLoading = false

type ActivityType = 'Registration' | 'Transfer' | 'Repair' | 'Component change'

interface Activity {
	type: ActivityType
	created_at: Date
	url?: string
}

interface ItemProps {
	date: string
	activities: Activity[]
}

const data: Activity[] = [
	{
		type: 'Registration',
		created_at: new Date(1656857870000),
	},
	{
		type: 'Repair',
		created_at: new Date(1659104270000),
	},
	{
		type: 'Transfer',
		created_at: new Date(1659104630000),
	},
	{
		type: 'Component change',
		created_at: new Date(),
	},
]

const activityTypeToIcon: Record<ActivityType, React.FC<SvgProps>> = {
	Registration: IconPlus,
	Transfer: IconArrowBidirectional,
	Repair: IconWrench,
	'Component change': IconWrite,
}

function sortActivitiesByDate(data: Activity[]) {
	const activityByDate: Record<string, Activity[]> = {}

	for (const activity of data) {
		const date = activity.created_at

		const month = date.toLocaleString('en-US', { month: 'long' })
		const dateString = `${month} ${date.getDate()}, ${date.getFullYear()}`

		if (!activityByDate[dateString]) activityByDate[dateString] = [activity]
		else activityByDate[dateString].push(activity)
	}

	const sortedDates = Object.keys(activityByDate).sort((a, b) => {
		const dateA = activityByDate[a]?.[0].created_at.getTime()
		const dateB = activityByDate[b]?.[0].created_at.getTime()

		if (!dateA) return 1
		if (!dateB) return -1

		return dateB - dateA
	})

	const sortedActivities = sortedDates
		.map((date) => {
			const activities = activityByDate[date]?.sort(
				(a, b) => b.created_at.getTime() - a.created_at.getTime()
			)
			if (!activities) return
			return { date, activities }
		})
		.filter(Boolean)

	return sortedActivities as Array<{ date: string; activities: Activity[] }>
}

function Item({ date, activities }: ItemProps) {
	return (
		<View style={styles.itemContainer}>
			<Text style={styles.itemDate}>{date}</Text>

			<View style={styles.itemContent}>
				{activities.map((activity) => {
					const Icon = activityTypeToIcon[activity.type]
					return (
						<View
							style={styles.activityContainer}
							key={activity.created_at.getTime()}
						>
							<View style={styles.activityIconContainer}>
								<Icon {...styles.activityIcon} />
							</View>

							<View style={styles.activityContent}>
								<Text style={styles.activityTitle}>
									{activity.type}
								</Text>
								<Text style={styles.activitySubtitle}>
									{`${
										activity.created_at
											.toLocaleDateString('en-US', {
												weekday: 'short',
											})
											.split(',')[0]
									}, ${activity.created_at.toLocaleDateString(
										'en-US',
										{ month: 'short' }
									)} ${activity.created_at.getDate()}`}
								</Text>
							</View>

							<Pressable onPress={() => {}} hitSlop={32}>
								<IconLink {...styles.activityLink} />
							</Pressable>
						</View>
					)
				})}
			</View>
		</View>
	)
}

export default function BikeActivity(
	props: MainStackScreenProps<'BikeActivity'>
) {
	const header = <Header {...props} title="Activity" />

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
		<View style={{ width: '100%' }}>
			<View style={styles.headerContainer}>{header}</View>

			<ScrollView>
				<View style={styles.container}>
					{sortActivitiesByDate(data).map((datum) => (
						<Item {...datum} key={datum.date} />
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
		marginBottom: 16,
	},
	container: {
		paddingHorizontal: layoutStyle.paddingHorizontal,
	},
	itemContainer: {
		marginVertical: 16,
	},
	itemDate: {
		fontWeight: '500',
		fontSize: 14,
		color: Colors.primary400,
		marginBottom: 16,
	},
	itemContent: {
		backgroundColor: Colors.primary0,
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 4,
	},
	activityContainer: {
		marginVertical: 12,
		flexDirection: 'row',
	},
	activityIconContainer: {
		width: 42,
		height: 42,
		marginRight: 16,
		backgroundColor: Colors.primary150,
		borderRadius: 42,
		justifyContent: 'center',
		alignItems: 'center',
	},
	activityIcon: {
		width: 18,
		height: 18,
		fill: Colors.primary300,
	},
	activityContent: {
		flex: 1,
	},
	activityTitle: {
		fontWeight: '500',
		fontSize: 16,
		marginBottom: 6,
	},
	activitySubtitle: {
		fontSize: 14,
		color: Colors.primary400,
	},
	activityLink: {
		width: 16,
		height: 16,
		fill: Colors.accent,
		marginTop: 2,
	},
})

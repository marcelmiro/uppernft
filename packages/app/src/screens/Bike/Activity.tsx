import * as React from 'react'
import {
	StyleSheet,
	ScrollView,
	ActivityIndicator,
	Pressable,
	SectionList,
	SectionListRenderItemInfo,
} from 'react-native'
import { SvgProps } from 'react-native-svg'
import * as Linking from 'expo-linking'

import Colors from '@/constants/Colors'
import { MainStackScreenProps } from '@/navigation/types'
import { inferQueryOutput, trpc } from '@/utils/trpc'
import { View, Text, layoutStyle } from '@/components/Themed'
import Header from '@/components/Header'
import IconPlus from '@/icons/plus.svg'
import IconArrowBidirectional from '@/icons/arrow-bidirectional.svg'
import IconWrench from '@/icons/wrench.svg'
import IconWrite from '@/icons/write.svg'
import IconLink from '@/icons/link.svg'

const { useMemo } = React

type Activity = inferQueryOutput<'item.activity'>['activities'][number]

interface ItemProps {
	title: string
	data: Activity[]
}

const activityTypeToText: Record<Activity['type'], string> = {
	MINT: 'Registration',
	TRANSFER: 'Transfer',
	REPAIR: 'Repair',
	COMPONENT_CHANGE: 'Component change',
}

const activityTypeToIcon: Record<Activity['type'], React.FC<SvgProps>> = {
	MINT: IconPlus,
	TRANSFER: IconArrowBidirectional,
	REPAIR: IconWrench,
	COMPONENT_CHANGE: IconWrite,
}

function sortActivitiesByDate(data: Activity[]) {
	const activityByDate: Record<string, Activity[]> = {}

	for (const activity of data) {
		const date = activity.createdAt

		const month = date.toLocaleString('en-US', { month: 'long' })
		const dateString = `${month} ${date.getDate()}, ${date.getFullYear()}`

		if (!activityByDate[dateString]) activityByDate[dateString] = [activity]
		else activityByDate[dateString].push(activity)
	}

	const sortedDates = Object.keys(activityByDate).sort((a, b) => {
		const dateA = activityByDate[a]?.[0].createdAt.getTime()
		const dateB = activityByDate[b]?.[0].createdAt.getTime()

		if (!dateA) return 1
		if (!dateB) return -1

		return dateB - dateA
	})

	const sortedActivities: ItemProps[] = []

	for (const date of sortedDates) {
		const activities = activityByDate[date]?.sort(
			(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
		)
		if (!activities) continue
		sortedActivities.push({ title: date, data: activities })
	}

	return sortedActivities
}

function SectionHeader({ title }: Pick<ItemProps, 'title'>) {
	return (
		<View style={styles.sectionHeader}>
			<Text style={styles.sectionTitle}>{title}</Text>
		</View>
	)
}

function Item({
	item,
	index,
	section,
}: SectionListRenderItemInfo<Activity, ItemProps>) {
	const { type, createdAt, externalLink } = item
	const Icon = activityTypeToIcon[type]
	const isFirst = index === 0
	const isLast = index === section.data.length - 1

	return (
		<>
			{isFirst && <SectionHeader title={section.title} />}

			<View
				style={[
					styles.activityContainer,
					isFirst && styles.firstActivityContainer,
					isLast && styles.lastActivityContainer,
				]}
			>
				<View style={styles.activityIconContainer}>
					<Icon {...styles.activityIcon} />
				</View>

				<View style={styles.activityContent}>
					<Text style={styles.activityTitle}>
						{activityTypeToText[type]}
					</Text>
					<Text style={styles.activitySubtitle}>
						{`${
							createdAt
								.toLocaleDateString('en-US', {
									weekday: 'short',
								})
								.split(',')[0]
						}, ${createdAt.toLocaleDateString('en-US', {
							month: 'short',
						})} ${createdAt.getDate()}`}
					</Text>
				</View>

				{!!externalLink && (
					<Pressable
						onPress={() => Linking.openURL(externalLink)}
						hitSlop={16}
					>
						<IconLink {...styles.activityLink} />
					</Pressable>
				)}
			</View>
		</>
	)
}

function LoadingView({ header }: { header: JSX.Element }) {
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
}

function EmptyView() {
	return <Text style={styles.emptyTitle}>This bike has no activity yet.</Text>
}

export default function BikeActivity(
	props: MainStackScreenProps<'BikeActivity'>
) {
	const { serialNumber } = props.route.params

	const { data, isLoading } = trpc.useQuery(
		['item.activity', { serialNumber }],
		{ refetchOnMount: false }
	)

	const activities = useMemo(
		() => (data ? sortActivitiesByDate(data.activities) : []),
		[data]
	)

	const header = <Header {...props} title="Activity" />

	if (!isLoading && !activities) {
		props.navigation.goBack()
		return null
	}

	if (isLoading) return <LoadingView header={header} />

	return (
		<>
			<View style={styles.headerContainer}>{header}</View>

			<ScrollView style={{ width: '100%', flex: 1 }}>
				<ScrollView
					horizontal
					style={{ width: '100%', flex: 1 }}
					contentContainerStyle={{ width: '100%' }}
				>
					<SectionList
						sections={activities}
						renderItem={Item}
						keyExtractor={(item) => String(item.id)}
						contentContainerStyle={styles.content}
						ListEmptyComponent={EmptyView}
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
		marginBottom: 0,
	},
	content: {
		flex: 1,
		paddingHorizontal: layoutStyle.paddingHorizontal,
		marginBottom: layoutStyle.marginBottom,
	},
	emptyTitle: {
		marginTop: 32,
		fontSize: 16,
		color: Colors.primary400,
	},
	sectionHeader: {
		marginTop: 32,
		marginBottom: 16,
	},
	sectionTitle: {
		fontWeight: '500',
		fontSize: 14,
		color: Colors.primary400,
	},
	activityContainer: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		flexDirection: 'row',
		backgroundColor: Colors.primary0,
	},
	firstActivityContainer: {
		paddingTop: 16,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	lastActivityContainer: {
		paddingBottom: 16,
		borderBottomLeftRadius: 12,
		borderBottomRightRadius: 12,
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

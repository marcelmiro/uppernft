import * as React from 'react'
import {
	StyleSheet,
	Pressable,
	Image,
	Dimensions,
	ScrollView,
	Share,
} from 'react-native'
import { SvgProps } from 'react-native-svg'
import Constants from 'expo-constants'

import Colors from '@app/constants/Colors'
import { MainStackScreenProps } from '@app/navigation/types'
import { trpc } from '@app/utils/trpc'
import { View, Text, Button, layoutStyle } from '@app/components/Themed'
import Header from '@app/components/Header'
import Modal from '@app/components/Modal'
import IconShare from '@app/icons/share.svg'
import IconEye from '@app/icons/eye.svg'
import IconActivity from '@app/icons/activity.svg'
import IconArrowBidirectional from '@app/icons/arrow-bidirectional.svg'
import IconWarning from '@app/icons/warning.svg'
import IconDefense from '@app/icons/defense.svg'
import IconGear from '@app/icons/gear.svg'

const { useState } = React

interface ActionProps {
	title: string
	desc: string
	icon: React.FC<SvgProps>
	onPress(): void
}

interface TheftModalProps {
	show: boolean
	handleClose(): void
	onPress(): unknown
	isStolen: boolean
}

interface TheftInfoModalProps {
	show: boolean
	handleClose(): void
	onPress(): void
}

const WEB_URL = Constants.manifest?.extra?.WEB_URL

const { width } = Dimensions.get('window')
const imageMinHeight = parseInt(String(width / 2))

function Action({ title, desc, icon: Icon, onPress }: ActionProps) {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [
				styles.actionContainer,
				pressed && styles.actionContainerPressed,
			]}
		>
			<View style={styles.actionIconContainer}>
				<Icon {...styles.actionIcon} />
			</View>
			<View style={styles.actionContent}>
				<Text style={styles.actionTitle}>{title}</Text>
				<Text style={styles.actionSubtitle}>{desc}</Text>
			</View>
		</Pressable>
	)
}

function TheftModal({ show, handleClose, onPress, isStolen }: TheftModalProps) {
	const [isLoading, setIsLoading] = useState(false)

	async function handlePress() {
		try {
			setIsLoading(true)
			await onPress()
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Modal show={show} handleClose={handleClose}>
			<Text style={styles.modalTitle}>
				{isStolen
					? "Are you sure you want to remove the bike's stolen tag?"
					: 'Are you sure you want to mark this bike as stolen?'}
			</Text>
			<Text style={styles.modalSubtitle}>
				{isStolen
					? 'Anyone that searches or scans your physical bike will stop receiving notifications about its theft and the bike will be transferable again.'
					: 'Anyone that searches or scans your physical bike will be shown a message to notify you about any new information about the bike such as its last known location.'}
			</Text>
			<Button
				onPress={handlePress}
				containerStyle={styles.modalButton}
				isLoading={isLoading}
			>
				{isStolen ? 'Remove stolen tag' : 'Mark as stolen'}
			</Button>
		</Modal>
	)
}

function TheftInfoModal({ show, handleClose }: TheftInfoModalProps) {
	// TODO: Write modal text
	return (
		<Modal show={show} handleClose={handleClose}>
			<Text style={styles.modalTitle}>This bike is marked as stolen</Text>
			<Text style={styles.modalSubtitle}>Lorem ipsum dolor sit amet</Text>
			{/* TODO: Button to redirect to form to inform bike owner of latest status (e.g. location, supposed owner etc.) */}
		</Modal>
	)
}

export default function BikeMenu(props: MainStackScreenProps<'BikeMenu'>) {
	const navigation = props.navigation
	const {
		serialNumber,
		model: { name, imageUri },
	} = props.route.params

	const [isStolen, setIsStolen] = useState(props.route.params.isStolen)
	const [showTheftModal, setShowTheftModal] = useState(false)
	const [showTheftInfoModal, setShowTheftInfoModal] = useState(false)

	const { setQueryData } = trpc.useContext()

	const { mutateAsync: mutateStolen } = trpc.useMutation(['item.stolen'], {
		onSuccess({ isStolen }) {
			setIsStolen(isStolen)
			setShowTheftModal(false)
			setQueryData(['user.items'], (items) => {
				if (!items) return []
				return items.map((item) => ({
					...item,
					isStolen:
						item.serialNumber === serialNumber
							? isStolen
							: item.isStolen,
				}))
			})
		},
	})

	function toggleStolen() {
		return mutateStolen({ serialNumber, isStolen: !isStolen })
	}

	function share() {
		const url = `${WEB_URL}/bike/${serialNumber.toUpperCase()}`
		return Share.share({ url })
	}

	return (
		<View style={styles.container}>
			<TheftModal
				show={showTheftModal}
				handleClose={() => setShowTheftModal(false)}
				onPress={toggleStolen}
				isStolen={isStolen}
			/>

			<View style={styles.headerContainer}>
				<Header {...props} style={styles.header} includeTitle={false} />

				<Pressable onPress={share}>
					<IconShare {...styles.shareIcon} />
				</Pressable>
			</View>

			<View
				style={[styles.imageContainer, { minHeight: imageMinHeight }]}
			>
				<Image
					style={styles.image}
					source={{ uri: imageUri }}
					resizeMode="cover"
				/>

				{isStolen && (
					<>
						<TheftInfoModal
							show={showTheftInfoModal}
							handleClose={() => setShowTheftInfoModal(false)}
							onPress={() => {}}
						/>

						<Pressable
							style={styles.theftIconContainer}
							onPress={() => setShowTheftInfoModal(true)}
						>
							<IconWarning {...styles.theftIcon} />
						</Pressable>
					</>
				)}
			</View>

			<ScrollView style={styles.contentWrapper}>
				<View style={styles.content}>
					<Text style={styles.title}>{name}</Text>
					<Text style={styles.subtitle}>
						{serialNumber.toUpperCase()}
					</Text>

					<Action
						title="Overview"
						desc="Show additional information"
						icon={IconEye}
						onPress={() =>
							navigation.navigate('BikeOverview', {
								serialNumber,
							})
						}
					/>

					<Action
						title="Activity"
						desc="Show the latest activity"
						icon={IconActivity}
						onPress={() =>
							navigation.navigate('BikeActivity', {
								serialNumber,
							})
						}
					/>

					<Action
						title="Transfer"
						desc="Send the digital copy to another user"
						icon={IconArrowBidirectional}
						onPress={() =>
							navigation.navigate('BikeTransfer', {
								screen: 'TransferHome',
								params: { serialNumber },
							})
						}
					/>

					{isStolen ? (
						<Action
							title="Withdraw theft report"
							desc="Stop alerting users about the theft"
							icon={IconDefense}
							onPress={() => setShowTheftModal(true)}
						/>
					) : (
						<Action
							title="Report theft"
							desc="Alert users about the theft"
							icon={IconWarning}
							onPress={() => setShowTheftModal(true)}
						/>
					)}

					<Action
						title="Settings"
						desc="Show additional options"
						icon={IconGear}
						onPress={() =>
							navigation.navigate('BikeSettings', {
								serialNumber,
							})
						}
					/>
				</View>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		...layoutStyle,
		marginBottom: 0,
		flex: 1,
	},
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: -20,
	},
	header: {
		width: 'auto',
	},
	shareIcon: {
		width: 24,
		height: 24,
		fill: Colors.primary,
	},
	imageContainer: {
		marginHorizontal: 16,
		maxHeight: 300,
		flex: 1,
	},
	image: {
		width: '100%',
		height: '100%',
	},
	contentWrapper: {
		width,
		backgroundColor: Colors.primary0,
		marginLeft: layoutStyle.paddingHorizontal * -1,
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
		flexGrow: 0,
		flexShrink: 1,
	},
	content: {
		paddingHorizontal: 24,
		paddingTop: 32,
		paddingBottom: 16,
	},
	title: {
		fontWeight: '500',
		fontSize: 22,
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: Colors.primary400,
		marginBottom: 16,
	},
	actionContainer: {
		marginVertical: 4,
		paddingVertical: 10,
		marginHorizontal: -8,
		paddingHorizontal: 8,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 8,
	},
	actionContainerPressed: {
		backgroundColor: Colors.primary200,
	},
	actionIconContainer: {
		width: 40,
		height: 40,
		backgroundColor: Colors.accent,
		borderRadius: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	actionIcon: {
		width: 18,
		height: 18,
		fill: Colors.primary0,
	},
	actionContent: {
		marginLeft: 16,
	},
	actionTitle: {
		fontSize: 16,
		color: Colors.primary,
		marginBottom: 4,
	},
	actionSubtitle: {
		fontSize: 14,
		color: Colors.primary400,
	},
	theftIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 48,
		backgroundColor: Colors.error200,
		position: 'absolute',
		bottom: 0,
		left: '50%',
		transform: [
			{
				translateX: -24,
			},
			{
				translateY: 22,
			},
		],
		zIndex: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	theftIcon: {
		width: 20,
		height: 20,
		fill: Colors.error,
		marginBottom: 2,
	},
	modalTitle: {
		fontWeight: '500',
		fontSize: 18,
		marginBottom: 24,
		textAlign: 'center',
	},
	modalSubtitle: {
		fontSize: 14,
		color: Colors.primary400,
		textAlign: 'center',
	},
	modalButton: {
		marginTop: 24,
		marginBottom: 0,
	},
})

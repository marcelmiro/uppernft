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

import Colors from '../../constants/Colors'
import { MainStackScreenProps } from '../../types'
import { View, Text, Button, layoutStyle } from '../../components/Themed'
import Header from '../../components/Header'
import Modal from '../../components/Modal'
import IconShare from '../../assets/icons/share.svg'
import IconEye from '../../assets/icons/eye.svg'
import IconActivity from '../../assets/icons/activity.svg'
import IconArrowBidirectional from '../../assets/icons/arrow-bidirectional.svg'
import IconWarning from '../../assets/icons/warning.svg'
import IconDefense from '../../assets/icons/defense.svg'
import IconGear from '../../assets/icons/gear.svg'

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
	onPress(): void
	isStolen: boolean
}

interface TheftInfoModalProps {
	show: boolean
	handleClose(): void
	onPress(): void
}

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
			<Button onPress={onPress} containerStyle={styles.modalButton}>
				{isStolen ? 'Remove stolen tag' : 'Mark as stolen'}
			</Button>
		</Modal>
	)
}

function TheftInfoModal({ show, handleClose, onPress }: TheftInfoModalProps) {
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
	const [showTheftModal, setShowTheftModal] = useState(false)
	const [showTheftInfoModal, setShowTheftInfoModal] = useState(false)

	const {
		navigation,
		route: {
			params: { id, name, imageUri, isStolen },
		},
	} = props

	const { width } = Dimensions.get('window')

	const imageMinHeight = parseInt(String(width / 2))

	function reportTheft() {
		setShowTheftModal(false)
	}

	function withdrawTheftReport() {
		setShowTheftModal(false)
	}

	function share() {
		// TODO: Get URL from app config file
		return Share.share({ url: 'https://google.com/' })
	}

	return (
		<View style={styles.container}>
			<TheftModal
				show={showTheftModal}
				handleClose={() => setShowTheftModal(false)}
				onPress={isStolen ? withdrawTheftReport : reportTheft}
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

			<ScrollView style={[styles.contentWrapper, { width }]}>
				<View style={styles.content}>
					<Text style={styles.title}>{name}</Text>
					<Text style={styles.subtitle}>{id}</Text>

					<Action
						title="Overview"
						desc="Show additional information"
						icon={IconEye}
						onPress={() =>
							navigation.navigate('BikeOverview', { id })
						}
					/>

					<Action
						title="Activity"
						desc="Show the latest activity"
						icon={IconActivity}
						onPress={() =>
							navigation.navigate('BikeActivity', { id })
						}
					/>

					<Action
						title="Transfer"
						desc="Send the digital copy to another user"
						icon={IconArrowBidirectional}
						onPress={() =>
							navigation.navigate('BikeTransfer', {
								screen: 'TransferHome',
								params: { id },
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
							navigation.navigate('BikeSettings', { id })
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

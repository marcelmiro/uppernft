import * as React from 'react'
import {
	StyleSheet,
	Pressable,
	ScrollView,
	Platform,
	Linking,
} from 'react-native'
import { SvgProps } from 'react-native-svg'
import Constants from 'expo-constants'

import Colors from '@/constants/Colors'
import { MainStackScreenProps } from '@/navigation/types'
import { useLogout } from '@/lib/auth'
import {
	Text,
	TextLink,
	View,
	Button,
	Switch,
	layoutStyle,
} from '@/components/Themed'
import Header from '@/components/Header'
import Modal from '@/components/Modal'

import IconQuestion from '@/icons/question.svg'
import IconEmail from '@/icons/email.svg'
import IconPhone from '@/icons/phone.svg'
import IconMegaphone from '@/icons/megaphone.svg'
import IconStar from '@/icons/star.svg'
import IconTwitter from '@/icons/twitter.svg'
import IconDocument from '@/icons/document.svg'
import IconInfo from '@/icons/info.svg'
import IconExit from '@/icons/exit.svg'
import IconBin from '@/icons/bin.svg'
import { useAuth } from '@/lib/auth'

const { useState } = React

interface SettingProps {
	title: string
	desc?: string
	icon: React.FC<SvgProps>
	onPress(): void
	toggleValue?: boolean
	iconFill?: string
}

function Setting({
	title,
	desc,
	icon: Icon,
	onPress,
	toggleValue,
	iconFill,
}: SettingProps) {
	return (
		<Pressable
			style={({ pressed }) => [
				styles.settingContainer,
				pressed && styles.settingContainerPressed,
			]}
			onPress={onPress}
		>
			<Icon
				{...styles.settingIcon}
				fill={iconFill || styles.settingIcon.fill}
			/>

			<View style={styles.settingContent}>
				<Text style={styles.settingTitle}>{title}</Text>
				{desc && <Text style={styles.settingSubtitle}>{desc}</Text>}
			</View>

			{toggleValue !== undefined && (
				<View style={styles.settingToggleContainer}>
					<Switch value={toggleValue} onValueChange={onPress} />
				</View>
			)}
		</Pressable>
	)
}

export default function Account(props: MainStackScreenProps<'Account'>) {
	const { navigation } = props

	const [showHelpModal, setShowHelpModal] = useState(false)
	const [getPersonalisedEmails, setGetPersonalisedEmails] = useState(true)
	const [getPersonalisedPushes, setGetPersonalisedPushes] = useState(false)
	const [shareData, setShareData] = useState(true)

	const { user } = useAuth()
	const username = user?.username
	const { logout, isLoading } = useLogout()

	function handleLogout() {
		if (isLoading) return
		return logout()
	}

	function changeUsername() {
		if (!username) return
		navigation.navigate('UsernameChange', { username })
	}

	function reviewApp() {
		let url: string | undefined

		if (Platform.OS === 'android') {
			url = Constants.manifest?.android?.playStoreUrl
			if (url) url += '&showAllReviews=true'
		} else if (Platform.OS === 'ios') {
			url = Constants.manifest?.ios?.appStoreUrl
			if (url) url += '?action=write-review'
		}

		if (!url) return

		return Linking.openURL(url)
	}

	function openTwitter() {
		const url = Constants.manifest?.extra?.TWITTER_URL
		return url && Linking.openURL(url)
	}

	return (
		<>
			<Modal
				show={showHelpModal}
				handleClose={() => setShowHelpModal(false)}
			>
				<Text style={styles.helpModalTitle}>What is AppName?</Text>
				<Text style={styles.helpModalSubtitle}>
					AppName is a blockchain-based app developed by UpperNFT in a
					partnership with BikeCompany. This app allows users to
					generate unique digital copies (NFTs) of each bike sold by
					BikeCompany. These digital copies can be used as a proof of
					ownership for third-party transactions as well as a way to
					provide immutable history to bikes. In addition, users can
					report bike thefts and notify people that scan or search
					your bike online.
				</Text>
				<Button
					onPress={() => {}}
					containerStyle={styles.helpModalButton}
				>
					Learn more
				</Button>
			</Modal>

			<View style={styles.header}>
				<Header {...props} />

				<TextLink style={styles.username} onPress={changeUsername}>
					@{username}
				</TextLink>
			</View>

			<ScrollView style={styles.content}>
				<View style={styles.section}>
					<View style={styles.sectionContent}>
						<Setting
							title="Help"
							icon={IconQuestion}
							onPress={() => setShowHelpModal(true)}
						/>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Privacy</Text>

					<View style={styles.sectionContent}>
						<Setting
							title="Personalised emails"
							desc="I'm happy to receive emails about app events that involve me"
							icon={IconEmail}
							toggleValue={getPersonalisedEmails}
							onPress={() =>
								setGetPersonalisedEmails((prev) => !prev)
							}
						/>

						<Setting
							title="Personalised pushes"
							desc="I'm happy to receive push notifications about app events that involve me"
							icon={IconPhone}
							toggleValue={getPersonalisedPushes}
							onPress={() =>
								setGetPersonalisedPushes((prev) => !prev)
							}
						/>

						<Setting
							title="Social media & advertising platforms"
							desc="I'm happy for BikeCompany to share my username, email and app events with social media platforms, to allow BikeCompany to advertise to me and others like me"
							icon={IconMegaphone}
							toggleValue={shareData}
							onPress={() => setShareData((prev) => !prev)}
						/>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>About us</Text>

					<View style={styles.sectionContent}>
						<Setting
							title="Rate us on Google Play"
							icon={IconStar}
							onPress={reviewApp}
						/>

						<Setting
							title="Follow us on Twitter"
							icon={IconTwitter}
							onPress={openTwitter}
						/>

						<Setting
							title="Privacy policy"
							icon={IconDocument}
							onPress={() => {}}
						/>

						<Setting
							title="Terms & conditions"
							icon={IconInfo}
							onPress={() => {}}
						/>
					</View>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionContent}>
						<Setting
							title="Log out"
							icon={IconExit}
							iconFill={Colors.error}
							onPress={handleLogout}
						/>

						<Setting
							title="Close account"
							icon={IconBin}
							iconFill={Colors.error}
							onPress={() => {}}
						/>
					</View>
				</View>
			</ScrollView>
		</>
	)
}

const styles = StyleSheet.create({
	header: {
		...layoutStyle,
		marginBottom: 24,
	},
	username: {
		marginTop: 4,
		fontWeight: '500',
		fontSize: 16,
		color: Colors.accent,
	},
	content: {
		width: '100%',
		paddingHorizontal: layoutStyle.paddingHorizontal,
		marginBottom: layoutStyle.marginBottom - 16,
	},
	section: {
		marginVertical: 16,
	},
	sectionTitle: {
		fontWeight: '500',
		fontSize: 14,
		color: Colors.primary400,
		marginBottom: 16,
	},
	sectionContent: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		backgroundColor: Colors.primary0,
		borderRadius: 12,
	},
	settingContainer: {
		marginVertical: 4,
		paddingVertical: 20,
		paddingHorizontal: 20,
		flexDirection: 'row',
		borderRadius: 8,
	},
	settingContainerPressed: {
		backgroundColor: Colors.primary200,
	},
	settingIcon: {
		width: 20,
		height: 20,
		fill: Colors.accent,
		marginTop: 1,
	},
	settingContent: {
		marginLeft: 28,
		flex: 1,
	},
	settingTitle: {
		fontWeight: '500',
		fontSize: 16,
	},
	settingSubtitle: {
		marginTop: 4,
		fontSize: 14,
		color: Colors.primary400,
	},
	settingToggleContainer: {
		alignSelf: 'center',
		marginLeft: 20,
	},
	helpModalTitle: {
		fontWeight: '500',
		fontSize: 18,
		marginBottom: 24,
		textAlign: 'center',
	},
	helpModalSubtitle: {
		fontSize: 14,
		color: Colors.primary400,
		textAlign: 'center',
	},
	helpModalButton: {
		marginTop: 24,
		marginBottom: 0,
	},
})

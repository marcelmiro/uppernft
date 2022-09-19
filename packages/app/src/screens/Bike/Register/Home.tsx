import { useState, useEffect } from 'react'
import { StyleSheet, ActivityIndicator } from 'react-native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { TRPCClientErrorLike } from '@trpc/client'

import Colors from '@app/constants/Colors'
import {
	BikeRegisterStackScreenProps,
	BikeRegisterStackParamList,
} from '@app/navigation/types'
import { trpc, AppRouter } from '@app/utils/trpc'
import { View, Text, TextLink, layoutStyle } from '@app/components/Themed'
import Header from '@app/components/Header'
import Modal from '@app/components/Modal'
import IconScanner from '@app/icons/scanner.svg'

interface StatusModalData {
	title?: string
	desc?: string
}

interface StatusModalProps extends StatusModalData {
	show: boolean
	handleClose(): void
}

interface UseRegistrableQueryOptions {
	serialNumber: string
	navigation: NativeStackNavigationProp<
		BikeRegisterStackParamList,
		'RegisterHome' | 'ManualRegister'
	>
	onError?(e: TRPCClientErrorLike<AppRouter>): void
}

interface ContentViewProps {
	navigation: NativeStackNavigationProp<BikeRegisterStackParamList>
}

export function useRegistrableQuery({
	serialNumber,
	navigation,
	onError,
}: UseRegistrableQueryOptions) {
	return trpc.useQuery(['item.registrable', { serialNumber }], {
		enabled: false,
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		onSuccess(data) {
			navigation.navigate('ConfirmRegister', data)
		},
		onError,
	})
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

function ContentView({ navigation }: ContentViewProps) {
	return (
		<>
			<View style={styles.contentContainer}>
				<IconScanner {...styles.contentIcon} />

				<Text style={styles.contentTitle}>Scan the NFC tag</Text>

				<Text style={styles.contentSubtitle}>
					The tag can be found in the bike frame. Activate the phone's
					NFC and move the phone close to the tag.
				</Text>
			</View>

			<TextLink
				onPress={() => navigation.navigate('ManualRegister')}
				hitSlop={16}
			>
				Manually enter the serial number
			</TextLink>
		</>
	)
}

function StatusModal({ title, desc, show, handleClose }: StatusModalProps) {
	if (!title && !desc) return null

	return (
		<Modal show={show} handleClose={handleClose}>
			{title && <Text style={styles.modalTitle}>{title}</Text>}
			{desc && <Text style={styles.modalSubtitle}>{desc}</Text>}
		</Modal>
	)
}

export default function BikeRegisterHome(
	props: BikeRegisterStackScreenProps<'RegisterHome'>
) {
	const serialNumber = props.route.params?.serialNumber || ''

	const [showModal, setShowModal] = useState(false)
	const [modalData, setModalData] = useState<StatusModalData>({})

	const { isLoading, refetch } = useRegistrableQuery({
		serialNumber,
		navigation: props.navigation,
		onError(e) {
			if (e.data?.code === 'NOT_FOUND') {
				return openModal(
					'Bike not found',
					`Serial number '${serialNumber.toUpperCase()}' was not found in our database.`
				)
			}
			openModal(e.message)
		},
	})

	function openModal(title?: string, desc?: string) {
		setModalData({ title, desc })
		setShowModal(true)
	}

	useEffect(() => {
		if (serialNumber) refetch()
	}, [])

	return (
		<View style={styles.container}>
			<StatusModal
				{...modalData}
				show={showModal}
				handleClose={() => setShowModal(false)}
			/>

			<Header {...props} includeTitle={false} />

			{isLoading ? (
				<LoadingView />
			) : (
				<ContentView navigation={props.navigation} />
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	loaderContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loader: {
		marginBottom: '10%',
	},
	container: {
		...layoutStyle,
		flex: 1,
		marginBottom: 32,
		alignItems: 'center',
	},
	contentContainer: {
		maxWidth: 290,
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		paddingBottom: '10%',
	},
	contentIcon: {
		width: 48,
		height: 48,
		fill: Colors.primary,
	},
	contentTitle: {
		fontWeight: '500',
		fontSize: 18,
		textAlign: 'center',
		marginTop: 16,
		marginBottom: 12,
	},
	contentSubtitle: {
		textAlign: 'center',
		fontSize: 14,
		color: Colors.primary400,
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
})

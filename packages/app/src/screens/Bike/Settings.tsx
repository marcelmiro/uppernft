import * as React from 'react'
import { StyleSheet, ScrollView, Pressable } from 'react-native'
import { SvgProps } from 'react-native-svg'

import Colors from '@app/constants/Colors'
import { MainStackScreenProps } from '@app/navigation/types'
import { trpc } from '@app/utils/trpc'
import { Text, View, layoutStyle } from '@app/components/Themed'
import Header from '@app/components/Header'
import IconReceipt from '@app/icons/receipt.svg'
import IconWrite from '@app/icons/write.svg'
import IconBin from '@app/icons/bin.svg'

interface SettingProps {
	title: string
	desc?: string
	icon: React.FC<SvgProps>
	onPress?(): void
	iconFill?: string
}

function Setting({ title, desc, icon: Icon, onPress, iconFill }: SettingProps) {
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
		</Pressable>
	)
}

export default function BikeSettings(
	props: MainStackScreenProps<'BikeSettings'>
) {
	const { serialNumber } = props.route.params

	const { queryClient } = trpc.useContext()

	const { mutate: mutateDelete } = trpc.useMutation(['item.delete'], {
		onSuccess() {
			queryClient.removeQueries(['user.items'])
			props.navigation.reset({ routes: [{ name: 'Home' }] })
		},
	})

	return (
		<View style={styles.wrapper}>
			<Header {...props} style={styles.header} title="Settings" />

			<ScrollView>
				<View style={styles.container}>
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Receipt</Text>

						<View style={styles.sectionContent}>
							<Setting
								title="Show receipt"
								desc="View the receipt image as an additional proof of purchase"
								icon={IconReceipt}
							/>

							<Setting
								title="Change receipt"
								desc="Change the receipt image for a new one"
								icon={IconWrite}
							/>
						</View>
					</View>

					<View style={styles.section}>
						<View style={styles.sectionContent}>
							<Setting
								title="Delete digital copy"
								icon={IconBin}
								iconFill={Colors.error}
								onPress={() => mutateDelete({ serialNumber })}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		width: '100%',
		flex: 1,
	},
	header: {
		...layoutStyle,
		marginBottom: 16,
	},
	container: {
		paddingHorizontal: layoutStyle.paddingHorizontal,
		marginBottom: 4,
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
})

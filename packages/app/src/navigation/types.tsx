/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import {
	CompositeScreenProps,
	NavigatorScreenParams,
} from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { inferQueryOutput } from '@app/utils/trpc'

export type RootStackParamList = {
	Root:
		| NavigatorScreenParams<AuthTabParamList>
		| NavigatorScreenParams<MainStackParamList>
		| undefined
	Modal: undefined
	NotFound: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
	NativeStackScreenProps<RootStackParamList, Screen>

export type AuthStackParamList = {
	Onboarding: undefined
	Tab: undefined
}

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> =
	CompositeScreenProps<
		NativeStackScreenProps<AuthStackParamList, Screen>,
		NativeStackScreenProps<RootStackParamList>
	>

export type AuthTabParamList = {
	Login: undefined
	Signup: undefined
}

export type AuthTabScreenProps<Screen extends keyof AuthTabParamList> =
	CompositeScreenProps<
		BottomTabScreenProps<AuthTabParamList, Screen>,
		NativeStackScreenProps<AuthStackParamList>
	>

type BaseItem = inferQueryOutput<'user.items'>[number]
type ItemModel = Omit<BaseItem['model'], 'createdAt' | 'updatedAt'>
type Item = Omit<
	Omit<BaseItem, 'model'> & { model: ItemModel },
	'createdAt' | 'updatedAt'
>

export type MainStackParamList = {
	Home: undefined
	Account: undefined
	UsernameChange: { username: string }

	BikeRegister: NavigatorScreenParams<BikeRegisterStackParamList>
	BikeMenu: Item
	BikeOverview: { serialNumber: string }
	BikeActivity: { serialNumber: string }
	BikeTransfer: NavigatorScreenParams<BikeTransferStackParamList>
	BikeSettings: { serialNumber: string }
}

export type MainStackScreenProps<Screen extends keyof MainStackParamList> =
	CompositeScreenProps<
		NativeStackScreenProps<MainStackParamList, Screen>,
		NativeStackScreenProps<RootStackParamList>
	>

export type BikeRegisterStackParamList = {
	RegisterHome: { serialNumber?: string }
	ManualRegister: undefined
	ConfirmRegister: { serialNumber: string; name: string; imageUri: string }
	AfterRegisterInfo: undefined
}

export type BikeRegisterStackScreenProps<
	Screen extends keyof BikeRegisterStackParamList
> = CompositeScreenProps<
	NativeStackScreenProps<BikeRegisterStackParamList, Screen>,
	CompositeScreenProps<
		NativeStackScreenProps<MainStackParamList>,
		NativeStackScreenProps<RootStackParamList>
	>
>

export type BikeTransferStackParamList = {
	TransferHome: { serialNumber: string }
	BeforeTransferInfo: undefined
	AuthorizeTransfer: undefined
	AfterTransferInfo: undefined
}

export type BikeTransferStackScreenProps<
	Screen extends keyof BikeTransferStackParamList
> = CompositeScreenProps<
	NativeStackScreenProps<BikeTransferStackParamList, Screen>,
	CompositeScreenProps<
		NativeStackScreenProps<MainStackParamList>,
		NativeStackScreenProps<RootStackParamList>
	>
>

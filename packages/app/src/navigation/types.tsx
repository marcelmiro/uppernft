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

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

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

export type AuthTabParamList = {
	Login: undefined
	Signup: undefined
}

export type AuthTabScreenProps<Screen extends keyof AuthTabParamList> =
	CompositeScreenProps<
		BottomTabScreenProps<AuthTabParamList, Screen>,
		NativeStackScreenProps<RootStackParamList>
	>

export type MainStackParamList = {
	Home: undefined
	Account: undefined
	UsernameChange: { username: string }

	BikeRegister: NavigatorScreenParams<BikeRegisterStackParamList>
	BikeMenu: { id: string; name: string; imageUri: string; isStolen: boolean }
	BikeOverview: { id: string }
	BikeActivity: { id: string }
	BikeTransfer: NavigatorScreenParams<BikeTransferStackParamList>
	BikeSettings: { id: string }
}

export type MainStackScreenProps<Screen extends keyof MainStackParamList> =
	CompositeScreenProps<
		NativeStackScreenProps<MainStackParamList, Screen>,
		NativeStackScreenProps<RootStackParamList>
	>

export type BikeRegisterStackParamList = {
	RegisterHome: undefined
	ManualRegister: undefined
	ConfirmRegister: { id: string; name: string; imageUri: string }
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
	TransferHome: { id: string }
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

/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native'
import * as Linking from 'expo-linking'

import { RootStackParamList } from '@/navigation/types'

const linking: LinkingOptions<RootStackParamList> = {
	prefixes: [Linking.createURL('/')],
	config: {
		screens: {
			Root: {
				initialRouteName: 'Home',
				screens: {
					Login: 'login',
					Signup: 'signup',

					Account: 'account',
					UsernameChange: 'account/username-change',

					BikeRegister: 'bike/register',
					BikeMenu: 'bike/:serialNumber',
					BikeOverview: 'bike/:serialNumber/overview',
					BikeActivity: 'bike/:serialNumber/activity',
					BikeTransfer: 'bike/:serialNumber/transfer',
					BikeSettings: 'bike/:serialNumber/settings',
				},
			},
			Modal: 'modal',
			NotFound: '*',
		},
	},
}

export default linking

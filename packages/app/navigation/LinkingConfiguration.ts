/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native'
import * as Linking from 'expo-linking'

import { RootStackParamList } from '../types'

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
					BikeMenu: 'bike/:id',
					BikeOverview: 'bike/:id/overview',
					BikeActivity: 'bike/:id/activity',
					BikeTransfer: 'bike/:id/transfer',
					BikeSettings: 'bike/:id/settings',
				},
			},
			Modal: 'modal',
			NotFound: '*',
		},
	},
}

export default linking

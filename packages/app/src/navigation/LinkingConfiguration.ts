/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import Constants from 'expo-constants'
import * as Linking from 'expo-linking'
import type { LinkingOptions } from '@react-navigation/native'

import { RootStackParamList } from '@app/navigation/types'

const prefixes = [Linking.createURL('/')]

const WEB_URL = Constants.manifest?.extra?.WEB_URL as string | undefined
if (WEB_URL) prefixes.push(`${WEB_URL}/app`)

const linking: LinkingOptions<RootStackParamList> = {
	prefixes,
	config: {
		screens: {
			Root: {
				initialRouteName: 'Home',
				screens: {
					Home: '',
					Account: 'account',

					BikeRegister: {
						screens: {
							RegisterHome: 'bike/register/:serialNumber?',
						},
					},
				},
			},
			// Modal: 'modal',
			NotFound: '*', // TODO: Redesign
		},
	},
}

export default linking

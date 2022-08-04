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
				screens: {
					Login: {
						screens: {
							Login: 'login',
						},
					},
					Signup: {
						screens: {
							Signup: 'signup',
						},
					},
					Home: {
						screens: {
							Home: 'home',
						},
					},
				},
			},
			Modal: 'modal',
			NotFound: '*',
		},
	},
}

export default linking

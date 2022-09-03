import type { ExpoConfig } from '@expo/config'
import { config as dotenv } from 'dotenv'
import path from 'path'

const STAGE = process?.env.STAGE || process?.env.NODE_ENV

const envDirectory = path.resolve(__dirname, '../../.env')
dotenv({ path: envDirectory })

const config: ExpoConfig = {
	name: 'upperNFT demo',
	slug: 'uppernft-demo',
	version: '0.1.0',
	owner: 'marcelmiro',
	orientation: 'portrait',
	icon: './assets/images/icon.png',
	scheme: 'unft',
	userInterfaceStyle: 'automatic',
	backgroundColor: '#F7F7F7',
	splash: {
		image: './assets/images/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#F7F7F7',
	},
	updates: {
		fallbackToCacheTimeout: 0,
	},
	assetBundlePatterns: ['**/*'],
	jsEngine: 'hermes',
	ios: {
		appStoreUrl: 'https://apps.apple.com/es/app/google/id284815942',
		userInterfaceStyle: 'light',
	},
	android: {
		package: 'com.uppernft.demo',
		adaptiveIcon: {
			foregroundImage: './assets/images/adaptive-icon.png',
			backgroundColor: '#F7F7F7',
		},
		playStoreUrl:
			'https://play.google.com/store/apps/details?id=com.google.android.googlequicksearchbox',
		userInterfaceStyle: 'light',
	},
	/* web: {
		favicon: './assets/images/favicon.png',
	}, */
	extra: {
		STAGE,
		SID_NAME: 'uppernft.sid',
		API_URL: process.env.API_URL,
		TWITTER_URL: 'https://twitter.com/google',
		eas: {
			projectId: 'e351ac5e-6d7e-42f2-8619-71ed76d4b7f4',
		},
	},
}

export default config

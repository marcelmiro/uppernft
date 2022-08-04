import type { ExpoConfig } from '@expo/config'

const STAGE = process?.env.STAGE || process?.env.NODE_ENV

const envVariables: Record<string, Record<string, string>> = {
	development: {
		API_URL: 'http://192.168.1.123:3000/api/trpc',
	},
	production: {
		// API_URL: 'https://uppernft.vercel.app/api/trpc',
	},
	staging: {},
}

const config: ExpoConfig = {
	name: 'upperNFT demo',
	slug: 'uppernft-demo',
	version: '1.0.0',
	orientation: 'portrait',
	icon: './assets/images/icon.png',
	scheme: 'uppernft-demo',
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
	ios: {
		supportsTablet: true,
	},
	android: {
		adaptiveIcon: {
			foregroundImage: './assets/images/adaptive-icon.png',
			backgroundColor: '#F7F7F7',
		},
	},
	web: {
		favicon: './assets/images/favicon.png',
	},
	extra: {
		STAGE,
		SID_NAME: 'uppernft.sid',
		...(envVariables[STAGE || 'development'] || {}),
	},
}

export default config

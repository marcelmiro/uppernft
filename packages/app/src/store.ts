import * as SecureStore from 'expo-secure-store'

const SESSION_NAME = 'uppernft.sid'

export const sidStore = {
	value: '',
	get: async () => {
		const value = sidStore.value
		if (value) return value

		const token = (await SecureStore.getItemAsync(SESSION_NAME)) ?? ''
		sidStore.value = token
		return token
	},
	set: (newSessionToken: string) => {
		sidStore.value = newSessionToken
		return SecureStore.setItemAsync(SESSION_NAME, newSessionToken)
	},
	delete: () => {
		sidStore.value = ''
		return SecureStore.deleteItemAsync(SESSION_NAME)
	},
}

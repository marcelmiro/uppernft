import { useState, useEffect } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import * as SecureStore from 'expo-secure-store'

import { useAuth } from '@app/lib/auth'

SplashScreen.preventAutoHideAsync()

export default function useCachedResources() {
	const [isDataReady, setIsDataReady] = useState(false)
	const [isDataError, setIsDataError] = useState(false)

	const { isReady: isAuthReady, hasAborted: hasAuthAborted } = useAuth()

	const isLoadingComplete = isAuthReady && isDataReady
	const isError = hasAuthAborted || isDataError

	useEffect(() => {
		if (isLoadingComplete) SplashScreen.hideAsync()
	}, [isLoadingComplete])

	// Load any resources or data that we need prior to rendering the app
	useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				await Promise.all([
					Font.loadAsync(FontAwesome.font),
					SecureStore.isAvailableAsync(),
				])
				setIsDataReady(true)
			} catch (e) {
				// We might want to provide this error information to an error reporting service
				console.warn(e)
				setIsDataError(true)
			}
		}

		loadResourcesAndDataAsync()
	}, [])

	return { isLoadingComplete, isError }
}

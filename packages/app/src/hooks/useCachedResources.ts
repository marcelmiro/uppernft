import { useState, useEffect } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

import { useAuth } from '@/lib/auth'

SplashScreen.preventAutoHideAsync()

export default function useCachedResources() {
	const [isDataReady, setIsDataReady] = useState(false)

	const { isReady: isAuthReady, hasAborted: hasAuthAborted } = useAuth()

	const isLoadingComplete = isAuthReady && isDataReady

	useEffect(() => {
		if (isLoadingComplete) SplashScreen.hideAsync()
	}, [isLoadingComplete])

	// Load any resources or data that we need prior to rendering the app
	useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				await Font.loadAsync(FontAwesome.font)
			} catch (e) {
				// We might want to provide this error information to an error reporting service
				console.warn(e)
			} finally {
				setIsDataReady(true)
			}
		}

		loadResourcesAndDataAsync()
	}, [])

	return { isLoadingComplete, isError: hasAuthAborted }
}

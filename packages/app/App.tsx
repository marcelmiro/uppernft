import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

import useCachedResources from './hooks/useCachedResources'
import Navigation from './navigation'
import { trpc, createTRPCClient } from './utils/trpc'
import { AuthProvider } from './context/auth'

const queryClient = new QueryClient()

export default function App() {
	const [trpcClient] = useState(() => createTRPCClient())

	const isLoadingComplete = useCachedResources()
	if (!isLoadingComplete) return null

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<SafeAreaProvider style={{ flex: 1, width: '100%' }}>
						<Navigation />
						<StatusBar />
					</SafeAreaProvider>
				</AuthProvider>
			</QueryClientProvider>
		</trpc.Provider>
	)
}

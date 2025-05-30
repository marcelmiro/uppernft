import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { TRPCProvider } from '@app/utils/trpc'
import Navigation from '@app/navigation/index'

function App() {
	return (
		<TRPCProvider>
			<SafeAreaProvider style={{ width: '100%', flex: 1 }}>
				<Navigation />
				<StatusBar />
			</SafeAreaProvider>
		</TRPCProvider>
	)
}

registerRootComponent(App)

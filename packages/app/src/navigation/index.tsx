import { StyleProp, ViewStyle, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import {
	RootStackParamList,
	AuthTabParamList,
	MainStackParamList,
	BikeRegisterStackParamList,
	BikeTransferStackParamList,
} from '@app/navigation/types'
import LinkingConfiguration from '@app/navigation/LinkingConfiguration'
import useCachedResources from '@app/hooks/useCachedResources'
import { useAuth } from '@app/lib/auth'

import ErrorScreen from '@app/screens/ErrorScreen'
import ModalScreen from '@app/screens/ModalScreen'
import NotFoundScreen from '@app/screens/NotFoundScreen'
import Login from '@app/screens/Login'
import Signup from '@app/screens/Signup'
import Home from '@app/screens/Home'
import Account from '@app/screens/Account'
import UsernameChange from '@app/screens/UsernameChange'
import BikeMenu from '@app/screens/Bike/Menu'
import BikeRegisterHome from '@app/screens/Bike/Register/Home'
import BikeRegisterManual from '@app/screens/Bike/Register/Manual'
import BikeRegisterConfirm from '@app/screens/Bike/Register/Confirm'
import BikeRegisterAfterInfo from '@app/screens/Bike/Register/AfterInfo'
import BikeOverview from '@app/screens/Bike/Overview'
import BikeActivity from '@app/screens/Bike/Activity'
import BikeTransferHome from '@app/screens/Bike/Transfer/Home'
import BikeTransferAfterInfo from '@app/screens/Bike/Transfer/AfterInfo'
import BikeSettings from '@app/screens/Bike/Settings'

const contentStyle: StyleProp<ViewStyle> = {
	backgroundColor: 'transparent',
}

export default function Navigation() {
	const { isLoadingComplete, isError } = useCachedResources()
	if (!isLoadingComplete) return null

	return (
		<NavigationContainer
			linking={LinkingConfiguration}
			fallback={<Text>Loading...</Text>}
		>
			{isError ? <ErrorScreen /> : <RootNavigator />}
		</NavigationContainer>
	)
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const RootStack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
	const { user } = useAuth()

	return (
		<RootStack.Navigator>
			<RootStack.Screen
				name="Root"
				component={user ? MainNavigator : AuthNavigator}
				options={{
					contentStyle,
					headerShown: false,
				}}
				key={user ? 'main-navigator' : 'auth-navigator'}
			/>

			<RootStack.Screen
				name="NotFound"
				component={NotFoundScreen}
				options={{ title: 'Oops!' }}
			/>

			<RootStack.Group screenOptions={{ presentation: 'modal' }}>
				<RootStack.Screen name="Modal" component={ModalScreen} />
			</RootStack.Group>
		</RootStack.Navigator>
	)
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const AuthTab = createBottomTabNavigator<AuthTabParamList>()

function AuthNavigator() {
	return (
		<AuthTab.Navigator
			initialRouteName="Login"
			screenOptions={{ headerShown: false }}
			sceneContainerStyle={contentStyle}
			tabBar={() => null}
			backBehavior="none"
		>
			<AuthTab.Screen name="Login" component={Login} />
			<AuthTab.Screen name="Signup" component={Signup} />
		</AuthTab.Navigator>
	)
}

const MainStack = createNativeStackNavigator<MainStackParamList>()

function MainNavigator() {
	return (
		<MainStack.Navigator
			initialRouteName="Home"
			screenOptions={{
				contentStyle,
				header: () => null,
			}}
			key="main-stack"
		>
			<MainStack.Screen
				name="Home"
				component={Home}
				key="hello-world"
				navigationKey="hello-world"
			/>

			<MainStack.Screen name="Account" component={Account} />

			<MainStack.Screen
				name="UsernameChange"
				component={UsernameChange}
			/>

			<MainStack.Screen
				name="BikeRegister"
				component={BikeRegisterNavigator}
			/>

			<MainStack.Screen name="BikeMenu" component={BikeMenu} />

			<MainStack.Screen name="BikeOverview" component={BikeOverview} />

			<MainStack.Screen name="BikeActivity" component={BikeActivity} />

			<MainStack.Screen
				name="BikeTransfer"
				component={BikeTransferNavigator}
			/>

			<MainStack.Screen name="BikeSettings" component={BikeSettings} />
		</MainStack.Navigator>
	)
}

const BikeRegisterStack =
	createNativeStackNavigator<BikeRegisterStackParamList>()

function BikeRegisterNavigator() {
	return (
		<BikeRegisterStack.Navigator
			initialRouteName="RegisterHome"
			screenOptions={{
				contentStyle,
				header: () => null,
				animation: 'slide_from_right',
			}}
		>
			<BikeRegisterStack.Screen
				name="RegisterHome"
				component={BikeRegisterHome}
			/>

			<BikeRegisterStack.Screen
				name="ManualRegister"
				component={BikeRegisterManual}
			/>

			<BikeRegisterStack.Screen
				name="ConfirmRegister"
				component={BikeRegisterConfirm}
			/>

			<BikeRegisterStack.Screen
				name="AfterRegisterInfo"
				component={BikeRegisterAfterInfo}
			/>
		</BikeRegisterStack.Navigator>
	)
}

const BikeTransferStack =
	createNativeStackNavigator<BikeTransferStackParamList>()

function BikeTransferNavigator() {
	return (
		<BikeTransferStack.Navigator
			initialRouteName="TransferHome"
			screenOptions={{
				contentStyle,
				header: () => null,
				animation: 'slide_from_right',
			}}
		>
			<BikeTransferStack.Screen
				name="TransferHome"
				component={BikeTransferHome}
			/>

			<BikeTransferStack.Screen
				name="AfterTransferInfo"
				component={BikeTransferAfterInfo}
			/>
		</BikeTransferStack.Navigator>
	)
}

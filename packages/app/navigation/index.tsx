import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import {
	RootStackParamList,
	AuthTabParamList,
	MainStackParamList,
	BikeRegisterStackParamList,
	BikeTransferStackParamList,
} from '../types'
import LinkingConfiguration from './LinkingConfiguration'
import { useAuth } from '../context/auth'

import ModalScreen from '../screens/ModalScreen'
import NotFoundScreen from '../screens/NotFoundScreen'
import Login from '../screens/Login'
import Signup from '../screens/Signup'
import Home from '../screens/Home'
import Account from '../screens/Account'
import UsernameChange from '../screens/UsernameChange'
import BikeMenu from '../screens/Bike/Menu'
import BikeRegisterHome from '../screens/Bike/Register/Home'
import BikeRegisterManual from '../screens/Bike/Register/Manual'
import BikeRegisterConfirm from '../screens/Bike/Register/Confirm'
import BikeRegisterAfterInfo from '../screens/Bike/Register/AfterInfo'
import BikeOverview from '../screens/Bike/Overview'
import BikeActivity from '../screens/Bike/Activity'
import BikeTransferHome from '../screens/Bike/Transfer/Home'
import BikeTransferAfterInfo from '../screens/Bike/Transfer/AfterInfo'
import BikeSettings from '../screens/Bike/Settings'

const contentStyle: StyleProp<ViewStyle> = {
	backgroundColor: 'transparent',
}

export default function Navigation() {
	return (
		<NavigationContainer linking={LinkingConfiguration}>
			<RootNavigator />
		</NavigationContainer>
	)
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const RootStack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
	const { isAuthenticated } = useAuth()

	return (
		<RootStack.Navigator>
			<RootStack.Screen
				name="Root"
				component={isAuthenticated ? MainNavigator : AuthNavigator}
				options={{
					contentStyle,
					headerShown: false,
				}}
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

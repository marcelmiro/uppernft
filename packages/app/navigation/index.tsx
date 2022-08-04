import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'

import { RootStackParamList, RootTabParamList } from '../types'
import LinkingConfiguration from './LinkingConfiguration'
import ModalScreen from '../screens/ModalScreen'
import NotFoundScreen from '../screens/NotFoundScreen'
import Login from '../screens/Login'
import Signup from '../screens/Signup'
import Home from '../screens/Home'
import { useAuth } from '../context/auth'

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
const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Root"
				component={AuthNavigator}
				options={{
					headerShown: false,
					contentStyle: { backgroundColor: 'transparent' },
				}}
			/>

			<Stack.Screen
				name="NotFound"
				component={NotFoundScreen}
				options={{ title: 'Oops!' }}
			/>

			<Stack.Group screenOptions={{ presentation: 'modal' }}>
				<Stack.Screen name="Modal" component={ModalScreen} />
			</Stack.Group>
		</Stack.Navigator>
	)
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>()

function AuthNavigator() {
	const { isAuthenticated } = useAuth()
	return (
		<BottomTab.Navigator
			initialRouteName="Login"
			screenOptions={{ headerShown: false }}
			sceneContainerStyle={{ backgroundColor: 'transparent' }}
			tabBar={() => null}
		>
			{isAuthenticated ? (
				<BottomTab.Screen name="Home" component={Home} />
			) : (
				<>
					<BottomTab.Screen name="Login" component={Login} />
					<BottomTab.Screen name="Signup" component={Signup} />
				</>
			)}
		</BottomTab.Navigator>
	)
}

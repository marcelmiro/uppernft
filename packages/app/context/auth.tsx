import React from 'react'
import * as SecureStore from 'expo-secure-store'
import Constants from 'expo-constants'
import type Wallet from 'ethereumjs-wallet'

import { createTRPCClient } from '../utils/trpc'
import { generateWalletFromEntropy } from '../utils/wallet'

const { useState, useEffect, createContext, useContext } = React

const ERROR_MESSAGES = {
	ready: 'Authentication module has not initialized - Please try again later',
	email: 'Email is required',
	username: 'Username is required',
	password: 'Password is required',
}

interface AuthContextProps {
	isReady: boolean
	isAuthenticated: boolean
	wallet: Wallet | null
	init(): Promise<void>
	signup(email: string, username: string, password: string): Promise<void>
	login(email: string, password: string): Promise<void>
	logout(): Promise<void>
}

const defaultValue: AuthContextProps = {
	isReady: false,
	isAuthenticated: false,
	wallet: null,
	init: async () => {},
	signup: async () => {},
	login: async () => {},
	logout: async () => {},
}

function decodeSessionToken(token: string) {
	const splitIndex = token.lastIndexOf('.')
	const email = token.slice(0, splitIndex)
	const entropy = token.slice(splitIndex + 1)
	return { email, entropy }
}

const AuthContext = createContext<AuthContextProps>(defaultValue)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [sessionName, setSessionName] = useState<string>('')
	const [isReady, setIsReady] = useState<AuthContextProps['isReady']>(false)
	const [isAuthenticated, setIsAuthenticated] =
		useState<AuthContextProps['isAuthenticated']>(false)
	const [wallet, setWallet] = useState<AuthContextProps['wallet']>(null)
	const [trpcClient] = useState(createTRPCClient)

	const signup: AuthContextProps['signup'] = async function (
		email,
		username,
		password
	) {
		if (!isReady) throw new Error(ERROR_MESSAGES.ready)
		if (!email) throw new Error(ERROR_MESSAGES.email)
		if (!username) throw new Error(ERROR_MESSAGES.username)
		if (!password) throw new Error(ERROR_MESSAGES.password)

		const res = await trpcClient.mutation('auth.signup', {
			email,
			username,
			password,
		})
		const { entropy, sessionToken } = res

		await SecureStore.setItemAsync(sessionName, sessionToken)
		const wallet = (await generateWalletFromEntropy(entropy)) as Wallet
		setWallet(wallet)
		setIsAuthenticated(true)
	}

	const login: AuthContextProps['login'] = async function (email, password) {
		if (!isReady) throw new Error(ERROR_MESSAGES.ready)
		if (!email) throw new Error(ERROR_MESSAGES.email)
		if (!password) throw new Error(ERROR_MESSAGES.password)

		const res = await trpcClient.mutation('auth.login', { email, password })
		const { entropy, sessionToken } = res

		await SecureStore.setItemAsync(sessionName, sessionToken)
		const wallet = await generateWalletFromEntropy(entropy)
		setWallet(wallet)
		setIsAuthenticated(true)
	}

	const logout: AuthContextProps['logout'] = async function () {
		if (!isReady) throw new Error(ERROR_MESSAGES.ready)
		await SecureStore.deleteItemAsync(sessionName)
		setIsAuthenticated(false)
		setWallet(null)
	}

	async function checkWalletStatus() {
		try {
			let _sessionName: string | undefined = sessionName

			if (!_sessionName) {
				_sessionName = Constants.manifest?.extra?.SID_NAME as
					| string
					| undefined
				if (!_sessionName)
					throw new Error('Session name variable not found')
				setSessionName(_sessionName)
			}

			const sessionToken = await SecureStore.getItemAsync(_sessionName)
			if (!sessionToken) return

			const { entropy } = decodeSessionToken(sessionToken)
			const wallet = await generateWalletFromEntropy(entropy)

			setWallet(wallet)
			setIsAuthenticated(true)
		} catch (e) {
			setIsAuthenticated(false)
			setWallet(null)
		} finally {
			setIsReady(true)
		}
	}

	useEffect(() => {
		checkWalletStatus()
	}, [])

	const value = {
		isReady,
		isAuthenticated,
		wallet,
		init: checkWalletStatus,
		signup,
		login,
		logout,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

import { useState, useEffect, createContext, useContext } from 'react'
import type Wallet from 'ethereumjs-wallet'

import { useTRPCClient } from '@web/utils/trpc'
import { generateWalletFromEntropy } from '@web/lib/auth-client'

const SESSION_NAME = 'uppernft.sid'

interface AuthContextProps {
	isReady: boolean
	isAuthenticated: boolean
	wallet: Wallet | null
	signup(email: string, username: string, password: string): Promise<void>
	login(email: string, password: string): Promise<void>
	logout(): Promise<void>
}

const defaultValue: AuthContextProps = {
	isReady: false,
	isAuthenticated: false,
	wallet: null,
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
	const [isReady, setIsReady] = useState<AuthContextProps['isReady']>(false)
	const [isAuthenticated, setIsAuthenticated] =
		useState<AuthContextProps['isAuthenticated']>(false)
	const [wallet, setWallet] = useState<AuthContextProps['wallet']>(null)

	const trpcClient = useTRPCClient()

	const signup: AuthContextProps['signup'] = async function (
		email,
		username,
		password
	) {
		if (!email) throw new Error('Email is required')
		if (!username) throw new Error('Username is required')
		if (!password) throw new Error('Password is required')

		const res = await trpcClient.mutation('auth.signup', {
			email,
			username,
			password,
		})

		const { entropy, sessionToken } = res
		localStorage.setItem(SESSION_NAME, sessionToken)

		const wallet = await generateWalletFromEntropy(entropy)
		setWallet(wallet)
		setIsAuthenticated(true)
	}

	const login: AuthContextProps['login'] = async function (email, password) {
		if (!email) throw new Error('Email is required')
		if (!password) throw new Error('Password is required')

		const res = await trpcClient.mutation('auth.login', { email, password })

		const { entropy, sessionToken } = res
		localStorage.setItem(SESSION_NAME, sessionToken)

		const wallet = await generateWalletFromEntropy(entropy)
		setWallet(wallet)
		setIsAuthenticated(true)
	}

	const logout: AuthContextProps['logout'] = async function () {
		localStorage.removeItem(SESSION_NAME)
		setIsAuthenticated(false)
		setWallet(null)
	}

	async function checkWalletStatus() {
		try {
			const sessionToken = localStorage.getItem(SESSION_NAME)
			if (!sessionToken) return

			const { entropy } = decodeSessionToken(sessionToken)
			const wallet = await generateWalletFromEntropy(entropy)

			setWallet(wallet)
			setIsAuthenticated(true)
		} catch (e) {
			setIsAuthenticated(false)
			setWallet(null)
		}
	}

	useEffect(() => {
		checkWalletStatus().finally(() => setIsReady(true))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const value = { isReady, isAuthenticated, wallet, signup, login, logout }

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

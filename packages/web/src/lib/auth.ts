import {
	WalletManager,
	Authentication,
	getPlatformCreateKey,
} from '@audius/hedgehog/dist/index'
import { hash, compare } from 'bcrypt'
import type { Context } from '../server/router/context'

interface CreateWalletObjOptions {
	password: string
	entropy?: string
}

interface SignupOptions {
	ctx: Context
	email: string
	username: string
	password: string
}

interface LoginOptions {
	ctx: Context
	email: string
	password: string
}

interface ValidateSessionOptions {
	ctx: Context
	sessionToken: string
}

const PATH = "m/44'/60'/0'/0/0"

const createKey = getPlatformCreateKey()

async function createWalletObj({ password, entropy }: CreateWalletObjOptions) {
	const { ivBuffer, ivHex } = Authentication.createIV()
	const { keyBuffer } = await createKey(password, ivHex)

	if (!entropy) entropy = Authentication.generateMnemonicAndEntropy().entropy

	const wallet = await Authentication.generateWalletFromEntropy(entropy, PATH)
	const { cipherTextHex } = Authentication.encrypt(
		entropy,
		ivBuffer,
		keyBuffer
	)

	return { ivHex, cipherTextHex, wallet, entropy }
}

export async function signup({
	ctx,
	email,
	username,
	password,
}: SignupOptions) {
	const promises = [
		createWalletObj({ password }),
		WalletManager.createAuthLookupKey(email, password, createKey),
	] as const

	const [walletResult, lookupKey] = await Promise.all(promises)

	const {
		ivHex: iv,
		cipherTextHex: cipherText,
		entropy,
		wallet,
	} = walletResult

	const walletAddress = wallet.getAddressString()
	const sessionId = await hash(entropy, 10)
	const sessionToken = `${email}.${entropy}`

	await ctx.prisma.$transaction([
		ctx.prisma.user.create({
			data: { email, username, walletAddress, sessionId },
		}),
		ctx.prisma.userAuth.create({
			data: { iv, cipherText, lookupKey },
		}),
	])

	const user = { email, username }

	return { entropy, sessionToken, user }
}

export async function login({ ctx, email, password }: LoginOptions) {
	const lookupKey = await WalletManager.createAuthLookupKey(
		email,
		password,
		createKey
	)

	const promises = [
		ctx.prisma.userAuth.findFirst({ where: { lookupKey } }),
		ctx.prisma.user.findFirst({ where: { email } }),
	] as const

	const [auth, user] = await Promise.all(promises)
	if (!auth || !user) return null

	const { entropy } = await WalletManager.decryptCipherTextAndRetrieveWallet(
		password,
		auth.iv,
		auth.cipherText,
		createKey
	)

	const sessionToken = `${email}.${entropy}`
	const userRes = { email, username: user.username }

	return { entropy, sessionToken, user: userRes }
}

export async function validateSession({
	ctx,
	sessionToken,
}: ValidateSessionOptions) {
	const splitIndex = sessionToken.lastIndexOf('.')
	const email = sessionToken.slice(0, splitIndex)
	const entropy = sessionToken.slice(splitIndex + 1)

	const user = await ctx.prisma.user.findFirst({ where: { email } })
	if (!user) return null

	const isValid = await compare(entropy, user.sessionId)
	return isValid ? { ...user, entropy } : null
}

export function generateWalletFromEntropy(entropy: string) {
	return Authentication.generateWalletFromEntropy(entropy, PATH)
}

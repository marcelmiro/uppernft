import { Authentication } from '@audius/hedgehog/dist/index'

const PATH = "m/44'/60'/0'/0/0"

export function generateWalletFromEntropy(entropy: string) {
	return Authentication.generateWalletFromEntropy(entropy, PATH)
}

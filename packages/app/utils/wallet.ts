import { entropyToMnemonic, mnemonicToSeed } from 'bip39'
import { hdkey } from 'ethereumjs-wallet'
import { Buffer } from 'buffer'

global.Buffer = global.Buffer || Buffer

const PATH = "m/44'/60'/0'/0/0"

export async function generateWalletFromEntropy(entropy: string) {
	const seed = await mnemonicToSeed(entropyToMnemonic(entropy))
	const hdwallet = hdkey.fromMasterSeed(seed)
	const wallet = hdwallet.derivePath(PATH).getWallet()
	return wallet
}

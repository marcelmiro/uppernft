import {
	DefenderRelaySigner,
	DefenderRelayProvider,
} from 'defender-relay-client/lib/ethers'
import { ethers } from 'ethers'

import { env } from '@web/env/server.mjs'

const {
	TOKEN_ADDRESS: address,
	RELAYER_API_KEY: apiKey,
	RELAYER_SECRET_KEY: apiSecret,
	BLOCKCHAIN_EXPLORER_TX_BASE: txBaseUrl,
} = env

const credentials = { apiKey, apiSecret }

const abi = [
	{
		inputs: [
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				components: [
					{
						internalType: 'string',
						name: 'name',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'serialNumber',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'imageURI',
						type: 'string',
					},
				],
				internalType: 'struct BikeNft.Bike',
				name: 'bike',
				type: 'tuple',
			},
		],
		name: 'safeMint',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'deadline',
				type: 'uint256',
			},
			{
				internalType: 'bytes',
				name: 'signature',
				type: 'bytes',
			},
		],
		name: 'safeTransferFromWithPermit',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]

const provider = new DefenderRelayProvider(credentials)
const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' })
const Contract = new ethers.Contract(address, abi, signer)

interface MintProps {
	to: string
	name: string
	serialNumber: string
	imageUri: string
}

export async function mintToken({
	to,
	name,
	serialNumber,
	imageUri,
}: MintProps): Promise<{ hash: string; txUrl: string }> {
	const tx = await Contract.safeMint(to, [name, serialNumber, imageUri])
	const hash = tx.hash as string
	return { hash, txUrl: txBaseUrl + hash }
}

export async function transferToken() {}

export async function burnToken() {}

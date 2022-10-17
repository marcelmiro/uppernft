import { NextApiRequest, NextApiResponse } from 'next'
import { constants as ethersConstants } from 'ethers'

import { prisma } from '@web/server/db/client'

interface DataResponse {
	success: true
}

interface ErrorResponse {
	message: string
}

interface NftTransfer {
	from: string
	to: string
	tokenId: string
	transactionHash: string
}

interface Body {
	confirmed: boolean
	chainId: string
	streamId: string
	nftTransfers: NftTransfer[]
	retries: number
	block: { number: string; hash: string; timestamp: string }
	logs: Array<Record<string, unknown>>
}

async function processNftTransfer({
	from,
	to,
	tokenId: tokenIdString,
	transactionHash: hash,
}: NftTransfer) {
	const tokenId = Number(tokenIdString)
	if (!tokenId) return

	// Mint
	if (from === ethersConstants.AddressZero) {
		const tx = await prisma.unconfirmedTransaction.findFirst({
			where: { hash },
		})

		if (!tx) return

		await prisma.$transaction([
			prisma.item.update({
				where: { id: tx.itemId },
				data: { tokenId },
			}),
			prisma.unconfirmedTransaction.deleteMany({ where: { hash } }),
		])
	}

	// Burn
	else if (to === ethersConstants.AddressZero) {
		await prisma.item.deleteMany({
			where: { AND: { tokenId, ownerAddress: from } },
		})
	}

	// Transfer
	else {
		await prisma.item.updateMany({
			where: { tokenId, ownerAddress: from },
			data: { ownerAddress: to },
		})
	}
}

export default async function tx(
	req: NextApiRequest,
	res: NextApiResponse<DataResponse | ErrorResponse>
) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST'])
		res.status(405).end(`Method ${req.method} not allowed`)
		return
	}

	let reqBody: Body | undefined
	try {
		reqBody = JSON.parse(req.body)
	} catch (e) {}

	// FUTURE: Change accepted streams to `confirmed` === true
	// FUTURE: Validate request by `streamId`
	if (!reqBody) return res.status(400).send({ message: 'Bad request' })

	for (const transfer of reqBody.nftTransfers) processNftTransfer(transfer)

	return res.status(201).send({ success: true })
}

import { NextApiRequest, NextApiResponse } from 'next'
import { Activity } from '@prisma/client'

import { prisma } from '@web/server/db/client'

export interface DataResponse {
	serialNumber: string
	name: string
	code: string
	imageUri: string
	stolen: boolean
	owner: string
	components: Record<string, string | null>
	activity: Pick<Activity, 'type' | 'externalLink' | 'createdAt'>[]
}

interface ErrorResponse {
	message: string
}

export default async function item(
	req: NextApiRequest,
	res: NextApiResponse<DataResponse | ErrorResponse>
) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', ['GET'])
		res.status(405).end(`Method ${req.method} not allowed`)
		return
	}

	const serialNumber = req.query.sn

	if (!serialNumber || typeof serialNumber !== 'string')
		return res.status(400).send({ message: 'Serial number is required' })

	const item = await prisma.item.findUnique({
		where: { serialNumber },
		include: {
			model: true,
			owner: true,
			components: true,
			activities: true,
		},
	})

	if (!item) return res.status(404).send({ message: 'Bike not found' })

	const {
		id: _id,
		createdAt: _createdAt,
		updatedAt: _updatedAt,
		...components
	} = item.components

	const formattedActivity: DataResponse['activity'] = item.activities.map(
		({ type, externalLink, createdAt }) => ({
			type,
			externalLink,
			createdAt,
		})
	)

	const dataRes: DataResponse = {
		serialNumber,
		name: item.model.name,
		code: item.model.code,
		imageUri: item.model.imageUri,
		stolen: item.isStolen,
		owner: item.owner?.username || item.ownerAddress,
		components,
		activity: formattedActivity,
	}

	return res.status(200).send(dataRes)
}

import * as React from 'react'
import { SvgProps } from 'react-native-svg'

import ImageCertificate from '@app/images/certificate.svg'
import ImageVault from '@app/images/vault.svg'
import ImageAr from '@app/images/ar.svg'

type Onboarding = Array<{
	title: string
	description: string
	image: React.FC<SvgProps>
}>

export const onboarding: Onboarding = [
	{
		title: 'Generate an NFT for each physical bike',
		description:
			"Bike NFTs are tradable digital assets recorded in the blockchain. Each NFT represents a unique bike in the real world, which allows users to verify a bike's authenticity by requesting its history in the blockchain.",
		image: ImageCertificate,
	},

	{
		title: "Report your bike's theft to the world",
		description:
			"Anyone that searches or scans a stolen bike will be notified about its status and urged to inform the bike's owner of its last known details if known. Due to this, we reduce illegal aftermarket transactions and increase the chance for owners to retrieve their stolen bikes.",
		image: ImageVault,
	},

	{
		title: 'Immense opportunities',
		description:
			'Embrace the many opportunities that NFTs provide. Bike races in the metaverse, exclusive virtual events, and much more!',
		image: ImageAr,
	},
]

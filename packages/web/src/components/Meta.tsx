import Head from 'next/head'

import { env } from '@web/env/client.mjs'

export interface MetaProps extends React.PropsWithChildren {
	title?: string
	desc?: string
	hideIndex?: boolean
}

const TITLE = 'upperNFT'
const CANONICAL = env.NEXT_PUBLIC_BASE_URL
const IMAGE = 'https://i.imgur.com/ahBxg7i.png'

export default function Meta({
	title = '',
	desc,
	children,
	hideIndex = false,
}: MetaProps) {
	if (title.length > 50) title = `${title.slice(0, 50)}...`
	title += title ? ` | ${TITLE}` : TITLE
	desc = desc?.slice(0, 160)

	return (
		<Head>
			{/* Main meta */}
			<title>{title}</title>
			{desc && <meta name="description" content={desc} />}
			<link rel="canonical" href={CANONICAL} />
			{hideIndex && <meta name="robots" content="noindex nofollow" />}
			{children}

			{/* OpenGraph meta */}
			<meta property="og:type" content="website" />
			<meta name="og:title" property="og:title" content={title} />
			{desc && <meta property="og:description" content={desc} />}
			<meta property="og:site_name" content="upperNFT" />
			<meta property="og:url" content={CANONICAL} />
			<meta property="og:image" content={IMAGE} />
			<meta property="og:image:alt" content={TITLE} />

			{/* Twitter meta */}
			<meta name="twitter:card" content="summary" />
			<meta name="twitter:site" content="@upperNFT" />
			<meta name="twitter:creator" content="@upperNFT" />
			<meta name="twitter:title" content={title} />
			{desc && <meta name="twitter:description" content={desc} />}
			<meta name="twitter:image" content={IMAGE} />
			<meta name="twitter:image:alt" content={TITLE} />
			{/* <meta name="twitter:app:name:iphone" content="" />
			<meta name="twitter:app:url:iphone" content="" />
			<meta name="twitter:app:name:googleplay" content="" />
			<meta name="twitter:app:url:googleplay" content="" /> */}

			{/* Favicon */}
			<link
				rel="apple-touch-icon"
				sizes="180x180"
				href="/favicon/apple-touch-icon.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="32x32"
				href="/favicon/favicon-32x32.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="16x16"
				href="/favicon/favicon-16x16.png"
			/>
			<link rel="manifest" href="/favicon/site.webmanifest" />
			<link
				rel="mask-icon"
				href="/favicon/safari-pinned-tab.svg"
				color="#5bbad5"
			/>
			<link rel="shortcut icon" href="/favicon/favicon.ico" />
			<meta name="msapplication-TileColor" content="#da532c" />
			<meta
				name="msapplication-config"
				content="/favicon/browserconfig.xml"
			/>
			<meta name="theme-color" content="#f7f7f7" />
		</Head>
	)
}

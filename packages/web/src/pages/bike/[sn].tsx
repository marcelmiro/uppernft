import {
	useState,
	useRef,
	useMemo,
	PropsWithChildren,
	useCallback,
} from 'react'
import {
	GetServerSideProps as _GetServerSideProps,
	InferGetServerSidePropsType,
} from 'next'
import Link from 'next/link'
import useMeasure from 'react-use-measure'
import { QRCodeSVG } from 'qrcode.react'

import { trpc, inferQueryOutput } from '@web/utils/trpc'
import { getBaseUrl } from '@web/utils/url'
import { useAppRedirect } from '@web/utils/device'
import Meta, { MetaProps } from '@web/components/Meta'
import SkeletonImage from '@web/components/SkeletonImage'
import LoadingSpinner from '@web/components/LoadingSpinner'
import Modal, { ModalRefProps } from '@web/components/Modal'
import Logo from '@web/public/logo.png'
import IconPlus from '@web/public/plus.svg'
import IconArrowBidirectional from '@web/public/arrow-bidirectional.svg'
import IconWrench from '@web/public/wrench.svg'
import IconWrite from '@web/public/write.svg'
import IconLink from '@web/public/link.svg'
import IconAndroidAppStore from '@web/public/app-store-android.svg'
import IconIosAppStore from '@web/public/app-store-ios.svg'
import styles from '@web/styles/Bike.module.scss'
import type { DataResponse } from '@web/pages/api/item'

type GetServerSideProps = _GetServerSideProps<
	| (DataResponse & { notFound?: false })
	| { notFound: true; serialNumber: string },
	{ sn: string }
>

type BikeProps = InferGetServerSidePropsType<typeof getServerSideProps>

interface LayoutProps extends PropsWithChildren {
	meta?: MetaProps
}

interface SectionProps {
	title: string
	data: JSX.Element[]
	emptyView?: JSX.Element
}

interface ComponentProps {
	title: string
	value: string
}

type Transaction = DataResponse['activity'][number]

type RegisterProps = inferQueryOutput<'item.registrable'>

const txTypeToText: Record<Transaction['type'], string> = {
	MINT: 'Registration',
	TRANSFER: 'Transfer',
	REPAIR: 'Repair',
	COMPONENT_CHANGE: 'Component change',
}

const txTypeToIcon: Record<Transaction['type'], any> = {
	MINT: IconPlus,
	TRANSFER: IconArrowBidirectional,
	REPAIR: IconWrench,
	COMPONENT_CHANGE: IconWrite,
}

function propToLabel(text: string) {
	text = text.replace(/([A-Z])/g, ' $1')
	return text[0]?.toUpperCase() + text.slice(1).toLowerCase()
}

function getComponents(data: DataResponse) {
	const items: ComponentProps[] = [
		{
			title: 'Serial number',
			value: data.serialNumber.toUpperCase(),
		},
		{
			title: 'Model code',
			value: data.code,
		},
	]

	for (const [key, value] of Object.entries(data.components)) {
		if (!value) continue
		items.push({ title: propToLabel(key), value })
	}

	return items
}

function Header() {
	return (
		<div className={styles.headerContainer}>
			<SkeletonImage
				src={Logo}
				className={styles.logoImage}
				alt="upperNFT logo"
			/>
			<p className={styles.logoName}>upperNFT</p>
		</div>
	)
}

function Footer() {
	const currentYear = new Date().getFullYear()

	return (
		<div className={styles.footerContainer}>
			<p className={styles.footerText}>© {currentYear} StarKeys LLC</p>
			<p className={styles.footerText}>All rights reserved.</p>
		</div>
	)
}

function Layout({ children, meta }: LayoutProps) {
	return (
		<div className={styles.wrapper}>
			<Meta {...meta} />
			<div className={styles.container}>
				<div>
					<Header />
					{children}
				</div>
				<Footer />
			</div>
		</div>
	)
}

function Section({ title, data, emptyView }: SectionProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [collapseRef, { height: collapseHeight }] = useMeasure()

	if (data.length === 0 && !emptyView) return null

	function toggleOpen() {
		setIsOpen((prev) => !prev)
	}

	return (
		<div className={styles.sectionContainer}>
			<div className={styles.sectionHeader}>
				<h2 className={styles.sectionTitle}>{title}</h2>
				{data.length > 0 && (
					<button
						onClick={toggleOpen}
						className={styles.sectionToggleButton}
					>
						{isOpen ? 'Hide' : 'See all'}
					</button>
				)}
			</div>

			{data.length > 0 ? (
				<div className={styles.sectionContent}>
					<div className={styles.sectionContent}>
						{data.slice(0, 3)}
					</div>
					<div
						className={styles.sectionCollapse}
						style={{ maxHeight: isOpen ? collapseHeight : 0 }}
					>
						<div
							ref={collapseRef}
							className={styles.sectionContent}
						>
							{data.slice(3)}
						</div>
					</div>
				</div>
			) : (
				emptyView
			)}
		</div>
	)
}

function Component({ title, value }: ComponentProps) {
	return (
		<div className={styles.componentContainer}>
			<p className={styles.componentTitle}>{title}</p>
			<p className={styles.componentValue}>{value}</p>
		</div>
	)
}

function Transaction({
	type,
	externalLink,
	createdAt,
}: DataResponse['activity'][number]) {
	createdAt = new Date(createdAt)

	const date = `${
		createdAt
			.toLocaleDateString('en-US', {
				weekday: 'short',
			})
			.split(',')[0]
	}, ${createdAt.toLocaleDateString('en-US', {
		month: 'short',
	})} ${createdAt.getDate()}`

	const Icon = txTypeToIcon[type]

	return (
		<div className={styles.txContainer}>
			<div className={styles.txIconContainer}>
				<Icon />
			</div>
			<div>
				<p className={styles.txTitle}>{txTypeToText[type]}</p>
				<p className={styles.txSubtitle}>{date}</p>
			</div>
			{externalLink && (
				<a
					href={externalLink}
					target="_blank"
					rel="noopener noreferrer"
					className={styles.txLinkIcon}
				>
					<IconLink />
				</a>
			)}
		</div>
	)
}

function LoadingView() {
	return (
		<Layout>
			<LoadingSpinner containerClassName={styles.loadingSpinner} />
		</Layout>
	)
}

function StolenModal() {
	const modalRef = useRef<ModalRefProps>(null)

	return (
		<Modal
			ref={modalRef}
			initialShow={true}
			containerClassName={styles.modalContainer}
		>
			<p className={styles.modalTitle}>This bike has been stolen</p>
			<p className={styles.modalSubtitle}>
				The owner of this bike has reported the bike&apos;s theft.
				Therefore, we encourage anyone who might know any information
				about it to inform us as soon as possible. The following button
				redirects you to a form used to communicate information about
				the bike to its owner, with the hope of the bike&apos;s
				retrieval.
			</p>
			<button className={styles.modalButton}>Inform owner</button>
			<button
				onClick={() => modalRef.current?.requestClose()}
				className={styles.modalTextButton}
			>
				Ignore
			</button>
		</Modal>
	)
}

function Register({ serialNumber, name, imageUri }: RegisterProps) {
	const modalRef = useRef<ModalRefProps>(null)

	const { redirect, appStoreUrls } = useAppRedirect({
		path: 'bike/register/' + serialNumber,
	})

	async function handleRedirect() {
		const res = await redirect()
		if (res === false) modalRef.current?.requestOpen()
	}

	return (
		<Layout>
			<Modal
				ref={modalRef}
				containerClassName={styles.registerModalContainer}
			>
				<p className={styles.registerModalText}>
					Scan this QR code to install the app
				</p>

				<QRCodeSVG
					value={appStoreUrls.fallback}
					className={styles.registerModalQR}
				/>

				<p className={styles.registerModalText}>
					Or manually download the app by clicking on the
					corresponding app store below
				</p>

				<div className={styles.registerModalLinks}>
					<Link href={appStoreUrls.android}>
						<a
							target="_blank"
							rel="noopener noreferrer"
							className={styles.registerModalLink}
						>
							<IconAndroidAppStore />
						</a>
					</Link>
					<Link href={appStoreUrls.ios}>
						<a
							target="_blank"
							rel="noopener noreferrer"
							className={styles.registerModalLink}
						>
							<IconIosAppStore />
						</a>
					</Link>
				</div>

				<button
					onClick={() => modalRef.current?.requestClose()}
					className={styles.modalTextButton}
				>
					Close
				</button>
			</Modal>

			<main className={styles.main}>
				<SkeletonImage
					src={imageUri}
					className={styles.mainImage}
					alt={name}
					priority
				/>
				<h1 className={styles.mainTitle}>{name}</h1>
			</main>

			<div className={styles.inlineModalContainer}>
				<p className={styles.modalText}>
					This bike has not been registered yet. Please click the
					button below to download the app (if not installed already)
					and register the bike.
				</p>

				<button onClick={handleRedirect} className={styles.modalButton}>
					Register bike
				</button>
			</div>
		</Layout>
	)
}

export default function Bike(props: BikeProps) {
	const { data, isLoading } = trpc.useQuery(
		['item.registrable', { serialNumber: props.serialNumber }],
		{
			enabled: Boolean(props.notFound),
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
		}
	)

	const serialNumber = props.serialNumber.toUpperCase()

	if (props.notFound) {
		if (isLoading) return <LoadingView />

		if (data) return <Register {...data} serialNumber={serialNumber} />

		return (
			<Layout>
				<p className={styles.emptyText}>
					Sorry, we could not find the bike you want.
				</p>
				<Link href="/">
					<a target="_self" className={styles.button}>
						Go home
					</a>
				</Link>
			</Layout>
		)
	}

	const { name, owner, imageUri, stolen } = props

	const components = getComponents(props).map((props, i) => (
		<Component {...props} key={i} />
	))

	const activity = props.activity
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() -
				new Date(a.createdAt).getTime()
		)
		.map((props, i) => <Transaction {...props} key={i} />)

	return (
		<Layout meta={{ title: `${name} (${serialNumber})` }}>
			{stolen && <StolenModal />}

			<main className={styles.main}>
				<SkeletonImage
					src={imageUri}
					className={styles.mainImage}
					alt={name}
				/>
				<div>
					<h1 className={styles.mainTitle}>{name}</h1>
					<p className={styles.mainSubtitle}>
						Owned by <em>@{owner}</em>
					</p>
				</div>
			</main>

			<div className={styles.sections}>
				<Section title="Overview" data={components} />

				<Section
					title="Activity"
					data={activity}
					emptyView={
						<p className={styles.emptySectionText}>
							This bike has no activity yet.
						</p>
					}
				/>
			</div>
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	context.res.setHeader(
		'Cache-Control',
		'public, s-maxage=10, stale-while-revalidate=60'
	)

	const sn = context.params?.sn
	const url = `${getBaseUrl()}/api/item?sn=${sn}`

	const res = await fetch(url)
	const data = await res.json()

	if (!res.ok) {
		if (res.status === 404)
			return { props: { notFound: true, serialNumber: sn } }
		throw new Error(data.message)
	}

	return { props: data }
}

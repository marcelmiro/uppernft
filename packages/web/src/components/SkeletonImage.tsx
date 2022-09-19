import { useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import classNames from 'classnames'

import styles from '@web/styles/Skeleton.module.scss'

type ObjectFit = 'contain' | 'cover'

interface SkeletonImageProps {
	src: string | StaticImageData
	alt: string
	objectFit?: ObjectFit
	className?: string
	priority?: boolean
	blur?: boolean
}

export default function SkeletonImage({
	src,
	alt,
	objectFit = 'cover',
	className,
	priority = false,
	blur = false,
}: SkeletonImageProps) {
	const [isLoaded, setIsLoaded] = useState(false)
	const [notFound, setNotFound] = useState(false)

	if (blur && typeof src === 'string') blur = false

	return (
		<div className={classNames(className, styles.container)}>
			{(!isLoaded || notFound) && (
				<div
					className={classNames(styles.placeholder, {
						[styles.noAnimation as string]: notFound,
					})}
				/>
			)}

			{!notFound && !!src && (
				<Image
					src={src}
					alt={alt}
					layout="fill"
					objectFit={objectFit}
					onLoadingComplete={() => setIsLoaded(true)}
					onError={() => setNotFound(true)}
					priority={priority}
					{...(blur ? { placeholder: 'blur' } : {})}
				/>
			)}
		</div>
	)
}

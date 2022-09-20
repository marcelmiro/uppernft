import SkeletonImage from '@web/components/SkeletonImage'
import Logo from '@web/public/logo.png'
import styles from '@web/styles/Header.module.scss'

export default function Header() {
	return (
		<div className={styles.container}>
			<SkeletonImage
				src={Logo}
				className={styles.logoImage}
				alt="upperNFT logo"
			/>
			<p className={styles.logoName}>upperNFT</p>
		</div>
	)
}

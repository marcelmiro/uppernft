import { useState, useRef } from 'react'
import Link from 'next/link'
import classNames from 'classnames'

import SkeletonImage from '@web/components/SkeletonImage'
import Logo from '@web/public/logo.png'
import IconSearch from '@web/public/search.svg'
import IconArrowRight from '@web/public/arrow-right.svg'
import styles from '@web/styles/Header.module.scss'

export default function Header() {
	const [searchValue, setSearchValue] = useState('')
	const [searchErrorAnimation, setSearchErrorAnimation] = useState(false)

	const searchRef = useRef<HTMLInputElement>(null)
	const searchSubmitRef = useRef<HTMLAnchorElement>(null)

	const isSearchValueValid = searchValue.length > 5 && searchValue.length < 25

	function focusSearch() {
		searchRef.current?.focus()
	}

	function onSearchValueChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value.replace(/[^\w\d]/g, '').toUpperCase()
		setSearchValue(value)
	}

	function submitSearch() {
		isSearchValueValid && searchSubmitRef.current?.click()
	}

	return (
		<div className={styles.container}>
			<div className={styles.company}>
				<SkeletonImage
					src={Logo}
					className={styles.companyLogo}
					alt="upperNFT logo"
				/>
				<p className={styles.companyName}>upperNFT</p>
			</div>

			<div
				onClick={focusSearch}
				className={classNames(styles.searchContainer, {
					[styles.error as string]: searchErrorAnimation,
				})}
				onAnimationEnd={() => setSearchErrorAnimation(false)}
			>
				<div className={styles.searchIcon}>
					<IconSearch />
				</div>

				<label className={styles.searchLabel}>
					<input
						ref={searchRef}
						value={searchValue}
						onChange={onSearchValueChange}
						type="text"
						className={styles.searchInput}
						placeholder="Serial number"
						onKeyPress={(e) =>
							e.key === 'Enter' &&
							(isSearchValueValid
								? submitSearch()
								: setSearchErrorAnimation(true))
						}
					/>
				</label>

				<div
					onClick={() =>
						!isSearchValueValid && setSearchErrorAnimation(true)
					}
					className={classNames(styles.searchSubmitContainer, {
						[styles.disabled as string]: !isSearchValueValid,
					})}
				>
					<Link href={`/bike/${searchValue}`} target="_self">
						<a
							ref={searchSubmitRef}
							className={styles.searchSubmitIcon}
						>
							<IconArrowRight />
						</a>
					</Link>
				</div>
			</div>
		</div>
	)
}

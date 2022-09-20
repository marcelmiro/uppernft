import Meta from '@web/components/Meta'
import Header from '@web/components/Header'
import styles from '@web/styles/Home.module.scss'

export default function Home() {
	return (
		<div className={styles.wrapper}>
			<Meta />
			<div className={styles.container}>
				<div>
					<Header />

					<h1>Home page</h1>
				</div>
				{/* <Footer /> */}
			</div>
		</div>
	)
}

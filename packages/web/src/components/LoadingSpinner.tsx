import classNames from 'classnames'

import styles from '@web/styles/LoadingSpinner.module.scss'

interface LoadingSpinnerProps {
	className?: string
	pathClassName?: string
	containerClassName?: string
}

export default function LoadingSpinner({
	className,
	pathClassName,
	containerClassName,
}: LoadingSpinnerProps) {
	return (
		<div className={classNames(containerClassName, styles.container)}>
			<svg
				className={classNames(className, styles.svg)}
				viewBox="25 25 50 50"
			>
				<circle
					className={classNames(pathClassName, styles.path)}
					cx={50}
					cy={50}
					r="20"
					fill="none"
				/>
			</svg>
		</div>
	)
}

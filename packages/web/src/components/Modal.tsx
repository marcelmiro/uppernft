import {
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle,
	PropsWithChildren,
	ForwardRefRenderFunction,
	CSSProperties,
} from 'react'
import classNames from 'classnames'

import styles from '@web/styles/Modal.module.scss'

interface ModalProps extends PropsWithChildren {
	initialShow?: boolean
	onClose?(): void
	containerClassName?: string
}

export interface ModalRefProps {
	requestOpen(): void
	requestClose(): void
}

const ANIMATION_DURATION_IN_MS = 250
const transitionStyle: CSSProperties = {
	transitionDuration: `${ANIMATION_DURATION_IN_MS}ms`,
}

function sleep(timeInMs: number) {
	return new Promise((resolve) => setTimeout(resolve, timeInMs))
}

const Modal: ForwardRefRenderFunction<ModalRefProps, ModalProps> = (
	{ initialShow = false, onClose, containerClassName, children },
	ref
) => {
	const [show, setShow] = useState(initialShow)
	const [opening, setOpening] = useState(false)
	const [closing, setClosing] = useState(false)
	useImperativeHandle(ref, () => ({ requestOpen, requestClose }))

	/**
	 * Hack: Set show on following re-render after setting opening in requestOpen()
	 * so that CSS can activate modal's opening transition.
	 * Alternative: add {await sleep(0); setShow(true);} after setting opening to force an extra re-render
	 */
	useEffect(() => {
		if (opening) setShow(true)
	}, [opening])

	if (!show && !opening && !closing) return null

	async function requestOpen() {
		try {
			if (show || opening) return
			setOpening(true)
			await sleep(ANIMATION_DURATION_IN_MS)
		} catch (e) {}
		setOpening(false)
	}

	async function requestClose() {
		try {
			if (!show || closing) return
			setClosing(true)
			await sleep(ANIMATION_DURATION_IN_MS)
			setShow(false)
			onClose?.()
		} catch (e) {}
		setClosing(false)
	}

	return (
		<div
			className={classNames(styles.wrapper, {
				[styles.hidden as string]: !show || closing,
			})}
			style={transitionStyle}
		>
			<div className={styles.overlay} onClick={requestClose} />

			<div
				className={classNames(containerClassName, styles.container)}
				style={transitionStyle}
			>
				<div className={styles.content}>{children}</div>
			</div>
		</div>
	)
}

export default forwardRef(Modal)

import { useEffect, useRef } from 'react'
import Router from 'next/router'
import { UAParser } from 'ua-parser-js'

import { env } from '@web/env/client.mjs'

interface UseAppRedirectOptions {
	path?: string
	query?: Record<string, string>
}

const BASE_URL = env.NEXT_PUBLIC_BASE_URL

export function getDevice() {
	const parser = new UAParser()
	const {
		browser: { name: browser },
		device: { vendor: deviceVendor, type: deviceType, model: device },
		engine: { name: engine },
		os: { name: os },
		cpu: { architecture: cpu },
	} = parser.getResult()

	const res = {
		browser: browser?.toLowerCase(),
		device: device?.toLowerCase(),
		deviceType: deviceType?.toLowerCase(),
		deviceVendor: deviceVendor?.toLowerCase(),
		engine: engine?.toLowerCase(),
		os: os?.toLowerCase(),
		cpu: cpu?.toLowerCase(),
	}

	if (res.os === 'mac os' && window.orientation !== undefined) res.os = 'ios'

	return res
}

const redirectOptions = {
	scheme: 'unft',

	// FUTURE: Change to uppernft data
	androidPackage: 'com.twitter.android',
	iosAppStoreUrl: 'https://apps.apple.com/us/app/twitter/id333903271',

	fallbackUrl: `${BASE_URL}/app/install`,
}

function getAndroidAppStoreUrl(query?: string) {
	return `https://play.google.com/store/apps/details?id=${redirectOptions.androidPackage}&${query}`
}

export function useAppRedirect({ path = '', query }: UseAppRedirectOptions) {
	// Use ref instead of state to avoid stale data when accessing state inside event listeners
	const windowFocus = useRef(true)

	function setWindowFocus(value: boolean) {
		windowFocus.current = value
	}

	const queryParams = new URLSearchParams(query)
	let iosAppStoreUrl = redirectOptions.iosAppStoreUrl

	if (query) {
		path += '?' + queryParams.toString()
		iosAppStoreUrl += '?' + queryParams.toString()
	}

	const appStoreUrls = {
		ios: iosAppStoreUrl,
		android: getAndroidAppStoreUrl(queryParams.toString()),
		fallback: redirectOptions.fallbackUrl,
	}

	function onWindowBlur() {
		setWindowFocus(false)
	}

	function onWindowVisibilityChange() {
		setWindowFocus(window.document.visibilityState !== 'hidden')
	}

	useEffect(() => {
		window.addEventListener('blur', onWindowBlur)
		document.addEventListener('visibilitychange', onWindowVisibilityChange)

		return function () {
			window.removeEventListener('blur', onWindowBlur)
			document.removeEventListener(
				'visibilitychange',
				onWindowVisibilityChange
			)
		}
	}, [])

	async function tryOpenUrls(urls: string[]): Promise<boolean> {
		if (urls.length === 0) return false

		async function open(index: number) {
			const url = urls[index]
			if (!url) return false

			const redirectTime = new Date().getTime()
			Router.push(url)

			await new Promise((resolve) => setTimeout(resolve, 100))

			if (!windowFocus.current) return true

			if (new Date().getTime() - redirectTime > 3000) return false

			open(index + 1)
		}

		await open(0)

		return false
	}

	async function redirect(): Promise<boolean> {
		const { os, browser } = getDevice()

		if (os === 'ios') {
			const iosAppUrl = `${redirectOptions.scheme}://${path}`
			const res = await tryOpenUrls([iosAppUrl, iosAppStoreUrl])
			return browser?.includes('safari') ? false : res
		}

		if (os === 'android') {
			// FUTURE: Test if androidPackage doesn't redirect to app store (even when scheme and path are correct) when androidPackage === scheme
			// const intentUrl = `intent://${path}#Intent;scheme=unft;package=${redirectOptions.androidPackage};S.browser_fallback_url=${fallbackUrl};end`

			const intentUrl = `intent://${path}#Intent;scheme=unft;S.browser_fallback_url=${appStoreUrls.android};end`
			Router.push(intentUrl)

			await new Promise((resolve) => setTimeout(resolve, 100))

			return !windowFocus.current
		}

		return false
	}

	return { appStoreUrls, redirect }
}

import { useState } from 'react'
import {
	createReactQueryHooks,
	CreateTRPCClientOptions,
	HTTPHeaders,
	UseTRPCMutationOptions as _UseTRPCMutationOptions,
	TRPCClientErrorLike,
} from '@trpc/react'
import type { inferProcedureOutput, inferProcedureInput } from '@trpc/server'
import superjson from 'superjson'
import { QueryClient, QueryClientProvider } from 'react-query'
import Constants from 'expo-constants'

import type { AppRouter } from '@uppernft/web/src/server/router'
import { sidStore } from '@app/store'

export type { AppRouter } from '@uppernft/web/src/server/router'

const TIMEOUT_IN_MS = 30_000

export const trpc = createReactQueryHooks<AppRouter>()

const queryClient = new QueryClient()

function getApiUrl() {
	const url = Constants.manifest?.extra?.API_URL as string | undefined
	if (!url) throw new Error('API_URL environmental variable not found')
	return url
}

type CreateTRPCClientProps = Omit<
	CreateTRPCClientOptions<AppRouter>,
	'headers'
> & {
	headers?: HTTPHeaders
}

export function createTRPCClient(options?: CreateTRPCClientProps) {
	const controller = new AbortController()

	return trpc.createClient({
		transformer: superjson,
		url: getApiUrl(),
		async fetch(url, options) {
			const headers = new Headers(options?.headers)
			if (!headers.get('Authorization')) {
				const sessionToken = await sidStore.get()
				if (sessionToken)
					headers.append('Authorization', 'Bearer ' + sessionToken)
			}

			const timeout = setTimeout(() => controller.abort(), TIMEOUT_IN_MS)

			options ||= {}
			options.headers = headers
			options.signal = controller.signal

			const res = await fetch(url, options)
			clearTimeout(timeout)
			return res
		},
		...options,
	})
}

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
export function TRPCProvider({ children }: { children: React.ReactNode }) {
	const [trpcClient] = useState(createTRPCClient)

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</trpc.Provider>
	)
}

const UNSUPPORTED_ERROR_MESSAGES = [
	'Failed to fetch',
	'Network request failed',
	'Aborted',
]

export function parseErrorMessage(
	error?: TRPCClientErrorLike<AppRouter> | null
) {
	if (!error) return ''

	let message = error.message
	try {
		const tempMessage = JSON.parse(error.message)[0]?.message
		if (tempMessage) message = tempMessage
	} catch (e) {}

	if (UNSUPPORTED_ERROR_MESSAGES.includes(message))
		message = 'An unexpected error occurred, please try again later'

	return message
}

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type inferQueryOutput<
	TRouteKey extends keyof AppRouter['_def']['queries']
> = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>

export type inferQueryInput<
	TRouteKey extends keyof AppRouter['_def']['queries']
> = inferProcedureInput<AppRouter['_def']['queries'][TRouteKey]>

export type inferMutationOutput<
	TRouteKey extends keyof AppRouter['_def']['mutations']
> = inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>

export type inferMutationInput<
	TRouteKey extends keyof AppRouter['_def']['mutations']
> = inferProcedureInput<AppRouter['_def']['mutations'][TRouteKey]>

export type UseTRPCMutationOptions<
	TRouteKey extends keyof AppRouter['_def']['mutations']
> = _UseTRPCMutationOptions<
	inferMutationInput<TRouteKey>,
	TRPCClientErrorLike<AppRouter>,
	inferMutationOutput<TRouteKey>
>

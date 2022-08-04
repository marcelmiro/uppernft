import Constants from 'expo-constants'
import { createReactQueryHooks, CreateTRPCClientOptions } from '@trpc/react'
import type { inferProcedureOutput, inferProcedureInput } from '@trpc/server'
import { createTRPCClient as _createTRPCClient } from '@trpc/client'
import * as SecureStore from 'expo-secure-store'
import superjson from 'superjson'

import type { AppRouter } from '@uppernft/web/src/server/router'

export const trpc = createReactQueryHooks<AppRouter>()

const sessionName = Constants.manifest?.extra?.SID_NAME as string | undefined
if (!sessionName) throw new Error('sessionName is required')

function getApiUrl() {
	const url = Constants.manifest?.extra?.API_URL as string | undefined
	if (!url) throw new Error('API_URL environmental variable not found')
	return url
}

type CreateTRPCClientProps = CreateTRPCClientOptions<AppRouter> & {
	includeSessionId?: boolean
}

export function createTRPCClient(options?: CreateTRPCClientProps) {
	const { includeSessionId, ...otherOptions } = options || {}

	return trpc.createClient({
		transformer: superjson,
		url: getApiUrl(),
		async fetch(url, options) {
			const headers: Record<string, string> =
				(options?.headers as Record<string, string> | undefined) || {}
			if (includeSessionId) {
				const sid = await SecureStore.getItemAsync(
					sessionName as string
				)
				if (sid) headers.Authorization = `Bearer ${sid}`
			}
			return fetch(url, { ...options, headers })
		},
		...otherOptions,
	})
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

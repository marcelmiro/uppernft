import { useState } from 'react'
import { atom } from 'nanostores'
import { useStore } from '@nanostores/react'
import { z } from 'zod'
import { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc'
import { TRPCClientErrorLike } from '@trpc/client'
import { useMutation, UseMutationOptions } from 'react-query'

import { trpc, UseTRPCMutationOptions, AppRouter } from '@app/utils/trpc'
import { sidStore } from '@app/store'

interface User {
	email: string
	username: string
}

const isReadyAtom = atom(false)
const userAtom = atom<User | null>(null)

function handleRetry(
	count: number,
	error: TRPCClientErrorLike<AppRouter>,
	supportedCodes: TRPC_ERROR_CODE_KEY[],
	handleAbort?: () => boolean | void
) {
	if (count >= 3) return false

	if (error.message === 'Aborted') {
		const res = handleAbort?.()
		return typeof res === 'boolean' ? res : false
	}

	return !error.data?.code || !supportedCodes.includes(error.data.code)
}

export function useAuth() {
	const isReady = useStore(isReadyAtom)
	const user = useStore(userAtom)
	const [hasAborted, setHasAborted] = useState(false)

	const { error } = trpc.useQuery(['auth.verify'], {
		enabled: !isReady,
		onSuccess: userAtom.set,
		onSettled() {
			isReadyAtom.set(true)
		},
		retry(count, e) {
			return handleRetry(count, e, ['FORBIDDEN', 'UNAUTHORIZED'], () =>
				setHasAborted(true)
			)
		},
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	})

	const formattedError = error && {
		code: error.data?.code,
		httpStatus: error.data?.httpStatus,
		message: error.message,
	}

	return { user, isReady, error: formattedError, hasAborted }
}

const signupSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email'),
	username: z
		.string()
		.min(1, 'Username is required')
		.min(4, 'Username must be at least 4 characters long')
		.max(16, 'Username cannot exceed 16 characters')
		.regex(
			/^(?!.*[._]{2})(?!.*\.$)(?!\..*$)[a-zA-Z0-9._]+$/,
			'Username can only contain alphanumeric characters and symbols (._)'
		),
	password: z
		.string()
		.min(1, 'Password is required')
		.min(8, 'Password must be at least 8 characters long'),
})

export function useSignup(options?: UseTRPCMutationOptions<'auth.signup'>) {
	const { mutate, isLoading, error } = trpc.useMutation(['auth.signup'], {
		...options,
		onMutate(variables) {
			signupSchema.parse(variables)
			options?.onMutate?.(variables)
		},
		onSuccess(data, variables, context) {
			sidStore.set(data.sessionToken)
			userAtom.set(data.user)
			options?.onSuccess?.(data, variables, context)
		},
		retry(count, e) {
			return handleRetry(count, e, ['BAD_REQUEST'])
		},
	})

	return { signup: mutate, isLoading, error }
}

const loginSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email'),
	password: z
		.string()
		.min(1, 'Password is required')
		.min(8, 'Password must be at least 8 characters long'),
})

export function useLogin(options?: UseTRPCMutationOptions<'auth.login'>) {
	const { mutate, isLoading, error } = trpc.useMutation(['auth.login'], {
		...options,
		onMutate(variables) {
			loginSchema.parse(variables)
			options?.onMutate?.(variables)
		},
		onSuccess(data, variables, context) {
			sidStore.set(data.sessionToken)
			userAtom.set(data.user)
			options?.onSuccess?.(data, variables, context)
		},
		retry(count, e) {
			return handleRetry(count, e, ['NOT_FOUND'])
		},
	})

	return { login: mutate, isLoading, error }
}

export function useLogout(options?: UseMutationOptions) {
	const { queryClient } = trpc.useContext()

	const { mutate, isLoading, error } = useMutation(() => sidStore.set(''), {
		...options,
		onSuccess(data, variables, context) {
			userAtom.set(null)
			queryClient.removeQueries(['user.items'])
			options?.onSuccess?.(data, variables, context)
		},
		retry(count) {
			return count < 5
		},
	})

	return { logout: mutate, isLoading, error }
}

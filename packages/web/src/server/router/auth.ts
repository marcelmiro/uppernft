import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createRouter } from './context'
import { signup, login, validateSession } from '../../lib/auth'

export const authRouter = createRouter()
	.mutation('signup', {
		input: z.object({
			email: z.string().email('Invalid email'),
			username: z
				.string()
				.min(1, 'Username is required')
				.min(4, 'Username must be at least 4 characters long'),
			password: z
				.string()
				.min(1, 'Password is required')
				.min(8, 'Password must be at least 8 characters long')
				.regex(
					/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()_\-+=[\]{}:;"'|\\<>,./?€]).*$/g,
					'Password must use a mix of letters, numbers and symbols'
				),
		}),
		async resolve({ ctx, input }) {
			input.email = input.email.toLowerCase()
			input.username = input.username.toLowerCase()

			const user = await ctx.prisma.user.findFirst({
				where: {
					OR: [{ email: input.email }, { username: input.username }],
				},
			})

			if (user) {
				if (user.email === input.email)
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Email is already in use',
					})
				if (user.username === input.username)
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Username is already in use',
					})
			}

			const res = await signup({ ctx, ...input })

			ctx.res?.setHeader('Authorization', 'Bearer ' + res.sessionToken)

			return res
		},
	})
	.mutation('login', {
		input: z.object({
			email: z.string().email('Invalid email'),
			password: z.string().min(1, 'Password is required'),
		}),
		async resolve({ ctx, input }) {
			const res = await login({ ctx, ...input })

			if (!res)
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Invalid email or password',
				})

			ctx.res?.setHeader('Authorization', 'Bearer ' + res.sessionToken)

			return res
		},
	})
	.query('verify', {
		async resolve({ ctx }) {
			const user = await validateSession(ctx)

			// const wallet = await generateWalletFromEntropy(user.entropy)
			// return { wallet }

			const { email, username } = user
			return { email, username }
		},
	})

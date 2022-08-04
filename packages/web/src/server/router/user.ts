import { TRPCError } from '@trpc/server'

import { createRouter } from './context'
import { validateSession } from '../../lib/auth'

export const userRouter = createRouter()
	.query('me', {
		async resolve({ ctx }) {
			const token = ctx.req?.headers.authorization
			const sessionToken = token?.split('Bearer ')?.[1]

			if (!sessionToken)
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'Session Id is required',
				})

			const user = await validateSession({ ctx, sessionToken })

			if (!user)
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Invalid user',
				})

			const { id, sessionId, entropy, ...restUser } = user

			return restUser
		},
	})
	.query('test', { resolve: () => ({ id: 123, username: 'hello' }) })
	.mutation('test', { resolve: () => ({ hasChanged: 'idk' }) })
// TODO: Remove test endpoints

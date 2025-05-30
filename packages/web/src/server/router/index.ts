// src/server/router/index.ts
import superjson from 'superjson'

import { createRouter } from './context'
import { authRouter } from './auth'
import { userRouter } from './user'
import { itemRouter } from './item'

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('auth.', authRouter)
	.merge('user.', userRouter)
	.merge('item.', itemRouter)

// export type definition of API
export type AppRouter = typeof appRouter

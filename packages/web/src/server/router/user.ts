import { TRPCError } from '@trpc/server'

import { createRouter } from './context'
import { validateSession } from '../../lib/auth'

export const userRouter = createRouter().query('items', {
	async resolve({ ctx }) {
		try {
			const user = await validateSession(ctx)

			const items = await ctx.prisma.item.findMany({
				where: { ownerId: user.id },
				include: { model: true },
			})

			// await new Promise((resolve) => setTimeout(resolve, 5000))

			return items
		} catch (e) {
			if (e instanceof TRPCError) throw e
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
		}
	},
})

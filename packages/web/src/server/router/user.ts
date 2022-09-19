import { createRouter } from './context'
import { validateSession } from '@web/lib/auth'

export const userRouter = createRouter().query('items', {
	async resolve({ ctx }) {
		const user = await validateSession(ctx)

		const items = await ctx.prisma.item.findMany({
			where: { ownerId: user.id },
			include: { model: true },
		})

		return items
	},
})

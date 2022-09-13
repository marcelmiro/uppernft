import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createRouter } from './context'
import { validateSession } from '../../lib/auth'

const ONE_DAY_IN_SECONDS = 60 * 60 * 24 * 7

export const itemRouter = createRouter()
	.query('metadata', {
		input: z.object({
			serialNumber: z.string().min(1, 'Serial number is required'),
		}),
		async resolve({ ctx, input: { serialNumber } }) {
			const item = await ctx.prisma.item.findUnique({
				where: { serialNumber },
				include: { model: true, owner: true },
			})

			if (!item)
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Bike not found',
				})

			const res = {
				name: item.model.name,
				imageUri: item.model.imageUri,
				owner: item.owner.walletAddress,
			}

			ctx.res?.setHeader(
				'Cache-Control',
				`s-maxage=15, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`
			)

			return res
		},
	})
	.query('overview', {
		input: z.object({
			serialNumber: z.string().min(1, 'Serial number is required'),
		}),
		async resolve({ ctx, input: { serialNumber } }) {
			const item = await ctx.prisma.item.findUnique({
				where: { serialNumber },
				include: { model: true, components: true },
			})

			if (!item)
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Bike not found',
				})

			return item
		},
	})
	.query('activity', {
		input: z.object({
			serialNumber: z.string().min(1, 'Serial number is required'),
		}),
		async resolve({ ctx, input: { serialNumber } }) {
			const item = await ctx.prisma.item.findUnique({
				where: { serialNumber },
				include: { activities: true },
			})

			if (!item)
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Bike not found',
				})

			return item
		},
	})
	.mutation('stolen', {
		input: z.object({
			serialNumber: z.string().min(1, 'Serial number is required'),
			isStolen: z.boolean({
				required_error: 'isStolen is required',
				invalid_type_error: 'Invalid isStolen',
			}),
		}),
		async resolve({ ctx, input: { serialNumber, isStolen } }) {
			const user = await validateSession(ctx)

			const item = await ctx.prisma.item.findUnique({
				where: { serialNumber },
			})

			if (!item)
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Bike not found',
				})

			if (item.ownerId !== user.id)
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: "You don't have permission to manage this bike",
				})

			if (item.isStolen !== isStolen)
				await ctx.prisma.item.update({
					where: { serialNumber },
					data: { isStolen },
				})

			return { isStolen }
		},
	})
	.query('registrable', {
		input: z.object({
			serialNumber: z
				.string()
				.min(1, 'Serial number is required')
				.min(8, 'Invalid serial number'),
		}),
		async resolve({ ctx, input: { serialNumber } }) {
			await validateSession(ctx)

			// TODO: Temp code to check item availability
			const code = serialNumber.slice(-3)

			const promises = [
				ctx.prisma.itemModel.findUnique({ where: { code } }),
				ctx.prisma.item.findUnique({ where: { serialNumber } }),
			] as const

			const [model, item] = await Promise.all(promises)

			if (item)
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Bike is already registered',
				})

			if (!model)
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Bike not found',
				})

			return {
				serialNumber,
				name: model.name,
				imageUri: model.imageUri,
			}
		},
	})
	.mutation('register', {
		input: z.object({
			serialNumber: z
				.string()
				.min(1, 'Serial number is required')
				.min(8, 'Invalid serial number'),
		}),
		async resolve({ ctx, input: { serialNumber } }) {
			const user = await validateSession(ctx)

			// TODO: Temp code to generate bike from fake model
			const code = serialNumber.slice(-3)

			const model = await ctx.prisma.itemModel.findUnique({
				where: { code },
				include: { components: true },
			})

			if (!model)
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Bike not found',
				})

			const { id, createdAt, updatedAt, ...components } = model.components

			// TODO: Handle serialNumber duplicate error
			return ctx.prisma.item.create({
				data: {
					serialNumber,
					model: { connect: { id: model.id } },
					owner: { connect: { id: user.id } },
					components: { create: components },
					activities: {
						create: [
							{
								type: 'MINT',
								externalLink:
									'https://rinkeby.etherscan.io/tx/0x2fcb9255113e8980525f6edb2fa28551a95b0d5d4ca3d4010aaec466c948206f',
							},
						],
					},
				},
			})
		},
	})
	.mutation('delete', {
		input: z.object({
			serialNumber: z.string().min(1, 'Serial number is required'),
		}),
		async resolve({ ctx, input: { serialNumber } }) {
			const user = await validateSession(ctx)

			const item = await ctx.prisma.item.findUnique({
				where: { serialNumber },
			})

			if (!item)
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Bike not found',
				})

			if (item.ownerId !== user.id)
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: "You don't have permission to manage this bike",
				})

			return ctx.prisma.item.delete({ where: { serialNumber } })
		},
	})

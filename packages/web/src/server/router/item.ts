import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import type { User } from '@prisma/client'

import { createRouter } from './context'
import { validateSession } from '@web/lib/auth'
import { mintToken } from '@web/lib/web3'

export const itemRouter = createRouter()
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

			if (item.ownerAddress !== user.walletAddress)
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
			// FUTURE: Temp code to check item availability
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

			// FUTURE: Temp code to generate bike from fake model
			const code = serialNumber.slice(-3)

			const [item, model] = await Promise.all([
				ctx.prisma.item.findUnique({ where: { serialNumber } }),
				ctx.prisma.itemModel.findUnique({
					where: { code },
					include: { components: true },
				}),
			])

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

			const { hash, txUrl } = await mintToken({
				serialNumber,
				to: user.walletAddress,
				name: model.name,
				imageUri: model.imageUri,
			})

			const {
				id: _id,
				createdAt: _createdAt,
				updatedAt: _updatedAt,
				...components
			} = model.components

			const [newItem] = await ctx.prisma.$transaction([
				ctx.prisma.item.create({
					data: {
						serialNumber,
						model: { connect: { id: model.id } },
						owner: { connect: { id: user.id } },
						components: { create: components },
						activities: {
							create: [{ type: 'MINT', externalLink: txUrl }],
						},
					},
				}),
				ctx.prisma.unconfirmedTransaction.create({
					data: {
						hash,
						item: { connect: { serialNumber } },
					},
				}),
			])

			return newItem
		},
	})
	.mutation('transfer', {
		input: z.object({
			serialNumber: z.string().min(1, 'Serial number is required'),
			transfereeType: z.string().min(1, 'Transferee type is required'),
			transfereeValue: z.string().min(1, 'Transferee value is required'),
		}),
		async resolve({
			ctx,
			input: { serialNumber, transfereeType, transfereeValue },
		}) {
			const user = await validateSession(ctx)

			const item = await ctx.prisma.item.findUnique({
				where: { serialNumber },
			})

			if (!item)
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Bike not found',
				})

			if (item.ownerAddress !== user.walletAddress)
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: "You don't have permission to transfer this bike",
				})

			if (item.isStolen)
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'Bike cannot be transferred if marked as stolen',
				})

			let beneficiary: User | null

			if (transfereeType === 'username') {
				beneficiary = await ctx.prisma.user.findUnique({
					where: { username: transfereeValue },
				})
			} else if (transfereeType === 'email') {
				beneficiary = await ctx.prisma.user.findUnique({
					where: { email: transfereeValue },
				})
			} else {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Invalid user',
				})
			}

			if (!beneficiary)
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'User not found',
				})

			if (item.ownerAddress === beneficiary.walletAddress)
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Cannot transfer to the same owner',
				})

			// TODO: Transfer token

			return ctx.prisma.item.update({
				where: { id: item.id },
				data: { ownerAddress: beneficiary.walletAddress },
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

			if (item.ownerAddress !== user.walletAddress)
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: "You don't have permission to manage this bike",
				})

			// TODO: Burn token

			// FUTURE: Set `deleted` prop to `true` instead of deleting item
			return ctx.prisma.item.delete({ where: { serialNumber } })
		},
	})

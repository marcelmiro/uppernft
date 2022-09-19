// src/server/db/client.ts
import { PrismaClient } from '@prisma/client'

import { prisma as defaultPrisma } from '@db/index'

declare global {
	var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || defaultPrisma

if (process.env.NODE_ENV !== 'production') {
	global.prisma = prisma
}

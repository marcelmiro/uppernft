/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const itemModels: Prisma.ItemModelCreateInput[] = [
	{
		code: '401',
		name: 'Spark RC SL EVO AXS',
		components: {
			create: {
				frame: 'Spark RC Carbon HMX SL',
				fork: 'FOX 34 SC Float Factory Air / Kashima FIT4',
				rearDerailleur: 'SRAM XX1 Eagle AXS',
				brakes: 'Shimano XTR M9100 Disc',
				crankset:
					'SRAM XX1 Eagle AXS Carbon crankarm / Power Meter DUB / 55mm CL / 32T',
				shifters: 'SRAM Eagle AXS Rocker Controller',
				handlebar: 'Syncros Fraser iC SL XC Carbon',
				seat: 'Syncros Belcarra SL Regular 1.0',
				wheelset: 'Syncros Silverton SL2-30 CL full Carbon',
				tires: 'Maxxis Rekon Race / 29x2.4" / 120TPI Foldable Bead',
			},
		},
	},
	{
		code: '402',
		name: "Quick CX Women's 1",
		components: {
			create: {
				frame: 'SmartForm C3 Alloy, SAVE, tapered head tube, Straightshot hidden cable routing, flat mount disc, rack/fender mounts, 360° reflectivity',
				fork: 'Suntour NEX-E25, 63mm, tapered alloy steerer, coil, remote lockout, custom crown',
				rearDerailleur: 'SX Eagle',
				brakes: '(F) Tektro HD-T275 hydraulic disc, 160mm rotor / (R) Tektro HD-R280 hydraulic disc, 160mm rotor',
				crankset: 'SRAM SX Eagle Power Spline, 38T',
				shifters: 'SRAM SX Eagle, 12-speed',
				handlebar:
					'Cannondale 3, 6061 Alloy Double-butted, 20mm rise, 9° back, 660mm',
				seat: 'Cannondale Fitness Ergo Double Density',
				tires: 'Vittoria Terreno Dry, 700 x 40, reflective strip',
			},
		},
	},
]

function populate() {
	return Promise.all(
		itemModels.map((model) => prisma.itemModel.create({ data: model }))
	)
}

async function main() {
    return populate()
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})

import { z } from 'zod'

export const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	NODE_ENV: z.enum(['development', 'test', 'production']),
	API_URL: z
		.string()
		.url()
		.refine((url) => url.endsWith('/')),
})

// @ts-check
/**
 * This file is included in `/next.config.mjs` which ensures the app isn't built with invalid env vars.
 * It has to be a `.mjs`-file to be imported there.
 */
import { config as dotenv } from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

import { envSchema } from './env-schema.mjs'

const __dirname = fileURLToPath(import.meta.url)
const envDirectory = path.resolve(__dirname, '../../../../../.env')
dotenv({ path: envDirectory })

const _env = envSchema.safeParse(process.env)

const formatErrors = (
	/** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
	errors
) =>
	Object.entries(errors)
		.map(([name, value]) => {
			if (value && '_errors' in value)
				return `${name}: ${value._errors.join(', ')}\n`
		})
		.filter(Boolean)

if (!_env.success) {
	console.error(
		'❌ Invalid environment variables:\n',
		...formatErrors(_env.error.format())
	)
	process.exit(1)
}

export const env = _env.data

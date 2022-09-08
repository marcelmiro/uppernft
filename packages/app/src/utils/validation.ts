import { ZodError, ZodType } from 'zod'

interface ValidateInputProps {
	data: unknown
	schema: ZodType
}

export async function validate({ data, schema }: ValidateInputProps) {
	try {
		await schema.parseAsync(data)
		return true
	} catch (e) {
		if (e instanceof ZodError && e.issues[0]?.message) {
			throw new Error(e.issues[0].message)
		} else throw e
	}
}

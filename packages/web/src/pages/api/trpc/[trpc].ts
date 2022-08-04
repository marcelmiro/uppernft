import { createNextApiHandler } from '@trpc/server/adapters/next'
import { NextApiHandler } from 'next'
import Cors from 'cors'

import { appRouter } from '../../../server/router'
import { createContext } from '../../../server/router/context'

const cors = Cors()

const corsMiddleware: NextApiHandler = (req, res) =>
	new Promise((resolve, reject) => {
		cors(req, res, (result: Error | unknown) => {
			if (result instanceof Error) return reject(result)
			return resolve(result)
		})
	})

function handleCors(callback: NextApiHandler): NextApiHandler {
	const handler: NextApiHandler = async function (req, res) {
		await corsMiddleware(req, res)
		return callback(req, res)
	}
	return handler
}

// export API handler
export default handleCors(
	createNextApiHandler({
		router: appRouter,
		createContext,
		onError({ error }) {
			if (error.code === 'INTERNAL_SERVER_ERROR' && !error.message) {
				error.message =
					'An unexpected error occurred - Please try again later'
			}
		},
	})
)

// src/pages/_app.tsx
import type { AppType } from 'next/app'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { withTRPC } from '@trpc/next'
import superjson from 'superjson'

import type { AppRouter } from '@web/server/router'
import { getBaseUrl } from '@web/utils/url'
import '@web/styles/globals.scss'

const MyApp: AppType = ({ Component, pageProps }) => {
	return <Component {...pageProps} />
}

export default withTRPC<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`

		return {
			url,
			transformer: superjson,

			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === 'development' ||
						(opts.direction === 'down' &&
							opts.result instanceof Error),
				}),
				httpBatchLink({ url }),
			],

			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },

			// To use SSR properly you need to forward the client's headers to the server
			// headers: () => {
			// 	if (ctx?.req) {
			// 		const headers = ctx?.req?.headers
			// 		delete headers?.connection
			// 		return {
			// 			...headers,
			// 			'x-ssr': '1',
			// 		}
			// 	}
			// 	return {}
			// },
		}
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(MyApp)

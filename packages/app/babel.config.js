const tsconfig = require('./tsconfig.json')

const rawAlias = tsconfig.compilerOptions.paths
const alias = {}

for (const [key, value] of Object.entries(rawAlias)) {
	alias[key.replace('/*', '')] = value[0].replace('/*', '')
}

module.exports = function (api) {
	api.cache(true)
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			[
				'module-resolver',
				{
					alias,
					root: ['./'],
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
				},
			],
		],
	}
}

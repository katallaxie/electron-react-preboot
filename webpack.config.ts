import { spawn } from 'child_process'
import * as Path from 'path'
import * as WebpackMerge from 'webpack-merge'

import { root } from './config/helpers'

import {
	CustomCommonConfig,
	CustomDevConfig,
	CustomProdConfig
} from './config/custom'
import {
	DefaultCommonConfig,
	DefaultDevConfig,
	DefaultMainConfig,
	DefaultProdConfig
} from './config/default'
import { Externals } from './config/dll'

// env
const EVENT = process.env.npm_lifecycle_event
const ENV = process.env.NODE_ENV || 'development'

const port = process.env.PORT || 1212

// config
const EnvConfig = {
	isDev: ENV === 'development',
	isMain: EVENT.includes('main')
}

// common
const CommonConfig = () => {
	const config = {} as WebpackConfig

	config.module = {
		rules: [...DefaultCommonConfig().rules, ...CustomCommonConfig.rules]
	}

	config.plugins = [
		...DefaultCommonConfig().plugins,
		...CustomCommonConfig.plugins
	]

	config.externals = Externals

	config.node = {
		__dirname: false,
		__filename: false
	}

	return config
}

// dev
const DevConfig = () => {
	const config = {} as WebpackConfig

	config.devtool = 'source-map'

	config.mode = 'development'

	config.target = 'electron-renderer'

	config.externals = ['fsevents', 'crypto-browserify']

	config.module = {
		rules: [...DefaultDevConfig.rules, ...CustomDevConfig.rules]
		// noParse: [/remote-redux-devtools/]
	}

	config.plugins = [...DefaultDevConfig.plugins, ...CustomDevConfig.plugins]

	config.resolve = {
		cacheWithContext: false,
		modules: [root('src'), 'node_modules']
	}

	config.entry = {
		app: [
			'react-hot-loader/patch',
			`webpack-dev-server/client?http://localhost:${port}/`,
			'webpack/hot/only-dev-server',
			'./src/boot'
		]
	}

	config.output = {
		filename: 'app.bundle.js',
		path: root('app'),
		sourceMapFilename: '[file].map'
		// chunkFilename: '[id].chunk.js'
	}

	config.devServer = {
		compress: false,
		// stats: 'errors-only',
		contentBase: Path.join(__dirname, 'app'),
		headers: { 'Access-Control-Allow-Origin': '*' },
		historyApiFallback: {
			disableDotRule: false,
			verbose: true,
		},
		hot: true,
		inline: true,
		lazy: false,
		noInfo: false,
		port,
		publicPath: `http://localhost:${port}/`,
		watchOptions: {
			aggregateTimeout: 300,
			ignored: /node_modules/,
			poll: 100
		},
		before() {
			if (process.env.START_ELECTRON) {
				spawn('npm', ['run', 'electron:dev'], {
					env: process.env,
					shell: true,
					stdio: 'inherit'
				})
					.on('close', code => process.exit(code))
					.on('error', spawnError => console.error(spawnError))
			}
		}
	}

	return config
}

// prod
const ProdConfig = () => {
	const config: WebpackConfig = {}

	config.devtool = 'source-map'

	config.mode = 'production'

	config.module = {
		rules: [...DefaultProdConfig.rules, ...CustomProdConfig.rules]
	}

	config.performance = {
		hints: 'warning'
	}

	config.plugins = [...DefaultProdConfig.plugins, ...CustomProdConfig.plugins]

	config.resolve = {
		modules: [root('src'), 'node_modules']
	}

	config.entry = {
		app: './src/boot'
	}

	config.output = {
		chunkFilename: '[id].chunk.js',
		filename: '[name].bundle.js',
		path: root('app'),
		sourceMapFilename: '[file].map'
	}

	return config
}

// main
const MainConfig = () => {
	const config = {} as WebpackConfig

	config.devtool = 'source-map'

	config.mode = 'development'

	config.target = 'electron-main'

	config.entry = ['./main']

	config.module = {
		rules: [...DefaultMainConfig.rules]
	}

	config.plugins = [...DefaultMainConfig.plugins]

	config.output = {
		filename: 'main.bundle.js',
		path: root('app')
	}

	config.node = {
		__dirname: false,
		__filename: false
	}

	return config
}

// default
const DefaultConfig = () => {
	const config = {} as WebpackConfig

	config.resolve = {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
		modules: [root('app'), 'node_modules'],
	}

	return config
}

// webpack
switch (ENV) {
	case 'prod':
	case 'production':
		module.exports = EnvConfig.isMain
			? WebpackMerge({}, DefaultConfig(), MainConfig())
			: WebpackMerge({}, DefaultConfig(), CommonConfig(), ProdConfig())
		break
	case 'dev':
	case 'development':
	default:
		module.exports = WebpackMerge(
			{},
			DefaultConfig(),
			CommonConfig(),
			DevConfig()
		)
}

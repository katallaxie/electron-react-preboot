/** DO NOT TOUCH **/
// import { root } from './helpers'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import { TsConfigPathsPlugin } from 'awesome-typescript-loader'
import * as ModuleConcatenationPlugin from 'webpack/lib/optimize/ModuleConcatenationPlugin'
import {
	NamedModulesPlugin,
	NoEmitOnErrorsPlugin,
	HotModuleReplacementPlugin
} from 'webpack'
import * as CopyWebpackPlugin from 'copy-webpack-plugin'

export const Loader = {
	tsLoader: {
		test: /\.tsx?$/,
		exclude: /node_modules/,
		use: {
			loader: 'awesome-typescript-loader'
		}
	},
	cssLoader: {
		test: /\.css$/,
		use: [
			'style-loader',
			{
				loader: 'css-loader',
				options: {
					importLoader: 1,
					modules: true,
					localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
				}
			}
		]
	}
}

export const DefaultCommonConfig = () => {
	const config = {
		rules: [Loader.tsLoader, Loader.cssLoader],
		plugins: [
			new TsConfigPathsPlugin(),
			new HtmlWebpackPlugin({
				inject: true,
				template: './src/app.html'
			}),
			new NamedModulesPlugin()
		]
	}

	return config
}

export const DefaultDevConfig = {
	rules: [],
	plugins: [
		new NoEmitOnErrorsPlugin(),
		new HotModuleReplacementPlugin()
	]
}

export const DefaultProdConfig = {
	rules: [],
	plugins: [
		new ModuleConcatenationPlugin()
	]
}

export const DefaultMainConfig = {
	rules: [Loader.tsLoader],
	plugins: [new CopyWebpackPlugin([{ from: 'assets/package.json' }])]
}

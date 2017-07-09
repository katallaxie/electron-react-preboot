/** DO NOT TOUCH **/
// import { root } from "./helpers";
import Path from 'path';

import AutoDllPlugin from 'autodll-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import BabiliPlugin from 'babili-webpack-plugin';
import {
  NamedModulesPlugin,
  NoEmitOnErrorsPlugin,
  HotModuleReplacementPlugin
} from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { Pollyfills, Vendor } from './dll';

export const Loader = {
  jsLoader: {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true
      }
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
};

export const DefaultCommonConfig = () => {
  const config = {
    rules: [Loader.jsLoader, Loader.cssLoader],
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: './src/app.html'
      }),
      new NamedModulesPlugin()
    ]
  };

  return config;
};

export const DefaultDevConfig = {
  rules: [],
  plugins: [
    new AutoDllPlugin({
      debug: true,
      inject: true,
      context: Path.join(__dirname, '..'),
      filename: '[name].bundle.js',
      path: './dll',
      entry: {
        polyfill: Pollyfills,
        vendor: Vendor
      }
    }),
    new NoEmitOnErrorsPlugin(),
    new HotModuleReplacementPlugin()
  ]
};

export const DefaultProdConfig = {
  rules: [],
  plugins: [new BabiliPlugin()]
};

export const DefaultMainConfig = {
  rules: [Loader.jsLoader],
  plugins: [
    new BabiliPlugin(),
    new CopyWebpackPlugin([{ from: 'assets/package.json' }])
  ]
};

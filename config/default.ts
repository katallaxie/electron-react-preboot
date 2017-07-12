/** DO NOT TOUCH **/
// import { root } from "./helpers";
import * as Path from "path";

import * as AutoDllPlugin from "autodll-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { TsConfigPathsPlugin } from "awesome-typescript-loader";
import {
  NamedModulesPlugin,
  NoEmitOnErrorsPlugin,
  HotModuleReplacementPlugin
} from "webpack";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import { Pollyfills, Vendor } from "./dll";

export const Loader = {
  tsLoader: {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: {
      loader: "awesome-typescript-loader"
    }
  },
  cssLoader: {
    test: /\.css$/,
    use: [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          importLoader: 1,
          modules: true,
          localIdentName: "[path]___[name]__[local]___[hash:base64:5]"
        }
      }
    ]
  }
};

export const DefaultCommonConfig = () => {
  const config = {
    rules: [Loader.tsLoader, Loader.cssLoader],
    plugins: [
      new TsConfigPathsPlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        template: "./src/app.html"
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
      context: Path.join(__dirname, ".."),
      filename: "[name].bundle.js",
      path: "./dll",
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
  plugins: []
};

export const DefaultMainConfig = {
  rules: [Loader.tsLoader],
  plugins: [new CopyWebpackPlugin([{ from: "assets/package.json" }])]
};

import { spawn } from "child_process";
import * as Path from "path";
import * as WebpackMerge from "webpack-merge";

import { root } from "./config/helpers";

import {
  DefaultDevConfig,
  DefaultCommonConfig,
  DefaultProdConfig,
  DefaultMainConfig
} from "./config/default";
import {
  CustomDevConfig,
  CustomCommonConfig,
  CustomProdConfig
} from "./config/custom";
import { Externals } from "./config/dll";

// env
const EVENT = process.env.npm_lifecycle_event;
const ENV = process.env.NODE_ENV || "development";

const port = process.env.PORT || 1212;

// config
const EnvConfig = {
  isDev: ENV === "development",
  isMain: EVENT.includes("main")
};

// common
const CommonConfig = () => {
  const config = <WebpackConfig>{};

  config.module = {
    rules: [...DefaultCommonConfig().rules, ...CustomCommonConfig.rules]
  };

  config.plugins = [
    ...DefaultCommonConfig().plugins,
    ...CustomCommonConfig.plugins
  ];

  config.externals = Externals;

  config.node = {
    __dirname: false,
    __filename: false
  };

  return config;
};

// dev
const DevConfig = () => {
  const config = <WebpackConfig>{};

  config.devtool = "source-map";

  config.target = "electron-renderer";

  config.externals = ["fsevents", "crypto-browserify"];

  config.module = {
    rules: [...DefaultDevConfig.rules, ...CustomDevConfig.rules]
    // noParse: [/remote-redux-devtools/]
  };

  config.plugins = [...DefaultDevConfig.plugins, ...CustomDevConfig.plugins];

  config.resolve = {
    cacheWithContext: false,
    modules: [root("src"), "node_modules"]
  };

  config.entry = {
    app: [
      "react-hot-loader/patch",
      `webpack-dev-server/client?http://localhost:${port}/`,
      "webpack/hot/only-dev-server",
      "./src/boot"
    ]
  };

  config.output = {
    path: root("app"),
    filename: "app.bundle.js",
    sourceMapFilename: "[file].map"
    // chunkFilename: '[id].chunk.js'
  };

  config.devServer = {
    port,
    publicPath: `http://localhost:${port}/`,
    compress: false,
    noInfo: false,
    // stats: 'errors-only',
    inline: true,
    lazy: false,
    hot: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    contentBase: Path.join(__dirname, "app"),
    watchOptions: {
      aggregateTimeout: 300,
      poll: 100,
      ignored: /node_modules/
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false
    },
    setup() {
      if (process.env.START_ELECTRON) {
        spawn("npm", ["run", "electron:dev"], {
          shell: true,
          env: process.env,
          stdio: "inherit"
        })
          .on("close", code => process.exit(code))
          .on("error", spawnError => console.error(spawnError));
      }
    }
  };

  return config;
};

// prod
const ProdConfig = () => {
  const config = <WebpackConfig>{};

  config.devtool = "source-map";

  config.module = {
    rules: [...DefaultProdConfig.rules, ...CustomProdConfig.rules]
  };

  config.performance = {
    hints: "warning"
  };

  config.plugins = [...DefaultProdConfig.plugins, ...CustomProdConfig.plugins];

  config.resolve = {
    modules: [root("src"), "node_modules"]
  };

  config.entry = {
    app: "./src/boot"
  };

  config.output = {
    path: root("app"),
    filename: "[name].bundle.js",
    sourceMapFilename: "[file].map",
    chunkFilename: "[id].chunk.js"
  };

  return config;
};

// main
const MainConfig = () => {
  const config = <WebpackConfig>{};

  config.devtool = "source-map";

  config.target = "electron-main";

  config.entry = ["./main"];

  config.module = {
    rules: [...DefaultMainConfig.rules]
  };

  config.plugins = [...DefaultMainConfig.plugins];

  config.output = {
    path: root("app"),
    filename: "main.bundle.js"
  };

  config.node = {
    __dirname: false,
    __filename: false
  };

  return config;
};

// default
const DefaultConfig = () => {
  const config = <WebpackConfig>{};

  config.resolve = {
    modules: [root("app"), "node_modules"],
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  };

  return config;
};

// webpack
switch (ENV) {
  case "prod":
  case "production":
    module.exports = EnvConfig.isMain
      ? WebpackMerge({}, DefaultConfig(), MainConfig())
      : WebpackMerge({}, DefaultConfig(), CommonConfig(), ProdConfig());
    break;
  case "dev":
  case "development":
  default:
    module.exports = WebpackMerge(
      {},
      DefaultConfig(),
      CommonConfig(),
      DevConfig()
    );
}

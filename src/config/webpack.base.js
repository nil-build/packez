const paths = require("./paths");
const path = require("path");
const fs = require("fs-extra");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // extract css to files
const SizePlugin = require("size-plugin");
const postcss = require("../config/postcss.config");
const babel = require("./babel.config");
const crypto = require("crypto");
const { isDevEnv, isTestEnv } = require("../utils");

const lessFunctionPlugin = new (require("less-plugin-functions"))();

// common function to get css loaders
const createCSSProcessorLoaders = (cssOptions, preProcessor, preProcessorOptions) => {
  const loaders = [
    isDevEnv() || isTestEnv()
      ? require.resolve("style-loader")
      : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            // publicPath: ...
          },
        },
    {
      loader: require.resolve("css-loader"),
      options: {
        modules: {
          auto: true, // enable CSS modules for all files matching /\.module\.\w+$/i.test(filename) and /\.icss\.\w+$/i.test(filename) regexp
          localIdentName: "[local]--[hash:base64:5]",
        },
        ...cssOptions,
      },
    },
    {
      loader: require.resolve("postcss-loader"),
      options: {
        postcssOptions: postcss(),
      },
    },
  ];

  if (preProcessor) {
    loaders.push({
      loader: require.resolve("resolve-url-loader"),
      options: {
        removeCR: true,
        sourceMap: !!cssOptions.sourceMap,
      },
    });

    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: !!cssOptions.sourceMap,
        ...preProcessorOptions,
      },
    });
  }

  return loaders;
};

const templateHtmlFile = fs.existsSync(paths.public + "/index.html")
  ? paths.public + "/index.html"
  : path.resolve(__dirname, "../public/index.html");

module.exports = (options = {}) => {
  const entry = options.entry || paths.src + "/index";

  const output = {
    path: paths.build,
    filename: "[name].bundle.js",
    publicPath: "/",
    clean: true,
    ...options.output,
  };

  const threadLoader = isDevEnv()
    ? [
        {
          loader: "thread-loader",
          options: {
            workers: 2,
            workerParallelJobs: 50,
            workerNodeArgs: ["--max-old-space-size=1024"],
            poolRespawn: false,
            poolTimeout: 2000,
            poolParallelJobs: 200,
          },
        },
      ]
    : [];

  return {
    entry,
    output,
    target: options.target || "web",
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      alias: {
        "~": paths.src,
      },
      fallback: {
        // module: false,
        dgram: false,
        dns: false,
        fs: false,
        http2: false,
        net: false,
        tls: false,
        child_process: false,
      },
      ...options.resolve,
    },
    optimization: {
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
      splitChunks: {
        chunks: "all",
        name(module, chunks, cacheGroupKey) {
          const allChunksNames = chunks.map((item) => item.name).join("-");
          const hash = crypto.createHash("md5").update(allChunksNames).digest("hex");
          return `${cacheGroupKey}_${hash.slice(0, 8)}`;
        },
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            // minChunks: 4,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },

    cache: {
      type: "filesystem", // memory or filesystem
    },

    plugins: [
      new CleanWebpackPlugin(),

      new HtmlWebpackPlugin({
        title: "Web App",
        template: templateHtmlFile,
        filename: "index.html",
        templateParameters: {},
      }),

      new SizePlugin(),
    ],

    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          exclude: function (path) {
            if (/node_modules/.test(path)) return true;
            return false;
          },
          use: [
            ...threadLoader,
            {
              loader: require.resolve("babel-loader"),
              options: babel(),
            },
          ],
        },

        {
          test: /\.(css)$/,
          use: createCSSProcessorLoaders({
            importLoaders: 1,
            sourceMap: isDevEnv(),
          }),
        },

        {
          test: /\.(scss|sass)$/,
          use: createCSSProcessorLoaders(
            {
              importLoaders: 2,
              sourceMap: isDevEnv(),
            },
            "sass-loader"
          ),
        },

        {
          test: /\.less$/,
          use: createCSSProcessorLoaders(
            {
              importLoaders: 2,
              sourceMap: isDevEnv(),
            },
            "less-loader",
            {
              lessOptions: {
                plugins: [lessFunctionPlugin],
                relativeUrls: false,
                javascriptEnabled: true,
              },
            }
          ),
        },
        // https://webpack.docschina.org/guides/asset-modules/
        {
          test: /\.svg$/,
          type: "asset/source",
        },

        {
          test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
          type: "asset/resource",
          generator: {
            filename: "static/images/[hash][ext]",
          },
        },

        {
          test: /\.(woff(2)?|eot|ttf|otf|)$/,
          type: "asset/resource",
          generator: {
            filename: "static/fonts/[hash][ext]",
          },
        },
      ],
    },
  };
};

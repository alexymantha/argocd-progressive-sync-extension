const path = require('path');
const webpack = require("webpack");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const extName = 'progressive-sync';

const config = {
  entry: {
    extension: './src/index.tsx',
  },
  ignoreWarnings: [{
    module: new RegExp('/node_modules/argo-ui/.*')
  }],
  output: {
    filename: `extensions-${extName}.js`,
    path: __dirname + `/dist/resources/extension-${extName}.js`,
    libraryTarget: 'window',
    library: ['tmp', 'extensions'],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.ttf'],
  },
  optimization: {
    minimize: false,
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],  
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    moment: "Moment",
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        loader: "esbuild-loader",
        options: {
          loader: "tsx",
          target: "es2015",
        },
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'raw-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'raw-loader'],
      },
    ],
  },
};

module.exports = config;

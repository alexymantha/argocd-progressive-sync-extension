const path = require('path');

const extName = 'progressive-sync';

const config = {
  entry: {
    extension: './src/index.tsx',
  },
  output: {
    filename: 'extensions.js',
    path: __dirname + `/dist/resources/${extName}/ui`,
    libraryTarget: 'window',
    library: ['extensions'],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.ttf'],
  },
  externals: {
    react: 'React',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          allowTsInNodeModules: true,
          configFile: path.resolve('./src/tsconfig.json')
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

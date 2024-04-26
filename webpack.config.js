const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /\.html$/,
        loader: HtmlBundlerPlugin.loader,
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  entry: {
    main: './src/index.ts',
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlBundlerPlugin({
      entry: {
        index: 'public/index.html',
      },
    }),
  ],
  devServer: {
    static: false,
    hot: false,
    port: 8080,
  },
};

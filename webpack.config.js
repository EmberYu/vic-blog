const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const path = require('path');

const isPro = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: '[name]-[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    plugins: [
      new TsconfigPathsPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 8080,
    hot: true
  },
  externals: {
    'react': "React",
    'react-dom': "ReactDOM"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, isPro ? './index.production.html' : './index.html'),
      filename: 'index.html',
      title: 'vic\'s blog'
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[hash].css',
      chunkFilename: '[id].css'
    })
  ]
};

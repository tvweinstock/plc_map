const webpack = require('webpack');
const nodeEnv = process.env.NODE_ENV || 'production';
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    filename: ['./app.js']
  },
  output: {
    filename: '_build/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [["es2015", { "modules": false }]]
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader', // The backup style loader
          use: 'css-loader?sourceMap!sass-loader?sourceMap'
        })
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'proccess.env': { NODE_ENV: JSON.stringify(nodeEnv)}
    }),
    new ExtractTextPlugin('_build/styles.css')
  ]
}

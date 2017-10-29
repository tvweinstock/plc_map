const webpack = require("webpack");
const nodeEnv = process.env.NODE_ENV || "production";
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: "source-map",
  entry: {
    filename: ["./app.js"]
  },
  output: {
    filename: "_build/bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: [["es2015", { modules: false }]]
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "proccess.env": { NODE_ENV: JSON.stringify(nodeEnv) }
    })
  ]
};

'use strict'
const config = require('./config')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    publicPath: config.dev.assetsPublicPath
  },
  devServer: {
    publicPath: config.dev.assetsPublicPath,
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrite: []
    },
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: false, // open the brower
    overlay: {
      // Shows a full-screen overlay in the browser
      errors: true,
      warnings: false
    },
    proxy: {
      '/api/*': {
        target: 'http://localhost:8084',
        changeOrigin: true,
        secure: false
      }
    },
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      // Control options related to watching the files
      poll: false,
    },
    inline: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'BASE_URL': '""'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index/index.html',
      inject: true,
      chunks: ['index'],
      chunksSortMode: 'none'
    }),
    new HtmlWebpackPlugin({
      filename: 'admin/index.html',
      template: './src/admin/index.html',
      inject: true,
      chunks: ['admin'],
      chunksSortMode: 'none'
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPortPromise()
    .then(port => {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port
      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: utils.createNotifierCallback()
      }))
      resolve(devWebpackConfig);
    })
    .catch(err => {
      reject(err)
    });
})

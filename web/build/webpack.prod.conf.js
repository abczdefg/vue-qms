'use strict'
const config = require('./config')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: false,
  output: {
    publicPath: config.build.assetsPublicPath,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  optimization: {
  },
  plugins: [
    new CleanWebpackPlugin(['**/*'], {
      root: utils.resolve('../dist'), //根目录
      verbose: true, //开启在控制台输出信息
      dry: false  //启用删除文件
    }),
    new webpack.DefinePlugin({
      'BASE_URL': '""'
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // cssProcessor: The CSS processor used to optimize \ minimize the CSS, defaults to cssnano.
    new OptimizeCSSPlugin(),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: utils.resolve('../dist/index.html'),
      template: './src/index/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunks: ['index'],
      chunksSortMode: 'none'
    }),
    new HtmlWebpackPlugin({
      filename: utils.resolve('../dist/admin.html'),
      template: './src/admin/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunks: ['admin'],
      chunksSortMode: 'none'
    }),
    new CopyWebpackPlugin([
      {
        from: utils.resolve('static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})
module.exports = webpackConfig;

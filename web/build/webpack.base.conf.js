'use strict'
const path = require('path')
const config = require('./config')
const utils = require('./utils')
const vuxLoader = require('vux-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isProductionMode = process.env.NODE_ENV === 'production'

const webpackConfig = {
  context: utils.resolve('./'),
  entry: {
    index: './src/index/main.js',
    admin: './src/admin/main.js'
  },
  output: {
    path: config.build.assetsRoot
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': utils.resolve('src'),
      '@index': utils.resolve('src/index'),
      '@admin': utils.resolve('src/admin')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          cssSourceMap: false,
          cacheBusting: true,
          extract: true,
          usePostCSS: true,
          transformToRequire: {
            // 资源 URL 转换为 webpack 模块请求
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: isProductionMode
              ? MiniCssExtractPlugin.loader
              : 'vue-style-loader',
            options: {
              publicPath: '../../' // rehandle path of resource in import css
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: isProductionMode
              ? MiniCssExtractPlugin.loader
              : 'vue-style-loader',
            options: {
              publicPath: '../../'
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    })
  ]
}
module.exports = vuxLoader.merge(webpackConfig, {
  plugins: [{
    name: 'vux-ui'
  }, {
    name: 'less-theme',
    path: utils.resolve('src/index/assets/less/theme.less')
  }, {
    name: 'duplicate-style'
  }, {
    name: 'progress-bar'
  }]
});

'use strict'
const path = require('path')
module.exports = {
  dev: {
    host: 'localhost',
    port: 8080,
    assetsPublicPath: '/',
    assetsSubDirectory: 'static'
  },
  build: {
    assetsRoot: path.resolve(__dirname, '../../dist'),
    assetsPublicPath: './',
    assetsSubDirectory: 'static'
  }
}

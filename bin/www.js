require('@babel/register') ({
  presets: ['@babel/env'],
  plugins: ['@babel/plugin-transform-runtime']
})

// require('@babel/polyfill');

module.exports = require('../app');
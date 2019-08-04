require('@babel/register') ({
  presets: ['@babel/env']
})

require('@babel/polyfill');

module.exports = require('../app');
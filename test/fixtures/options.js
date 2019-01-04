const { resolve } = require('path');

module.exports = {
  sourceType: 'module',
  plugins: [[resolve(__dirname, '../../src'), { packageName: '@gandi/ui' }]],
};

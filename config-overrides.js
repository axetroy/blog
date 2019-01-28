const { override, fixBabelImports, addBabelPlugin } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  // addBabelPlugin('@babel/plugin-proposal-decorators', {legacy: true})
);
const webpack = require('webpack');

module.exports = function override(config, env) {
  // Añade el plugin para definir process.env
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
    })
  );
  
  // Agrega fallback para 'process'
  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve('process/browser'),
  };

  return config;
}
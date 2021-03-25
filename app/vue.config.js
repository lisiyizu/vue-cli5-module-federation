const deps = require('./package.json').dependencies

module.exports = {
  publicPath: 'http://127.0.0.1:51659',

  chainWebpack: (config) => {
    config.optimization.delete('splitChunks')
    /* module federation plugin import */
    config
      .plugin('module-federation-plugin')
      .use(require('webpack').container.ModuleFederationPlugin, [{
        name: "layout",
        filename: "remoteEntry.js",
        remotes: {
          home: 'home@http://127.0.0.1:50923/remoteEntry.js',
        },
        exposes: {},
        shared: {
          "vue": {
            eager: true,
            singleton: true,
            requiredVersion: deps.vue,
          }
        }
    }])
  },

  devServer: {
    port: 8082,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    }
  }
}
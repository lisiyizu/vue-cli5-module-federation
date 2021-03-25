const deps = require('./package.json').dependencies;
const DashboardPlugin = require("@module-federation/dashboard-plugin");

module.exports = {
  publicPath: '/',
  configureWebpack: config => {
    /* @module-federation/dashboard-plugin, docker: mf-dashboard */
    config.plugins.push(new DashboardPlugin({
      dashboardURL: "http://localhost:3000/api/update"
    }));
    // config.experiments = {
    //   topLevelAwait: true
    // };
  },
  chainWebpack: (config) => {
    config.optimization.delete('splitChunks')
    /* module federation plugin import */
    config
      .plugin('module-federation-plugin')
      .use(require('webpack').container.ModuleFederationPlugin, [{
        name: "home",
        filename: "remoteEntry.js",
        // remotes: {
        //   layout: 'layout@http://localhost:8082/remoteEntry.js',
        // },
        exposes: {
          './HelloWorld': './src/components/HelloWorld.vue'
        },
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
    port: 8081,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    }
  }
}
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8989",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    },
    disableHostCheck: true
  }
};

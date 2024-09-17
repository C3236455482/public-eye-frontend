const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    port: 7000,       // 端口 
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 后端服务器地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' // 将 /api 替换为空，转发到后端
        }
      }
    }
  },
  lintOnSave : false  // 关闭eslint
}

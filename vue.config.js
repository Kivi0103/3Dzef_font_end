const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,  //关闭语法检查
  devServer:{
    proxy:{
      '/api':{
        target:'http://127.0.0.1:5000',
        changeOrigin:true,
        ws:true,
        pathRewrite:{
          '^/api': ''
        }
      }
    }
  }
})

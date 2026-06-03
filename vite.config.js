import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 配置路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),//根目录和绝对路径进行拼接，就表示src这个路径

    },
  },
  // 配置开发服务器
  server: {
    proxy: {
      '/api': {
        target: 'http://159.75.169.224:1235',  // 后端地址
        changeOrigin: true,  // 改变请求源头
        // rewrite: (path) => path.replace(/^\/api/, '')  // 可选：重写路径
      }
    },
    open: true  // 自动打开浏览器
  }

  
})

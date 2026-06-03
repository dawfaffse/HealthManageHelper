import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import service from './utils/request'
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'



const app = createApp(App)
const pinia = createPinia()

// 先使用插件，再添加到应用中
pinia.use(persist)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus).use(router).use(pinia).mount('#app')     

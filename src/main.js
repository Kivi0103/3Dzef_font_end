import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router'
import App from './App.vue'
import store from "@/store/store";
import '@/assets/icons/iconfont.css'
import '@/assets/fonts/font.css'


const app = createApp(App)

app.use(store)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
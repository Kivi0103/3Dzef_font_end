//导入vue-router
import {createRouter, createWebHistory} from "vue-router/dist/vue-router"
//导入组件
import LayoutVue from '@/views/lay-out.vue'
import VideoShowerVue from "@/views/showers/video-shower.vue";
import TableShowerVue from "@/views/showers/table-shower.vue";
import ChartsShowerVue from "@/views/showers/charts-shower.vue";

//定义路由关系
const routes = [
    {path: '/', component: LayoutVue, children:[
            {path: '/video', component:VideoShowerVue},
            {path: '/table', component:TableShowerVue},
            {path: '/charts', component:ChartsShowerVue}
        ]
    }
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

//导出路由
export default router




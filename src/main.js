import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueCookies from "vue-cookies"

const app = createApp(App)
for(const name in ElementPlusIconsVue){
    /*
     * 以elIcon为前缀的命名规则，是为了适配已经使用属性名添加图标的内置组件，
     * 例如：<el-button icon="el-icon-refresh"></el-button>
     */
    app.component( name, ElementPlusIconsVue[name]);
}
app.use(store).use(router).use(ElementPlus).use(VueCookies).mount('#app')

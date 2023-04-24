import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import VueAxios from 'vue-axios';
import axios from 'axios';

createApp(App)
.use(VueAxios, axios)
.use(ElementPlus)
.mount("#app");

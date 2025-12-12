import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import App from './App.vue';
import SlideVerify from 'vue3-slide-verify';
 


const app = createApp(App);
//app.config.globalProperties.$server = 'http://inner.setsu-tech.co.jp:8080';
app.config.globalProperties.$server = 'http://localhost:8080';
//app.config.globalProperties.$server = 'http://127.0.0.1:8082';
app.use(ElementPlus);
app.use(SlideVerify);


app.mount('#app');
// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')

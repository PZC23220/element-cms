import Vue from 'vue';
import ElementUI from 'element-ui';
import router from './router';
import 'element-ui/lib/theme-default/index.css';


Vue.use(ElementUI);


import App from './App.vue'
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

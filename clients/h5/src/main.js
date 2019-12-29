import Vue from 'vue';
import moment from 'moment';
import 'animation.css';
import App from './App.vue';
import router from './route';
import store from './store/index';
import './filters'; // 统一引入过滤器
import './plugins'; // 统一引入插件
import './components/base/vant'; // 统一按需引入vant组件
import './utils/lodash'; // 统一按需引入lodash方法
Vue.config.productionTip = false;

// 挂载moment在Vue上，组件中使用：this.moment
moment.locale('zh-cn');
Vue.prototype.moment = moment;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');


import {
  get,
  cloneDeep,
  debounce,
  throttle
} from 'lodash-es';
import Vue from 'vue';
// 挂载用到的lodash方法，组件中用法：this._.get
Vue.prototype._ = {
  get: get,
  cloneDeep: cloneDeep,
  debounce: debounce,
  throttle: throttle
};

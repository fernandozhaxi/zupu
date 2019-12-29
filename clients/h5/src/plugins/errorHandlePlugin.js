/* eslint-disable no-console */
/**
 * 全局异常处理
 * @param {*} error
 * @param {*} vm
 */
const errorHandler = (error, vm, info) => {
  console.error('【异常】：' + error);
  if (vm) {
    console.error(vm);
  }
  if (info) {
    console.error(info);
  }
};

export default {
  install: Vue => {
    Vue.config.errorHandler = errorHandler;
    Vue.mixin({
      beforeCreate() {
        const methods = this.$options.methods || {};

        Object.keys(methods).forEach(key => {
          const fn = methods[key];

          this.$options.methods[key] = function(...args) {
            const ret = fn.apply(this, args);

            if (
              ret &&
              typeof ret.then === 'function' &&
              typeof ret.catch === 'function'
            ) {
              return ret.catch(errorHandler);
            } else {
              return ret;
            }
          };
        });
      }
    });
    Vue.prototype.$throw = errorHandler;
  }
};

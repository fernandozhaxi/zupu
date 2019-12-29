/**
 * 帮助文件参见Readme.md
 */

import axios from 'axios';
import { trim, get } from 'lodash';
import { Toast } from 'vant';

const rsAxios = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL, // api 的 base_url
  timeout: 5000 // 请求超时时间
});

function handleError(msg) {
  Toast.fail(msg);
}

//直接返回data，避免使用方写出res.data.data这种长路径
rsAxios.interceptors.response.use(
  function(response) {
    if (response.data && response.data.status === 500) {
      handleError('网络500异常');
      return Promise.reject(new Error('网络异常'));
    }
    if (response.data && response.data.status === 429) {
      handleError('网络429异常');
      return Promise.reject(new Error(response));
    }
    if (response.data && response.data.status === 430) {
      handleError('登录过期');
      return Promise.reject(new Error('登录过期'));
    }
    if (response.data && response.data.status === 431) {
      handleError('权限不足');
      return Promise.reject(new Error('权限不足'));
    }
    // 如果返回的content-type为json，但response.data为string
    // 则表明服务器返回了一个错误的json
    const isJson =
      trim(get(response, 'headers[\'content-type\']')).indexOf(
        'application/json'
      ) > -1;
    const isString = typeof response.data === 'string';

    if (isJson && isString) {
      // 如果直接抛出异常会被axios捕获并丢弃，
      // 所以增加setTimeout
      handleError('数据格式错误！');
      setTimeout(() => {
        return Promise.reject(
          new Error('JSON反序列化失败，请检查JSON格式是否合法')
        );
      });
    }
    return response.data;
  },
  function(error) {
    handleError('网络错误！');
    return Promise.reject(new Error('网络错误！' + error));
  }
);

rsAxios.interceptors.request.use(
  function(config) {
    const token = get(window, '__dicMap.token', null);

    if (token) {
      config.headers['X-auth-token'] = token || 'first-time';
    }
    const appname = get(window, '__dicMap.appname', null);

    if (appname && window.location.href && config.url.indexOf('/wapi/') >= 0) {
      config.headers['X-App-Name'] = appname;
    }
    //操作时页面url
    config.headers.href = window.location.href;
    return config;
  },
  function(error) {
    return Promise.reject(new Error('异常：' + error));
  }
);

export default rsAxios;

import Vue from 'vue';
import Router from 'vue-router';
import RootWrapper from '@/views/RootWrapper.vue';
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      component: RootWrapper,
      children: [
        {
          path: '/',
          redirect: '/home'
        },
        {
          path: '/home',
          name: 'home',
          component: () =>
            import(/* webpackChunkName: "PageManage" */ '../views/PageHome.vue'),
          meta: {
            title: '首页'
          }
        },
        {
          path: '/chat',
          name: 'chat',
          component: () =>
            import(/* webpackChunkName: "PageChat" */ '../views/PageChat.vue'),
          meta: {
            title: '聊天'
          }
        },
        {
          path: '/my',
          name: 'my',
          component: () =>
            import(/* webpackChunkName: "PageMy" */ '../views/PageMy.vue'),
          meta: {
            title: '我的'
          }
        }
      ]
    }
  ]
});

router.afterEach(route => {
  // 从路由的元信息中获取 title 属性
  const title = route.meta.title;
  // 当前路由的title存在，且页面的title不等于该路由的title时
  if (title && window.document.title !== title) {
    document.title = route.meta.title;
    // 如果是 iOS 设备，则使用如下 hack 的写法实现页面标题的更新
    const mobile = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(mobile)) {
      const hackIframe = document.createElement('iframe');
      hackIframe.style.display = 'none';
      hackIframe.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      hackIframe.onload = () => {
        setTimeout(() => {
          document.body.removeChild(hackIframe);
        }, 0);
      };
      document.body.appendChild(hackIframe);
    }
  }
});

export default router;

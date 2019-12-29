const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
const isProduction = process.env.NODE_ENV === 'production';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;


function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        // 添加全局可用的样式，在组件中可以直接使用～
        path.resolve(__dirname, './src/assets/style/common.less'),
        path.resolve(__dirname, './src/assets/style/variable.less'),
        path.resolve(__dirname, './src/assets/style/mixin.less')
      ]
    });
}

module.exports = {
  // build 时生成的生产环境构建文件的目录。该目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)。
  outputDir: process.env.outputDir,
  // 指定生成index.html的输出路径。相对于outputDir
  indexPath: 'index.html',
  // 部署应用包时的基本 URL
  publicPath: '',
  // 生成的静态资源 (js、css、img、fonts)的目录。(相对于 outputDir 的)
  assetsDir: 'static',
  css: {
    sourceMap: true,
    loaderOptions: {
      less: {
        modifyVars: {
          // 'button-primary-color': 'yellow' // 自定义vant主题，改变button-primary-color变量颜色
        }
      }
    }
  },
  // 并行
  parallel: require('os').cpus().length > 1,
  // pwa应用配置
  pwa: {},
  // 开发环境配置
  devServer: {
    host: 'localhost',
    port: 8081,
    proxy: {
      '/': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    },
    open: 'Google Chrome',
    overlay: {
      // eslint 有警告时不显示overlay，有错误时显示
      warnings: false,
      errors: true
    }
  },
  // 是否在保存时监测代码格式
  lintOnSave: true,
  // 生产环境是否开启sourceMap
  productionSourceMap: false,
  chainWebpack: config => {
    // 修复HMR失效
    config.resolve.symlinks(true);
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
      .set('plugin', resolve('src/plugins'))
      .set('plugin', resolve('src/filters'))
      .set('directives', resolve('src/directives'))
      .set('store', resolve('src/store'))
      .set('route', resolve('src/route'))
      .set('api', resolve('src/api'))
      .set('utils', resolve('src/utils'));

    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type =>
      addStyleResource(config.module.rule('less').oneOf(type))
    );

    // 生产模式，打包时排除框架，并动态加入cdn
    if (isProduction) {
      // 添加cdn
      const cdn = {
        // css: ['xxx.css', 'sss.js'],
        js: [
          '//unpkg.com/vue@2.6.10/dist/vue.min.js', // 访问https://unpkg.com/vue/dist/vue.min.js获取最新版本
          '//unpkg.com/vue-router@3.0.6/dist/vue-router.min.js',
          '//unpkg.com/vuex@3.1.1/dist/vuex.min.js',
          '//unpkg.com/axios@0.19.0/dist/axios.min.js',
          '//cdn.bootcss.com/moment.js/2.20.1/moment.min.js',
          '//cdn.bootcss.com/moment.js/2.20.1/locale/zh-cn.js',
          '//cdn.bootcss.com/lodash.js/4.17.15/lodash.core.min.js'
        ]
      };
      config.plugin('html').tap(args => {
        args[0].cdn = cdn;
        return args;
      });

      // 排除不打包的框架
      config.externals({
        moment: 'moment',
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        lodash: '_'
      });
    }
    // 压缩图片
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        mozjpeg: { progressive: true, quality: 65 },
        optipng: { enabled: false },
        pngquant: { quality: '65-90', speed: 4 },
        gifsicle: { interlaced: false },
        webp: { quality: 75 }
      });

    // 打包分析
    if (process.env.IS_ANALYZ) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ]);
    }
  }
};

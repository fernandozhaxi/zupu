module.exports = {
  plugins: {
    'postcss-aspect-ratio-mini': {}, // 用来处理元素容器宽高比
    'postcss-write-svg': {
      // 该插件用于绘制1px的细线
      utf8: false
    },
    'postcss-cssnext': {}, // 该插件可以让我们使用CSS未来的特性
    'postcss-px-to-viewport': {
      // 该插件用来将px转换为vw
      viewportWidth: 750, // 视图宽度，一般移动端设计图宽度都是750px（iphone6）
      // van-circle__layer仅在使用 Circle 组件时需要。详见issue：https://github.com/youzan/vant/issues/1948
      selectorBlackList: ['van-circle__layer', 'van', '.ignore-transform-px'], // van会在转换时排除vant组件，避免变小
      minPixelValue: 1, // 小于或等于`1px`不转换为vw
      viewportUnit: 'vw',
      unitPrecision: 3,
      mediaQuery: false // 允许在媒体查询中转换
    },
    cssnano: {
      // 用来压缩和清理CSS代码
      preset: 'advanced',
      autoprefixer: false,
      'postcss-zindex': false
    }
  }
};

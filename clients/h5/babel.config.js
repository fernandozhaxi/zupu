
const plugins = [
  [
    'import',
    {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: name => `${name}/style/less`
    },
    'vant'
  ]
];
// 生产模式，去掉console
if (process.env.NODE_ENV === 'production') {
  plugins.push('transform-remove-console');
}


module.exports = {
  presets: ['@vue/app'],
  plugins: plugins
};

# 项目名称
zupu

# 一、开发流程

### 安装依赖

```
yarn install
```

### 本地运行

```shell
yarn run dev
```

> process.env.NODE_ENV会被设置为‘development’；

### 配置API地址

在根目录下：
> .env.development 开发环境相关
> .env.test 测试环境相关
> .env.production 线上环境相关

### 构建线上包

```shell
yarn run build
```

### 构建测试包

```shell
yarn run build-test
```

### 运行测试

```shell
yarn run test
```

### lint检查代码语法错误

```shell
yarn run lint
```

### 自定义配置

See [Configuration Reference](https://cli.vuejs.org/config/).

# 二、Vue 项目书写规范

## 1、路由

-   path 全小写，多个单词用 - 分开
-   name 与 path 保持一致

```js
{
    path: '/doctor-detail',
    name: 'doctor-detail',
    component: () =>
    import(/* webpackChunkName: "DoctorDetail" */ '../views/DoctorDetail.vue')
}
```

## 2、组件

### 1） 模版结构

-   v-if 和 v-for 不要一起使用，应该用计算属性代替。
-   v-for 中使用唯一 key
-   模版中只包含简单表达式，复杂表达式应该重构为“计算属性”

### 2） 逻辑

```js
// 顺序
export default {
	name: 'DoctorList',
	data() {
		return {};
	},
	props: {},
	components: {},
	beforeRouteEnter() {},
	beforeRouteUpdate() {},
	beforeRouteLeave() {},
	beforeCreate() {},
	created() {},
	beforeMount() {},
	mounted() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	destroyed() {},
	watch: {},
	computed: {},
	directives: {},
	filter: {},
	methods: {}
};
```

-   组件命名

    > 除了根组件外，都应该以多个单词 + 大驼峰命名，

-   data 必须是函数
-   props 定义应该尽量详细

```js
props: {
	status: { // 定义应该尽量详细
		default: '',
		type: String,
		required: true,
		validator: function(value) {
		// props校验，可选
			return ['success', 'error'].indexOf(value) !== -1;
		}
	}
}
```

-

### 3）样式

class 命名

-   语义化命名，
-   全部小写
-   多个单词用 - 连接

# 三、屏幕适配
项目采用视口viewport单位 vw 进行移动端适配。代码尺寸都可以直接写px，  `postcss-px-to-viewport`插件会自动将其转换为vw。
比如设计图按钮宽度为100px，在代码中就直接写：
```css
width: 375px;
```
转换后：
```css
width: 50vw;
```

⚠️注意：vant组件的尺寸不会被转换。
## 默认尺寸

默认设置是以iphone6，即屏幕宽度为750px设置。在写页面时，直接以设计图的尺寸进行编写即可。

如果设计图不是以750为标准设计，则可以在`postcss.config`文件中自行设置。


# 四、全局样式

全局样式位于`src/assets/style`中，全局可用，无需在组件中单独引用。
颜色，边界padding值应该直接使用全局变量，方便统一设置项目主题。

# 五、vant主题自定义

vant支持自定义主题，在`vue.config`文件中的modifyVars中修改vant变量的值即可。

```js
...
 css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 替换primary按钮的文字颜色为黄色
          'button-primary-color': 'yellow'
        }
      }
    }
  },
```


# 六、代码风格

项目使用`eslint`进行代码风格约束。具体规则见：`.eslintrc.js`文件。

在代码`commit`时，`prettier`插件会自动美化某些不规范的代码。
然后会自动执行`vue-cli-service lint`命令检查代码规范。
如果经过上述两步之后，仍然存在不符合规范且无法自动修复的代码（比如语法错误），则需要手动修改后才能提交。


# 七、代码commit规范

我们经常使用 `git commit -m "fix"`来提交代码,但是一些像fix这样的内容太过于简单，不能让人直观地理解这次提交是为了什么。
commitizen工具可以在提交时，按照规范填写一些内容。

全局安装：
> npm install -g commitizen
yarn commit 或 npm run commit 或 git cz 即可执行提交。


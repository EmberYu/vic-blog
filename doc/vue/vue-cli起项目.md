# 使用Vue-cli新建项目后，还要做些什么

最近开了个年度盘点的活动，因为活动周期短，所以新建了一个项目来开发，从业这么久，居然一次新建项目都没搞过，确实有点不应该。然后就根据网上的资料和目前项目的东西，整理了一份创建一个项目时，除了`vue create`之后，还需要补充些什么东西。

## 文件结构

```javascript
- public //vue-cli初始化生成的index.html
  - index.html
  - favicon.ico
- src
  - assets
		- fonts  // 放字体文件
		- images // 放图片
		- styles // 放一些全局的公共样式
	- components	// 所有的组件都放在这里
	- config	// 一些配置文件可以放在这里
	- directives // 指令
	- filters // 过滤器
	- mixins // mixin，但是不推荐使用了，过多的mixin会导致跟踪data变更什么的非常麻烦
	- router // 路由
  - services // 请求
	- store // 全局Store
	- utils // 一些公共的util
	- views // 页面
  - App.vue // 页面入口
  - main.js // 页面配置
- babel.config.js
- postcss.config.js
- prettier.config.js
- vue.config.js

```

## 各种配置

#### babel.config.js

```js
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
let plugins = [
  /* 这里是我们用了nutui的组件库，然后装了个按需加载的包 */
	[
		'@nutui/babel-plugin-separate-import',
		{
			style: 'css',
		},
	],
];
if (IS_PROD) {
  // 如果是生产环境，需要去掉console
	plugins.push(['transform-remove-console', { exclude: ['error', 'warn'] }]);
}

module.exports = {
	presets: ['@vue/cli-plugin-babel/preset'],
	plugins,
};

```

#### postcss.config.js

设计稿基本都是按750宽度来设计的，所以需要用postcss将px转为rem

```js
module.exports = {
	plugins: {
		autoprefixer: {},
		'postcss-pxtorem': {
			rootValue: 75, // 设计稿宽度的 1/10
			unitPrecision: 5, // 小数位
			minPixelValue: 1, // 转换的最小单位
			selectorBlackList: ['.nut'], // 忽略的样式，正则（对第三方UI框架不进行转换）
			propList: ['*'], // 需要做转化处理的属性，如`hight`、`width`、`margin`等，`*`表示全部，正则
		},
	},
};
```

#### prettier.config.js

prettier用来规范代码格式

```js
module.exports = {
	printWidth: 100, // 每行代码长度（默认80）
	tabWidth: 4,
	useTabs: true,
	singleQuote: true, // 字符串是否使用单引号，默认为false，使用双引号
	semi: true, // 行位是否使用分号，默认为true
	trailingComma: 'all', // 是否使用尾逗号
	bracketSpacing: true, // 对象大括号直接是否有空格，默认为true
};

```

#### vue.config.js

````js
const path = require('path');
const resolve = dir => path.join(__dirname, dir);
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

module.exports = {
	publicPath: '/annual_report/', // publicPath 等同于 process.env.BASE_URL，注意一定要这样设置 '/${连接值}/'
	productionSourceMap: !IS_PROD, // 生产环境关闭 sourceMap
	devServer: {
		allowedHosts: ['y.qq.com', 'tmesit.tencentmusic.com', 'yobang.tencentmusic.com'],
	},
	chainWebpack: config => {
		// 添加别名
		config.resolve.alias
			.set('@', resolve('src'))
			.set('@components', resolve('src/components'))
			.set('@views', resolve('src/views'))
			.set('@assets', resolve('src/assets'))
			.set('@client', resolve('src/client'))
			.set('@store', resolve('src/store'))
			.set('@utils', resolve('src/utils'));
		// 为 less 提供全局变量
		const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
		types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)));
		config.plugin('html').tap(args => {
			args[0].title = 'HTML标题';
			return args;
		});
		// 生产环境打包体积分析
		if (process.env.NODE_ENV === 'production' && process.env.npm_config_report) {
			config
				.plugin('webpack-bundle-analyzer')
				.use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
		}
	},
	configureWebpack: config => {},
};

// 全局样式 变量、函数
function addStyleResource(rule) {
	rule.use('style-resource')
		.loader('style-resources-loader')
		.options({
			patterns: [
				resolve('src/styles/variables.less'),
				resolve('src/styles/mixin.less'),
				resolve('src/styles/common.less'),
			],
		});
}

````



#### 参考资料

- [新搭建一个 Vue 项目后，我有了这 15 点思考](https://mp.weixin.qq.com/s/LKaHJX1cwLlkzU7qQ7kkwg)




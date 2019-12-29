# 说明

当前目录存放接口文件，不同模块单独一个文件。组件中引入使用。

```js
import commonAPI from '@/api/common'

methods: {
	getData() {
		try {
			const result = await commonAPI.orgList()
		} catch (err) {
			
		}
	}
}
```

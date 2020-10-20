# egg-yufu

egg yufu plugin

<!--
Description here.
-->

## 依赖说明

### 依赖的 egg 版本

egg-smartproxy 版本 | egg 1.x
--- | ---
1.x | 😁
0.x | ❌

## 开启插件

```js
// config/plugin.js
exports.yufu = {
	enable: true,
	package: 'egg-yufu',
};

```

## 使用场景

- 通过玉符网关，可以使用此插件，获取访问用户的信息
- 使用方式，安装后，启用插件，并参考下面的详细配置

## 详细配置

请到 [config/config.default.js](config/config.default.js) 查看详细配置项说明。
```js
// config/config.*.js
module.exports = {
		yufu: {
				header: {
			uid: 'iv-uid', // 用户id的请求头字段
			userinfo: 'x-iag-userinfo', // 用户信息的请求头字段
		},
		verifyHeader: (headers) => { return true }, // 校验：校验请求头；
		verifyUser: ({ uid, userinfo }) => { return true }, // 校验：校验解析出来的用户信息；
		default_id: 1, //	无法解析时默认返回的	id
		default_user: 'rtx-name', //	无法解析时默认返回的	user
		exclude: path => !path, // 判断输入的路径是否为要排除的目录
		handleError: ({ ctx, ret, msg }) => { ctx.body = { ret, msg }; }, // 如何处理错误
		},
};
```

## 单元测试

<!-- 描述如何在单元测试中使用此插件，例如 schedule 如何触发。无则省略。-->

## 提问交流

## License

[MIT](LICENSE)

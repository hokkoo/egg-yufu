'use strict';
module.exports = {
	yufu: {
		header: {
			uid: 'iv-uid', // 用户id的请求头字段
			userinfo: 'x-iag-userinfo', // 用户信息的请求头字段
		},
		verifyHeader: (headers) => { return true }, // 校验：校验请求头；
		verifyUser: ({ uid, userinfo }) => { return true }, // 校验：校验解析出来的用户信息；
		default_id: 1, //  无法解析时默认返回的  id
		default_user: 'rtx-name', //  无法解析时默认返回的  user
		exclude: path => !path, // 判断输入的路径是否为要排除的目录
		handleError: ({ ctx, ret, msg }) => { ctx.body = { ret, msg }; }, // 如何处理错误
	},
};

'use strict';

var decrypt = require('Base64');

var ok = () => true;

var not = () => false;

module.exports = (options = {}) => {
	const {
		default_user = 'local',
		default_id = 1,
		handleError = ({ ctx, ret, msg }) => { ctx.body = { ret, msg }; },
		exclude = not,
		verifyHeader = ok,
		verifyUser = ok,
	} = options;
	const {
		uid: uidKey,
		userinfo: userinfoKey,
	} = options.header || {};
	/*
		步骤：
			1，排除
			2，校验header
			3，解析 header
			4，校验 用户信息
			5，设置用户信息
			6，异常处理
	*/
	return async (ctx, next) => {
		const { headers, path } = ctx.request;
		if (exclude && exclude(path)) {
			// 如果被排除，不添加任何东西
			ctx.yufu = {};
		} else {
			const defaultUser = {
				id: default_id,
				rtx: default_user,
			};
			try {
				if (verifyHeader(headers) !== true) {
					throw new Error('请求头错误');
				}
				if (!uidKey || !userinfoKey) {
					ctx.yufu = defaultUser;
				}
				const uid = decrypt(headers[uidKey]);
				const userinfo = decrypt(headers[userinfoKey]);
				if (!uid || !userinfo) {
					ctx.yufu = defaultUser;
				}
				if (verifyUser({ uid, userinfo }) !== true) {
					throw new Error('请求头错误');
				}
				ctx.yufu = {
					id: userinfo.user_id || uid,
					rtx: uid,
					userinfo,
				};
			} catch (err) {
				handleError(Object.assign({}, err, { ctx }));
				return;
			}
		}
		await next();
	};
};

'use strict';

var decrypt = require('Base64').atob;

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
				const error = new Error('请求头错误');
				if (verifyHeader(headers) !== true) {
					throw error;
				}
				if (!uidKey || !userinfoKey) {
					ctx.yufu = defaultUser;
				}
				const _uid = headers[uidKey];
				const _userinfo = headers[userinfoKey];
				if (!_uid || !_userinfo) {
					ctx.yufu = defaultUser;
				} else {
					try {
						const uid = decrypt(_uid);
						const userinfo = JSON.parse(decrypt(_userinfo));
						if (verifyUser({ uid, userinfo }) !== true) {
							throw error;
						}
						ctx.yufu = {
							id: userinfo.user_id || uid,
							rtx: uid,
							userinfo,
						};
					} catch (_err) {
						throw error;
					}
				}

			} catch (err) {
				handleError(Object.assign({}, err, { ctx }));
				return;
			}
		}
		await next();
	};
};

'use strict';

const Controller = require('egg').Controller;

class AuthController extends Controller {
  async login() {
    const ctx = this.ctx;
    ctx.validate({
      name: 'string',
      password: 'string',
    });
    const user = await ctx.service.users.login(ctx.request.body);
    if (user.status > 0) {
      ctx.session.user = user.user;
      ctx.body = ctx.helper.returnJson(200, '登录成功', user.user);
    } else if (user.status === 0) {
      ctx.body = ctx.helper.returnJson(500, '密码错误', user.user);
    } else if (user.status === -1) {
      ctx.body = ctx.helper.returnJson(500, '用户不存在', user.user);
    }
  }
  async logout() {
    const ctx = this.ctx;
    ctx.session.user = null;
    ctx.redirect('/');
  }
  async checkLogin() {
    const ctx = this.ctx;
    if (ctx.session.user) {
      ctx.body = ctx.helper.returnJson(200, '登录成功', ctx.session.user);
    } else {
      ctx.body = ctx.helper.returnJson(
        500,
        '登录过期，请重新登录',
        ctx.session.user
      );
    }
  }
}
module.exports = AuthController;

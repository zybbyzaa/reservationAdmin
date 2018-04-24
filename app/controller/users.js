'use strict';

const Controller = require('egg').Controller;

const createRule = {
  name: 'string',
  nickname: 'string',
  password: 'string',
  role_id: 'number',
};
const updateRule = {
  name: 'string',
  nickname: 'string',
  role_id: 'number',
};
const updatePasswordRule = {
  password: {
    type: 'string',
    compare: 'confirm_password',
  },
  confirm_password: 'string',
};

class UsersController extends Controller {
  async index() {
    const ctx = this.ctx;
    const userList = await ctx.service.users.index({
      pageNum: +ctx.query.pageNum || 1,
      pageSize: +ctx.query.pageSize || 10,
    });
    ctx.body = {
      code: 200,
      msg: '获取用户列表成功',
      data: userList,
    };
  }
  async show() {
    const ctx = this.ctx;
    const user = await ctx.service.users.show({
      id: ctx.params.id,
    });
    ctx.body = ctx.helper.returnJson(200, '获取用户列表成功', user);
  }
  async create() {
    const ctx = this.ctx;
    ctx.validate(createRule);
    const newUser = await ctx.service.users.create(ctx.request.body);
    // 设置响应体和状态码
    ctx.body = ctx.helper.returnJson(200, '创建用户成功', newUser);
  }
  async update() {
    const ctx = this.ctx;
    if (ctx.request.body.password) {
      ctx.validate(updatePasswordRule);
    } else {
      ctx.validate(updateRule);
    }
    await ctx.service.users.update(ctx.params.id, ctx.request.body);
    ctx.body = ctx.helper.returnJson(200, '修改用户信息成功');
  }
  async destroy() {
    const ctx = this.ctx;
    await ctx.service.users.destroy(ctx.params.id);
    ctx.body = ctx.helper.returnJson(200, '删除用户成功');
  }
}
module.exports = UsersController;

'use strict';

const Controller = require('egg').Controller;

const createRule = {
  name: 'string',
};

class RolesController extends Controller {
  async index() {
    const ctx = this.ctx;
    const params =
      ctx.query.pageNum || ctx.query.pageSize
        ? {
          pageNum: +ctx.query.pageNum || 1,
          pageSize: +ctx.query.pageSize || 10,
        }
        : {};
    const roleList = await ctx.service.roles.index(params);
    ctx.body = ctx.helper.returnJson(200, '获取角色列表成功', roleList);
  }
  async create() {
    const ctx = this.ctx;
    ctx.validate(createRule);
    const newRole = await ctx.service.roles.create(ctx.request.body);
    ctx.body = ctx.helper.returnJson(200, '创建角色成功', newRole);
  }
  async update() {
    const ctx = this.ctx;
    ctx.validate(createRule);
    await ctx.service.roles.update(ctx.params.id, ctx.request.body);
    ctx.body = ctx.helper.returnJson(200, '修改角色成功');
  }
  async destroy() {
    const ctx = this.ctx;
    if (ctx.params.id === 1) {
      ctx.body = ctx.helper.returnJson(500, '删除失败，管理员角色不能被删除');
    }
    await ctx.service.roles.destroy(ctx.params.id);
    ctx.body = ctx.helper.returnJson(200, '删除角色成功');
  }
}
module.exports = RolesController;

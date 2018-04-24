'use strict';

const Controller = require('egg').Controller;

const createRule = {
  name: 'string',
  enabled: 'boolean',
};

class MenusController extends Controller {
  async index() {
    const ctx = this.ctx;
    const params =
      ctx.query.pageNum || ctx.query.pageSize
        ? {
          pageNum: +ctx.query.pageNum || 1,
          pageSize: +ctx.query.pageSize || 10,
        }
        : {};
    const menuList = await ctx.service.menus.index(params);
    ctx.body = ctx.helper.returnJson(200, '获取菜单列表成功', menuList);
  }
  async create() {
    const ctx = this.ctx;
    ctx.validate(createRule);
    const newMenu = await ctx.service.menus.create(ctx.request.body);
    // 设置响应体和状态码
    ctx.body = ctx.helper.returnJson(200, '创建菜单成功', newMenu);
  }
  async update() {
    const ctx = this.ctx;
    ctx.validate(createRule);
    await ctx.service.menus.update(ctx.params.id, ctx.request.body);
    ctx.body = ctx.helper.returnJson(200, '修改菜单信息成功');
  }
  async destroy() {
    const ctx = this.ctx;
    await ctx.service.menus.destroy(ctx.params.id);
    ctx.body = ctx.helper.returnJson(200, '删除菜单成功');
  }
}
module.exports = MenusController;

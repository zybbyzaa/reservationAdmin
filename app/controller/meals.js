'use strict';

const Controller = require('egg').Controller;

const createRule = {
  name: 'string',
  menu_id: 'number',
};

class MealsController extends Controller {
  async index() {
    const ctx = this.ctx;
    const params =
      ctx.query.pageNum || ctx.query.pageSize
        ? {
          pageNum: +ctx.query.pageNum || 1,
          pageSize: +ctx.query.pageSize || 10,
        }
        : {};
    const mealList = await ctx.service.meals.index(params);
    ctx.body = ctx.helper.returnJson(200, '获取菜式列表成功', mealList);
  }
  async create() {
    const ctx = this.ctx;
    ctx.validate(createRule);
    const newMeal = await ctx.service.meals.create(ctx.request.body);
    ctx.body = ctx.helper.returnJson(200, '创建菜式成功', newMeal);
  }
  async update() {
    const ctx = this.ctx;
    ctx.validate(createRule);
    await ctx.service.meals.update(ctx.params.id, ctx.request.body);
    ctx.body = ctx.helper.returnJson(200, '修改菜式成功');
  }
  async destroy() {
    const ctx = this.ctx;
    await ctx.service.meals.destroy(ctx.params.id);
    ctx.body = ctx.helper.returnJson(200, '删除菜式成功');
  }
  async getMealslastest() {
    const ctx = this.ctx;
    const menuList = await ctx.service.menus.index({ enabled: true });
    if (menuList.count === 0) {
      ctx.body = ctx.helper.returnJson(500, '暂无可用菜单', {
        count: 0,
        rows: [],
      });
    } else {
      const menuId = menuList.rows[0].id;
      const mealList = await ctx.service.meals.index({
        menu_id: menuId,
      });
      ctx.body = ctx.helper.returnJson(200, '获取菜式列表成功', mealList);
    }
  }
}
module.exports = MealsController;

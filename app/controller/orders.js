'use strict';

const Controller = require('egg').Controller;

const createRule = {
  meal_list: 'string',
};

class OrdersController extends Controller {
  async index() {
    const ctx = this.ctx;
    const params =
      ctx.query.pageNum || ctx.query.pageSize
        ? {
          pageNum: +ctx.query.pageNum || 1,
          pageSize: +ctx.query.pageSize || 10,
        }
        : {};
    const orderList = await ctx.service.orders.index(params);
    ctx.body = ctx.helper.returnJson(200, '获取点餐订单列表成功', orderList);
  }
  async create() {
    const ctx = this.ctx;
    ctx.validate(createRule);
    if (!ctx.request.body.user_name) {
      ctx.request.body.user_name = ctx.session.user.nickname;
    }
    const newOrder = await ctx.service.orders.create(ctx.request.body);
    ctx.body = ctx.helper.returnJson(200, '创建点餐订单成功', newOrder);
  }
  async update() {
    const ctx = this.ctx;
    ctx.validate(createRule);
    await ctx.service.orders.update(ctx.params.id, ctx.request.body);
    ctx.body = ctx.helper.returnJson(200, '修改点餐订单成功');
  }
  async destroy() {
    const ctx = this.ctx;
    await ctx.service.orders.destroy(ctx.params.id);
    ctx.body = ctx.helper.returnJson(200, '删除点餐订单成功');
  }
  async getOrderByUserName() {
    const ctx = this.ctx;
    const order = await ctx.service.orders.show({
      user_name: ctx.session.user.nickname,
    });
    ctx.body = ctx.helper.returnJson(200, '获取订单成功', order);
  }
}
module.exports = OrdersController;

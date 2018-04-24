'use strict';

const Service = require('egg').Service;

class OrdersService extends Service {
  async index(params) {
    return await this.ctx.model.Order.getOrderList(params);
  }
  async create(params) {
    return await this.ctx.model.Order.addOrder(params);
  }
  async update(id, fields) {
    return await this.ctx.model.Order.updateOrderById(id, fields);
  }
  async destroy(id) {
    return await this.ctx.model.Order.deleteOrder(id);
  }
  async show(params) {
    return await this.ctx.model.Order.queryOrder(params);
  }
}

module.exports = OrdersService;

'use strict';

const Service = require('egg').Service;

class MenusService extends Service {
  async index(params) {
    return await this.ctx.model.Menu.getMenuList(params);
  }
  async create(params) {
    return await this.ctx.model.Menu.addMenu(params);
  }
  async update(id, fields) {
    return await this.ctx.model.Menu.updateMenuById(id, fields);
  }
  async destroy(id) {
    return await this.ctx.model.Menu.deleteMenu(id);
  }
}

module.exports = MenusService;

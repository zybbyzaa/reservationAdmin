'use strict';

const Service = require('egg').Service;

class UsersService extends Service {
  async index(params) {
    return await this.ctx.model.User.getUserList(params);
  }
  async show(params) {
    return await this.ctx.model.User.queryUser(params);
  }
  async create(params) {
    return await this.ctx.model.User.register(params);
  }
  async update(id, fields) {
    return await this.ctx.model.User.updateUserById(id, fields);
  }
  async destroy(id) {
    return await this.ctx.model.User.deleteUser(id);
  }
  async login(params) {
    const result = await this.ctx.model.User.getUser(params);
    if (result.status > 0) {
      await result.user.logSignin();
    }
    return result;
  }
}

module.exports = UsersService;

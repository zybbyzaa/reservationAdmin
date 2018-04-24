'use strict';

const Service = require('egg').Service;

class RolesService extends Service {
  async index(params) {
    return await this.ctx.model.Role.getRoleList(params);
  }
  async create(params) {
    return await this.ctx.model.Role.addRole(params);
  }
  async update(id, fields) {
    return await this.ctx.model.Role.updateRoleById(id, fields);
  }
  async destroy(id) {
    return await this.ctx.model.Role.deleteRole(id);
  }
}

module.exports = RolesService;

'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Role = app.model.define('role', {
    name: STRING,
    permit: { type: INTEGER, defaultValue: 1 },
  });

  Role.addRole = async function(fields) {
    return await this.create(fields);
  };

  Role.deleteRole = function(id) {
    return this.destroy({
      where: {
        id,
      },
    });
  };

  Role.updateRoleById = function(id, fields) {
    return this.update(fields, {
      where: { id },
    });
  };

  Role.queryRole = async function(params) {
    return await this.findOne({
      where: params,
      attributes: ['id', 'name', 'permit'],
    });
  };

  Role.getRoleList = function(params) {
    const { pageNum, pageSize, ...query } = params;
    const qureyParams = {
      attributes: ['id', 'name', 'permit'],
    };
    if (pageSize) {
      qureyParams.limit = pageSize;
    }
    if (pageNum) {
      qureyParams.offset = (pageNum - 1) * pageSize;
    }
    if (query) {
      qureyParams.where = query;
    }
    return this.findAndCountAll(qureyParams);
  };

  return Role;
};

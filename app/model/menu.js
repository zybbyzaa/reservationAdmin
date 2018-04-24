'use strict';

module.exports = app => {
  const { STRING, BOOLEAN } = app.Sequelize;

  const Menu = app.model.define('menu', {
    name: STRING,
    phone: STRING,
    enabled: BOOLEAN,
  });

  Menu.queryMenu = async function(params) {
    return await this.findOne({
      where: params,
      attributes: ['id', 'name', 'phone', 'enabled'],
    });
  };

  Menu.addMenu = async function(fields) {
    return await this.create(fields);
  };

  Menu.deleteMenu = function(id) {
    return this.destroy({
      where: {
        id,
      },
    });
  };

  Menu.updateMenuById = function(id, fields) {
    return this.update(fields, {
      where: { id },
    });
  };

  Menu.getMenuList = function(params) {
    const { pageNum, pageSize, ...query } = params;
    const qureyParams = {
      attributes: ['id', 'name', 'phone', 'enabled'],
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

  return Menu;
};

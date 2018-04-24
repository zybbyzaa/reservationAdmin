'use strict';

module.exports = app => {
  const { STRING, Op } = app.Sequelize;

  const Order = app.model.define('order', {
    user_name: STRING,
    meal_list: STRING,
  });

  Order.addOrder = async function(fields) {
    return await this.create(fields);
  };

  Order.deleteOrder = function(id) {
    return this.destroy({
      where: {
        id,
      },
    });
  };

  Order.updateOrderById = function(id, fields) {
    return this.update(fields, {
      where: { id },
    });
  };

  Order.queryOrder = async function(params) {
    return await this.findOne({
      where: {
        ...params,
        created_at: {
          [Op.between]: [
            new Date(new Date(new Date().toLocaleDateString()).getTime()),
            new Date(
              new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
            ),
          ],
        },
      },
      attributes: ['id', 'user_name', 'meal_list'],
    });
  };

  Order.getOrderList = function(params) {
    const { pageNum, pageSize, ...query } = params;
    const queryParams = {
      attributes: ['id', 'user_name', 'meal_list'],
    };
    if (pageSize) {
      queryParams.limit = pageSize;
    }
    if (pageNum) {
      queryParams.offset = (pageNum - 1) * pageSize;
    }
    if (query) {
      queryParams.where = {
        ...query,
        created_at: {
          [Op.between]: [
            new Date(new Date(new Date().toLocaleDateString()).getTime()),
            new Date(
              new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
            ),
          ],
        },
      };
    }
    return this.findAndCountAll(queryParams);
  };

  return Order;
};

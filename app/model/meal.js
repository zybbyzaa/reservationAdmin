'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Meal = app.model.define('meal', {
    name: STRING,
    menu_id: INTEGER,
  });

  Meal.addMeal = async function(fields) {
    return await this.create(fields);
  };

  Meal.deleteMeal = function(id) {
    return this.destroy({
      where: {
        id,
      },
    });
  };

  Meal.updateMealById = function(id, fields) {
    return this.update(fields, {
      where: { id },
    });
  };

  Meal.queryMeal = async function(params) {
    return await this.findOne({
      where: params,
      attributes: ['id', 'name', 'menu_id'],
    });
  };

  Meal.getMealList = function(params) {
    const { pageNum, pageSize, ...query } = params;
    const queryParams = {
      attributes: ['id', 'name', 'menu_id'],
    };
    if (pageSize) {
      queryParams.limit = pageSize;
    }
    if (pageNum) {
      queryParams.offset = (pageNum - 1) * pageSize;
    }
    if (query) {
      queryParams.where = query;
    }
    return this.findAndCountAll(queryParams);
  };

  return Meal;
};

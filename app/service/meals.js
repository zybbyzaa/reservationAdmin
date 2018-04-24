'use strict';

const Service = require('egg').Service;

class MealsService extends Service {
  async index(params) {
    return await this.ctx.model.Meal.getMealList(params);
  }
  async create(params) {
    return await this.ctx.model.Meal.addMeal(params);
  }
  async update(id, fields) {
    return await this.ctx.model.Meal.updateMealById(id, fields);
  }
  async destroy(id) {
    return await this.ctx.model.Meal.deleteMeal(id);
  }
}

module.exports = MealsService;

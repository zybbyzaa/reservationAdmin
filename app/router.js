'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/:page?', controller.home.index);
  router.resources('roles', '/api/roles', controller.roles);
  router.resources('users', '/api/users', controller.users);
  router.resources('menus', '/api/menus', controller.menus);
  router.resources('meals', '/api/meals', controller.meals);
  router.get('/api/getMealslastest', controller.meals.getMealslastest);
  router.resources('orders', '/api/orders', controller.orders);
  router.get('/api/getOrderByUserName', controller.orders.getOrderByUserName);
  router.post('/api/auth/login', controller.auth.login);
  router.get('/api/auth/logout', controller.auth.logout);
  router.get('/api/auth/checkLogin', controller.auth.checkLogin);
};

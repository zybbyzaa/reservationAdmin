'use strict';

module.exports = app => {
  app.beforeStart(async function() {
    await app.model.sync({ force: false });

    // init数据库操作
    const role = {
      name: '管理员',
      permit: 0,
    };
    const admin = await app.model.Role.queryRole({ name: role.name });
    if (!admin) {
      await app.model.Role.addRole(role);
    }

    const user = {
      name: 'admin',
      nickname: '管理员',
      password: '123456',
      role_id: 1,
    };
    const userAdmin = await app.model.User.queryUser({ name: user.name });
    if (!userAdmin) {
      await app.model.User.register(user);
    }
  });
};

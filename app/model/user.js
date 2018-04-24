'use strict';
const bcrypt = require('bcryptjs');

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    name: STRING,
    email: STRING,
    hashedPassword: STRING,
    last_sign_in_at: DATE,
    role_id: INTEGER,
    nickname: STRING,
  });

  User.register = async function(fields) {
    fields.hashedPassword = User.hashPassword(fields.password);
    delete fields.password;
    return await this.create(fields);
  };

  User.getUser = async function({ name, password }) {
    return await this.authenticate(name, password);
  };

  User.authenticate = async function(name, password) {
    const user = await this.findOne({
      where: { name },
      attributes: [
        'id',
        'name',
        'nickname',
        'email',
        'role_id',
        'hashedPassword',
      ],
    });
    if (!user) return { status: -1 };
    const role = (await app.model.Role.queryRole({ id: user.role_id })) || {
      permit: 1,
    };
    user.permit = role.permit;
    return bcrypt.compareSync(password, user.hashedPassword)
      ? delete user.dataValues.hashedPassword && { user, status: 1 }
      : { status: 0 };
  };

  // 查询指定参数
  User.queryUser = async function(params) {
    return await this.findOne({
      where: params,
      attributes: ['id', 'name', 'role_id', 'nickname', 'email'],
    });
  };

  User.getUserList = function(params) {
    const { pageNum, pageSize, ...query } = params;
    const qureyParams = {
      attributes: ['id', 'name', 'role_id', 'nickname', 'email'],
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

  User.deleteUser = function(id) {
    return this.destroy({
      where: {
        id,
      },
    });
  };

  User.updateUserById = function(id, fields) {
    if (fields.password) {
      fields.hashedPassword = User.hashPassword(fields.password);
      delete fields.password;
      delete fields.confirm_password;
    }
    return this.update(fields, {
      where: { id },
    });
  };

  User.hashPassword = function(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  User.prototype.logSignin = async function() {
    await this.update({ last_sign_in_at: new Date() });
  };

  return User;
};

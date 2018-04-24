'use strict';

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1523330848462_6606';

  // add your config here
  config.middleware = [ 'errorHandler' ];

  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'reservation',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '123456',
    timezone: '+08:00',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  return config;
};

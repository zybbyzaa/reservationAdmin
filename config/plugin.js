'use strict';

// had enabled by egg
exports.static = true;

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.session = true;

exports.validate = {
  enable: true,
  package: 'egg-validate',
};

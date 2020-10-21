'use strict';
module.exports = (sequelize, DataTypes) => {
  const Radius = sequelize.define('Radius', {
    name: DataTypes.STRING
  }, {});
  Radius.associate = function (models) {
    // associations can be defined here
  };
  return Radius;
};


'use strict';
module.exports = (sequelize, DataTypes) => {
  const apotik = sequelize.define('apotik', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  apotik.associate = function(models) {
    // associations can be defined here
  };
  return apotik;
};
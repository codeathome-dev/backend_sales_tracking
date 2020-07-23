'use strict';
module.exports = (sequelize, DataTypes) => {
  const sales = sequelize.define('sales', {
    fullname: DataTypes.STRING,
    address: DataTypes.STRING,
    ttl: DataTypes.DATE,
    status: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {});
  sales.associate = function(models) {
    // associations can be defined here
  };
  return sales;
};
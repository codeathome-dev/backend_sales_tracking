'use strict';
module.exports = (sequelize, DataTypes) => {
  const checkout = sequelize.define('checkout', {
    notes: DataTypes.STRING,
    status: DataTypes.STRING,
    lat: DataTypes.STRING,
    long: DataTypes.STRING
  }, {});
  checkout.associate = function(models) {
    // associations can be defined here
  };
  return checkout;
};
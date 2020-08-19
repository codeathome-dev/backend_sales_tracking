"use strict";
module.exports = (sequelize, DataTypes) => {
  const order = sequelize.define(
    "order",
    {
      sales_id: DataTypes.INTEGER,
      detailtrip_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      checkout_id: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
    },
    { underscored: true }
  );
  order.associate = function (models) {
    // associations can be defined here
  };
  return order;
};

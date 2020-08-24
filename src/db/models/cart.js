"use strict";
module.exports = (sequelize, DataTypes) => {
  const cart = sequelize.define(
    "cart",
    {
      product_id: DataTypes.INTEGER,
      // sales_id: DataTypes.INTEGER,
      detailtrip_id: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
    },
    { underscored: true }
  );
  cart.associate = function (models) {
    // associations can be defined here
    cart.belongsTo(sequelize.models.product, {
      foreignKey: "product_id",
    });
    cart.belongsTo(sequelize.models.detailtrip, {
      foreignKey: "detailtrip_id",
    });
  };
  return cart;
};

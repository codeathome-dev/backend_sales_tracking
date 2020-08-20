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
    order.belongsTo(sequelize.models.sales, {
      foreignKey: "sales_id",
    });
    order.belongsTo(sequelize.models.checkout, {
      foreignKey: "checkout_id",
    });
    order.belongsTo(sequelize.models.product, {
      foreignKey: "product_id",
    });
    order.belongsTo(sequelize.models.detailtrip, {
      foreignKey: "detailtrip_id",
    });
  };
  return order;
};

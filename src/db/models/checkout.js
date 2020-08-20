"use strict";
module.exports = (sequelize, DataTypes) => {
  const checkout = sequelize.define(
    "checkout",
    {
      sales_id: DataTypes.INTEGER,
      apotik_id: DataTypes.INTEGER,
      image: DataTypes.STRING,
      notes: DataTypes.STRING,
      status: DataTypes.STRING,
      lat: DataTypes.STRING,
      long: DataTypes.STRING,
    },
    { underscored: true }
  );
  checkout.associate = function (models) {
    // associations can be defined here
    checkout.belongsTo(sequelize.models.sales, {
      foreignKey: "sales_id",
    });
    checkout.belongsTo(sequelize.models.apotik, {
      foreignKey: "apotik_id",
    });
  };
  return checkout;
};

"use strict";
module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define(
    "product",
    {
      name: DataTypes.STRING,
      tgl_ex: DataTypes.STRING,
      price: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      image: DataTypes.STRING,
    },
    { underscored: true }
  );
  product.associate = function (models) {
    // associations can be defined here
  };
  return product;
};

"use strict";
module.exports = (sequelize, DataTypes) => {
  const sales = sequelize.define(
    "sales",
    {
      fullname: DataTypes.STRING,
      address: DataTypes.STRING,
      ttl: DataTypes.DATE,
      status: DataTypes.STRING,
      image: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    { underscored: true }
  );
  sales.associate = function (models) {
    // associations can be defined here

    sales.belongsTo(sequelize.models.user, {
      foreignKey: "user_id",
    });
  };
  return sales;
};

"use strict";
module.exports = (sequelize, DataTypes) => {
  const trip = sequelize.define(
    "trip",
    {
      apotik_id: DataTypes.INTEGER,
      sales_id: DataTypes.INTEGER,
      day: DataTypes.DATE,
      status: DataTypes.STRING,
    },
    { underscored: true }
  );
  trip.associate = function (models) {
    // associations can be defined here
    trip.belongsTo(sequelize.models.sales, {
      foreignKey: "sales_id",
    });
    trip.belongsTo(sequelize.models.apotik, {
      foreignKey: "apotik_id",
    });
  };
  return trip;
};

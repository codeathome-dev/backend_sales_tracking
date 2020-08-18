"use strict";
module.exports = (sequelize, DataTypes) => {
  const detailtrip = sequelize.define(
    "detailtrip",
    {
      sales_id: DataTypes.INTEGER,
      trip_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {}
  );
  detailtrip.associate = function (models) {
    // associations can be defined here
    detailtrip.belongsTo(sequelize.models.sales, {
      foreignKey: "sales_id",
    });
    detailtrip.belongsTo(sequelize.models.trip, {
      foreignKey: "trip_id",
    });
  };
  return detailtrip;
};

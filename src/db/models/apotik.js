"use strict";
module.exports = (sequelize, DataTypes) => {
  const apotik = sequelize.define(
    "apotik",
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      status: DataTypes.STRING,
      lat: DataTypes.STRING,
      long: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    { underscored: true }
  );
  apotik.associate = function (models) {
    // associations can be defined here
  };
  return apotik;
};

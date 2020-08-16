"use strict";
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      username: DataTypes.STRING,
      nik: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    { underscored: true }
  );
  user.associate = function (models) {
    // associations can be defined here
    user.hasMany(models.sales);
  };

  user.beforeCreate((user, _) => {
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
  });

  user.prototype.checkPassword = (password, userPassword) => {
    return bcrypt.compareSync(password, userPassword);
  };

  user.prototype.generateAuthToken = (user) => {
    const token = sign(
      {
        user: {
          id: user.id,
          username: user.username,
          status: user.status,
          role: user.role,
        },
      },
      "secret"
    );

    return token;
  };

  return user;
};

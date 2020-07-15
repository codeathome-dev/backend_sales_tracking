"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync("rahasia", salt);
    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: "admin",
          nik: "12345678",
          password: password,
          role: "admin",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};

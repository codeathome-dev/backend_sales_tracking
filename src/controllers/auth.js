const { user } = require("../db/models");

module.exports = {
  signin: async (req, res) => {
    const { username, password } = req.body;
    try {
      const checkUser = await user.findOne({
        where: {
          username,
        },
      });

      if (!checkUser) {
        res.send({
          code: 404,
          message: `Not found, Can't find user with username: ${username}`,
        });
      }

      const isPasswordTrue = checkUser.checkPassword(
        password,
        checkUser.password
      );

      if (!isPasswordTrue) {
        res.send({
          code: 403,
          message: "Forbidden, Your password is invalid!",
        });
      }

      delete checkUser.dataValues.password;

      const token = checkUser.generateAuthToken(user);

      res.send({
        code: 200,
        data: { checkUser, token },
      });
    } catch (error) {
      res.send({
        code: 500,
        message: "Internal server error",
      });
    }
  },
};

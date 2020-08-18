const { apotik, trip, sales, user, detailtrip } = require("../db/models");

module.exports = {
  signin: async (req, res) => {
    const { nik, password } = req.body;
    try {
      const checkUser = await user.findOne({
        where: {
          nik,
        },
        include: [{ model: sales }],
      });

      if (!checkUser) {
        res.send({
          code: 404,
          message: `Not found, Can't find user with nik: ${nik}`,
        });
      }

      if (checkUser.role === "sales") {
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
      } else if (checkUser.role === "supervisor") {
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
      } else {
        res.send({
          code: 403,
          message: "Forbidden, Your role is invalid!",
        });
      }
    } catch (error) {
      res.send({
        code: 500,
        message: "Internal server error",
      });
    }
  },

  getTripSingleSales: async (req, res) => {
    try {
      const { sales_id } = req.params;
      const data = await detailtrip.findAll({
        where: { sales_id: sales_id },
        include: [
          {
            model: trip,
            include: [{ model: apotik }],
          },
          { model: sales },
        ],
      });

      res.status(200).json({
        message: "Success Read trip",
        data,
      });
    } catch (error) {
      console.log(error);
      res.send({
        code: 500,
        message: "Internal server error!",
      });
    }
  },
};

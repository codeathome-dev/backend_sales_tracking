const { apotik, trip, sales, user } = require("../db/models");

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
      const data = await trip.findAll({
        where: { sales_id: sales_id },
        include: [{ model: apotik }, { model: sales }],
      });

      let trips = [];
      data.forEach((data) => {
        trips.push({
          id: data.id,
          day: data.day,
          //   address: data.address,
          apotik_id: data.apotik ? data.apotik.id : "",
          name_apotik: data.apotik ? data.apotik.name : "",
          image: data.apotik ? data.apotik.image : "",
          address_apotik: data.apotik ? data.apotik.address : "",
          sales_id: data.sale ? data.sale.id : "",
          fullname: data.sale ? data.sale.fullname : "",
        });
      });
      res.status(200).json({
        message: "Success Read trip",
        data: trips,
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
